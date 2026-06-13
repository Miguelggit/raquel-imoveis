# Feature 004 — Autenticação (Spring Security + JWT)

## Visão Geral

| Campo         | Valor                                              |
|---------------|----------------------------------------------------|
| Feature       | Autenticação com Spring Security e JWT             |
| Módulo        | `auth`                                             |
| Prioridade    | Alta (segurança antes do deploy)                   |
| Dependências  | Features 001, 002, 003                             |
| Sprint        | 2 semanas                                          |
| Entrega       | Login, geração de token, validação de token        |
| Validação     | Postman                                            |

## Objetivo

Implementar autenticação via JWT para que a Raquel (admin) consiga fazer login e receber um token. Esse token será usado nas próximas features para proteger os endpoints administrativos.

## Fora do Escopo (não implementar agora)

- Cadastro de novos usuários (Raquel é a única, seed no banco)
- Recuperação de senha
- Refresh token
- OAuth2 / login social
- Roles múltiplas (ADMIN, CORRETOR, CLIENTE)

---

## Entidade: Usuario

### Campos

| Campo       | Tipo           | Obrigatório | Observações                          |
|-------------|----------------|-------------|--------------------------------------|
| `id`        | Long           | Auto        | PK, `@GeneratedValue(IDENTITY)`     |
| `nome`      | String         | Sim         | Nome do usuário                      |
| `email`     | String         | Sim         | Unique, usado como login             |
| `senha`     | String         | Sim         | Hash BCrypt, nunca texto puro        |
| `role`      | String/Enum    | Sim         | Default: ADMIN                       |
| `ativo`     | Boolean        | Sim         | Default: true                        |
| `criadoEm`  | LocalDateTime  | Auto        | @PrePersist                          |

### Seed inicial

A Raquel será cadastrada diretamente no banco via script SQL (init.sql ou migration). Não haverá endpoint de cadastro de usuário no MVP.

```sql
INSERT INTO tb_usuarios (nome, email, senha, role, ativo, dt_hr_criado)
VALUES ('Raquel', 'raquel@raquelimoveis.com.br', '$2a$10$HASH_BCRYPT_AQUI', 'ADMIN', true, NOW());
```

A senha é gerada com BCrypt antes de inserir. Pode gerar via Java ou site online.

---

## Dependências Maven

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

---

## Endpoints

### POST /api/auth/login — Fazer login

**Request Body:**

```json
{
  "email": "raquel@raquelimoveis.com.br",
  "senha": "senha123"
}
```

**Response — 200 OK:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tipo": "Bearer",
  "email": "raquel@raquelimoveis.com.br",
  "nome": "Raquel"
}
```

**Critérios de aceitação:**

- [ ] Login com credenciais válidas retorna 200 com token JWT
- [ ] Login com email inexistente retorna 401
- [ ] Login com senha errada retorna 401
- [ ] Token contém email do usuário no payload (claims)
- [ ] Token tem expiração configurável (sugestão: 24h)
- [ ] Senha nunca é retornada no response

---

## Arquitetura do JWT

### Fluxo de autenticação

```
1. Raquel envia email + senha → POST /api/auth/login
2. Backend valida credenciais no banco (BCrypt)
3. Se válido → gera token JWT com email e expiração
4. Retorna token no response
5. Raquel usa o token nos próximos requests:
   Header: Authorization: Bearer eyJhbG...
6. Backend valida o token em cada request protegido
```

### Estrutura do Token JWT

```
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "raquel@raquelimoveis.com.br", "iat": 1717200000, "exp": 1717286400 }
Signature: HMACSHA256(header + payload, chave-secreta)
```

### Configuração no application.yaml

```yaml
app:
  jwt:
    secret: chave-secreta-minima-256-bits
    expiration: 86400000  # 24 horas em milissegundos
```

---

## Arquivos

```
auth/
├── controller/
│   └── AuthController.java
├── dto/
│   ├── LoginRequestDTO.java
│   └── LoginResponseDTO.java
├── model/
│   └── Usuario.java
├── repository/
│   └── UsuarioRepository.java
├── service/
│   ├── AuthService.java
│   └── JwtService.java
└── config/
    └── SecurityConfig.java (configuração básica)

```

### Responsabilidade de cada classe

- **AuthController** — recebe login, delega pra AuthService
- **LoginRequestDTO** — email + senha
- **LoginResponseDTO** — token + tipo + email + nome
- **Usuario** — entidade JPA, implementa UserDetails
- **UsuarioRepository** — findByEmail
- **AuthService** — valida credenciais, chama JwtService pra gerar token
- **JwtService** — gera token, valida token, extrai claims
- **SecurityConfig** — configuração do Spring Security (por enquanto só libera tudo, proteção vem na Feature 005)

---

## Conceitos para estudar antes

1. **Spring Security** — o que é SecurityFilterChain, como funciona o fluxo de autenticação
2. **BCrypt** — hash de senha, por que nunca salvar senha em texto puro
3. **JWT** — o que é, como funciona, header/payload/signature
4. **UserDetails** — interface do Spring Security que a entidade Usuario implementa
5. **Bearer Token** — padrão de enviar token no header Authorization

---

## Testes via Postman

### Login com sucesso

```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "email": "raquel@raquelimoveis.com.br",
  "senha": "senha123"
}
```

### Login com email errado

```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "email": "naoexiste@email.com",
  "senha": "senha123"
}
```

### Login com senha errada

```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "email": "raquel@raquelimoveis.com.br",
  "senha": "senhaerrada"
}
```

---

## Casos de Teste Unitário

### JwtService (4 testes)

```
deveGerarToken_quandoEmailValido
deveRetornarEmail_quandoTokenValido
deveRetornarTrue_quandoTokenNaoExpirado
deveRetornarFalse_quandoTokenExpirado
```

### AuthService (3 testes)

```
deveRetornarToken_quandoCredenciaisValidas
deveLancarExcecao_quandoEmailNaoExistir
deveLancarExcecao_quandoSenhaIncorreta
```

---

## Definition of Done

- [ ] Entidade Usuario criada com senha BCrypt
- [ ] Seed da Raquel inserido no banco
- [ ] Endpoint de login funcionando
- [ ] Token JWT gerado com expiração
- [ ] Token contém email no payload
- [ ] Credenciais inválidas retornam 401
- [ ] Senha nunca exposta no response
- [ ] 7 testes unitários passando
- [ ] Testado via Postman
- [ ] PR mergeado na dev
