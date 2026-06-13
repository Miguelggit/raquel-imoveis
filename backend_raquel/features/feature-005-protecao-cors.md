# Feature 005 — Separação de Endpoints + Proteção + CORS

## Visão Geral

| Campo         | Valor                                              |
|---------------|----------------------------------------------------|
| Feature       | Separação público/admin, proteção JWT e CORS       |
| Módulo        | `auth` / `config`                                  |
| Prioridade    | Alta (última feature antes do frontend)            |
| Dependências  | Feature 004 (Autenticação)                         |
| Sprint        | 1 semana                                           |
| Entrega       | Endpoints protegidos, CORS configurado             |
| Validação     | Postman                                            |

## Objetivo

Aplicar a autenticação JWT criada na Feature 004 para proteger os endpoints administrativos. Endpoints públicos (leitura) ficam abertos. Configurar CORS para permitir que o frontend React se comunique com a API.

## Fora do Escopo

- Roles granulares (ADMIN, EDITOR, VIEWER)
- Rate limiting
- Refresh token
- Logout (JWT é stateless — basta descartar o token no client)

---

## Separação de Endpoints

### Endpoints PÚBLICOS (sem token)

Qualquer pessoa acessa. São os endpoints que o frontend da vitrine consome.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/auth/login | Fazer login |
| GET | /api/agenciamentos | Listar com filtros e paginação |
| GET | /api/agenciamentos/{id} | Detalhe do agenciamento |
| GET | /api/agenciamentos/{id}/fotos | Listar fotos |
| GET | /api/agenciamentos/fotos/{nomeArmazenado} | Servir imagem |

### Endpoints PROTEGIDOS (requerem token Bearer)

Somente a Raquel (autenticada) acessa.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/agenciamentos | Cadastrar agenciamento |
| PUT | /api/agenciamentos/{id} | Editar agenciamento |
| DELETE | /api/agenciamentos/{id} | Desativar agenciamento |
| POST | /api/agenciamentos/{id}/fotos | Upload de foto |
| DELETE | /api/agenciamentos/fotos/{id} | Remover foto |

### Regra geral

- **GET** → público
- **POST, PUT, DELETE** → protegido (exceto login)

---

## Implementação no SecurityConfig

### JwtAuthenticationFilter

Um filtro que intercepta cada request, verifica se tem o header `Authorization: Bearer <token>`, valida o token e autentica o usuário no contexto do Spring Security.

### Fluxo de cada request protegido

```
1. Request chega com header: Authorization: Bearer eyJhbG...
2. JwtAuthenticationFilter intercepta
3. Extrai o token do header
4. Valida o token via JwtService (assinatura + expiração)
5. Extrai o email do token
6. Busca o usuário no banco
7. Autentica no SecurityContext
8. Request segue pro Controller normalmente
```

### Fluxo de request sem token em rota protegida

```
1. Request chega sem header Authorization
2. JwtAuthenticationFilter não encontra token
3. Spring Security rejeita com 401 Unauthorized
```

### Fluxo de request público

```
1. Request chega (GET /api/agenciamentos)
2. JwtAuthenticationFilter verifica — rota é pública
3. Request segue sem autenticação
```

---

## CORS (Cross-Origin Resource Sharing)

### O que é

Quando o frontend React roda em `http://localhost:5173` e a API roda em `http://localhost:8080`, o navegador bloqueia as requisições por serem de origens diferentes. O CORS libera origens específicas.

### Configuração

```yaml
app:
  cors:
    allowed-origins: http://localhost:5173
```

Na SecurityConfig, configurar:

- **Origens permitidas:** `http://localhost:5173` (dev), domínio de produção (depois)
- **Métodos permitidos:** GET, POST, PUT, DELETE, OPTIONS
- **Headers permitidos:** Authorization, Content-Type
- **Credentials:** true

---

## Arquivos novos/modificados

```
auth/
├── config/
│   └── SecurityConfig.java          ← MODIFICA (adiciona filtro JWT + CORS + regras)
├── filter/
│   └── JwtAuthenticationFilter.java ← NOVO (filtro que valida token)
└── service/
    └── JwtService.java              ← já existe (adiciona método de validação)
```

---

## Critérios de Aceitação

### Proteção de endpoints

- [ ] GET /api/agenciamentos funciona sem token
- [ ] GET /api/agenciamentos/{id} funciona sem token
- [ ] GET /api/agenciamentos/{id}/fotos funciona sem token
- [ ] GET /api/agenciamentos/fotos/{nome} funciona sem token
- [ ] POST /api/agenciamentos sem token retorna 401
- [ ] PUT /api/agenciamentos/{id} sem token retorna 401
- [ ] DELETE /api/agenciamentos/{id} sem token retorna 401
- [ ] POST /api/agenciamentos/{id}/fotos sem token retorna 401
- [ ] DELETE /api/agenciamentos/fotos/{id} sem token retorna 401
- [ ] POST /api/agenciamentos com token válido retorna 201
- [ ] PUT /api/agenciamentos/{id} com token válido retorna 200
- [ ] DELETE /api/agenciamentos/{id} com token válido retorna 204
- [ ] POST /api/auth/login funciona sem token
- [ ] Request com token expirado retorna 401
- [ ] Request com token inválido/adulterado retorna 401

### CORS

- [ ] Request do frontend (localhost:5173) é aceito
- [ ] Request de origem não autorizada é bloqueado
- [ ] Preflight request (OPTIONS) retorna 200

---

## Testes via Postman

### Fluxo completo de teste

```
1. Login:
   POST /api/auth/login → recebe token

2. Testar rota pública SEM token:
   GET /api/agenciamentos → 200 OK

3. Testar rota protegida SEM token:
   POST /api/agenciamentos → 401 Unauthorized

4. Testar rota protegida COM token:
   POST /api/agenciamentos
   Header: Authorization: Bearer eyJhbG...
   → 201 Created

5. Testar com token expirado:
   POST /api/agenciamentos
   Header: Authorization: Bearer token-expirado
   → 401 Unauthorized
```

### No Postman — como enviar o token

1. Faz login, copia o token do response
2. Na aba **Authorization** do request
3. Seleciona **Bearer Token**
4. Cola o token

---

## Casos de Teste Unitário

### JwtAuthenticationFilter (4 testes)

```
deveAutenticar_quandoTokenValido
deveRejeitar_quandoTokenAusente
deveRejeitar_quandoTokenExpirado
deveRejeitar_quandoTokenInvalido
```

### SecurityConfig — testes de integração (6 testes)

```
devePermitirAcesso_quandoEndpointPublicoSemToken
deveBloquearAcesso_quandoEndpointProtegidoSemToken
devePermitirAcesso_quandoEndpointProtegidoComTokenValido
deveBloquearAcesso_quandoTokenExpirado
devePermitirLogin_semToken
deveRetornar401_quandoCredenciaisInvalidas
```

**Nota:** Os testes do SecurityConfig são testes de integração com `@SpringBootTest` e `MockMvc`. São mais avançados que os unitários que você fez até agora, mas seguem o mesmo raciocínio: prepara, executa, verifica.

---

## Definition of Done

- [ ] Endpoints GET acessíveis sem autenticação
- [ ] Endpoints POST/PUT/DELETE protegidos com JWT
- [ ] Token inválido/expirado retorna 401
- [ ] CORS configurado para o frontend
- [ ] JwtAuthenticationFilter funcionando
- [ ] Testado via Postman (fluxo completo com e sem token)
- [ ] Testes unitários passando
- [ ] PR mergeado na dev
- [ ] PR dev → main (backend completo)
