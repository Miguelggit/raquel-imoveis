# Raquel Marinho Imóveis

> Vitrine imobiliária com painel administrativo

🔗 **[www.raquelmarinhoimoveis.com.br](https://www.raquelmarinhoimoveis.com.br)**

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-6DB33F?logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.4-4479A1?logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## O que é

A corretora Raquel Marinho precisava divulgar seus imóveis sem depender de portais de terceiros. O projeto entrega uma **vitrine pública** onde o cliente filtra e visualiza os imóveis, e um **painel administrativo** onde a corretora cadastra, edita e publica os anúncios com suas fotos.

É uma vitrine + painel de cadastro — não um sistema de gestão imobiliária.

## Funcionalidades

**Vitrine (pública)**
- Catálogo de imóveis com paginação
- Filtros por tipo, status, cidade, bairro, faixa de preço, posição solar e número de suítes
- Página de detalhe do imóvel com galeria de fotos
- Página "Sobre" da corretora e botão de contato via WhatsApp
- Página 404 para rotas inexistentes

**Painel administrativo (autenticado)**
- Login com JWT em cookie HttpOnly
- Cadastro, edição e inativação (soft delete) de imóveis
- Upload de fotos (`.jpeg`, `.png`, `.webp`), exclusão e definição da foto principal
- Cadastro de fotos integrado ao fluxo de publicação do imóvel

## Stack

| Camada    | Tecnologia                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------ |
| Back-end  | Java 21, Spring Boot 4 (Web MVC, Data JPA, Security, Validation), JWT, Lombok, SpringDoc OpenAPI |
| Front-end | React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Axios                                  |
| Banco     | MySQL 8.4                                                                                        |
| Infra     | Docker / Docker Compose, Nginx, DigitalOcean, Cloudflare, Certbot                                |
| Testes    | JUnit 5, Mockito, MockMvc                                                                        |

## Decisões técnicas do back-end

- **JWT em cookie HttpOnly + SameSite=Lax** — em vez de guardar o token no `localStorage`, ele fica num cookie que o JavaScript não consegue ler, o que neutraliza o roubo de token via XSS. O `SameSite=Lax` impede que o cookie seja enviado em requisições cross-site que alteram estado, e o `Secure` é ativado em produção. O front guarda apenas uma flag não sensível para controle de UI.
- **CSRF desabilitado** — a API é stateless (`SessionCreationPolicy.STATELESS`), não há sessão de servidor para sequestrar. A proteção contra requisições forjadas vem do `SameSite` do cookie somado a um CORS restrito à origem do front (`allowCredentials` com lista explícita de origens).
- **Endpoints públicos x protegidos** — tudo que a vitrine consome (`GET /api/agenciamentos/**` e o login) é aberto; qualquer outra rota exige autenticação. Regra simples, fácil de auditar.
- **Filtros com JPA Specification** — os filtros opcionais da listagem são compostos dinamicamente, evitando uma query para cada combinação de parâmetros.
- **Soft delete** — imóveis são inativados, não apagados, preservando histórico e fotos.
- **Tratamento global de erros** — um `@RestControllerAdvice` converte exceções de domínio em respostas padronizadas (`ErrorResponseDTO` / `FieldErrorDTO`).
- **Perfis por ambiente** — `local`, `dev`, `docker`, `test` e `prd`. Em produção o Hibernate roda com `ddl-auto: validate`, ou seja, não altera o schema sozinho.
- **Spec-first + Conventional Commits + Git Flow** — cada feature começa por uma especificação escrita (ver `backend_raquel/features/`), os commits seguem o padrão `feat:` / `chore:` / `refact:` e o trabalho flui por `feature/*` → `DEV` → `main`.

## Arquitetura

```
Navegador ──► Nginx (HTTPS) ──┬──► Front-end estático (React build)
                              └──► /api ──► Spring Boot ──► MySQL
                                                 │
                                                 └──► ./uploads/fotos (arquivos de imagem)
```

O front chama sempre `/api` na mesma origem: em produção o Nginx faz o proxy; em desenvolvimento o Vite faz o mesmo papel.

**Estrutura de pacotes (back-end)** — organizada por domínio:

```
com.api
├── agenciamento        # imóveis
│   ├── controller (+ dto)
│   ├── database (model, repository)
│   ├── enums           # StatusAgenciamentos, TipoImovel
│   ├── mapper
│   ├── service
│   └── specification   # filtros dinâmicos
├── foto                # upload e servir imagens
│   ├── controller, database, dto, mapper, service
├── usuario             # autenticação
│   ├── config          # SecurityConfig (CORS, rotas, filtro JWT)
│   ├── controller, database, dto, enums, service
└── exceptions          # exceções de domínio + GlobalExceptionHandler
```

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| POST   | `/api/auth/login` | — | Autentica e grava o JWT em cookie HttpOnly |
| POST   | `/api/auth/logout` | ✅ | Expira o cookie de autenticação |
| GET    | `/api/agenciamentos` | — | Lista imóveis com filtros e paginação |
| GET    | `/api/agenciamentos/{id}` | — | Detalhe de um imóvel |
| POST   | `/api/agenciamentos` | ✅ | Cadastra imóvel |
| PUT    | `/api/agenciamentos/{id}` | ✅ | Atualiza imóvel |
| DELETE | `/api/agenciamentos/{id}` | ✅ | Inativa imóvel (soft delete) |
| GET    | `/api/agenciamentos/{id}/fotos` | — | Lista fotos de um imóvel |
| GET    | `/api/agenciamentos/fotos/{nomeArmazenado}` | — | Serve o arquivo da imagem |
| POST   | `/api/agenciamentos/{id}/fotos` | ✅ | Upload de foto (`multipart`, campo `foto`) |
| PATCH  | `/api/agenciamentos/{agenciamentoId}/fotos/{id}/principal` | ✅ | Define a foto principal |
| DELETE | `/api/agenciamentos/fotos/{id}` | ✅ | Remove uma foto |

**Filtros de `GET /api/agenciamentos`** (todos opcionais): `status`, `tipoImovel`, `cidade`, `bairro`, `precoMin`, `precoMax`, `posicaoSolar`, `suite`, `incluirInativos`, além de `page`, `size` e `sort`.

- `status`: `DISPONIVEL`, `RESERVADO`, `VENDIDO`, `INATIVO`
- `tipoImovel`: `CASA`, `APARTAMENTO`, `SOBRADO`, `LOFT`, `TERRENO`, `COBERTURA`, `CASA_GERMINADA`

A documentação interativa (Swagger UI) fica disponível em `/swagger-ui.html` com a aplicação rodando.

## Como rodar localmente

**Pré-requisitos:** Docker, Java 21, Node.js 20+ e pnpm.

```bash
# 1. Variáveis de ambiente (preencha os valores)
cp .env.example .env

# 2. Banco de dados MySQL
docker compose up -d mysql

# 3. Back-end (porta 8080)
cd backend_raquel/raquelimoveis
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# 4. Front-end (porta 5173, com proxy de /api para o back-end)
cd frontend_raquel
pnpm install
pnpm dev
```

Acesse `http://localhost:5173` para a vitrine e `http://localhost:5173/admin/login` para o painel.

> O perfil `dev` conecta no MySQL do Docker em `localhost:3307` e lê usuário/senha das variáveis do `.env` (`MYSQL_USER`, `MYSQL_PASSWORD`). Por isso, use `MYSQL_HOST_PORT=3307` e `MYSQL_CONTAINER_PORT=3306` no `.env`.

## Deploy

- **DigitalOcean** — Droplet Linux hospedando back-end, banco e arquivos estáticos
- **Nginx** — serve o build do React e faz proxy reverso de `/api` para o Spring Boot
- **systemd** — mantém a API rodando como serviço, com restart automático
- **Certbot** — certificado TLS (Let's Encrypt) com renovação automática
- **Cloudflare** — DNS e proxy na frente do servidor

O back-end sobe com o perfil `prd`: cookie `Secure`, CORS restrito ao domínio oficial, `ddl-auto: validate` e detalhes do health check ocultos.

## Testes

Cobertura atual do back-end:

- **Unitários** (JUnit 5 + Mockito) — `AgenciamentoService` (cadastro, atualização, filtros, inativação e exceções), `FotoService` (formatos aceitos, arquivo vazio, foto principal), `AgenciamentoMapper`, `AuthService` e `JwtAuthenticationFilter`
- **Integração** (`@SpringBootTest` + MockMvc) — `SecurityConfig`, validando quais rotas são públicas e quais exigem autenticação, além do carregamento do contexto

```bash
cd backend_raquel/raquelimoveis
./mvnw test
```

Os testes usam o perfil `test`, com banco e diretório de upload próprios.

## Roadmap

- [ ] **Flyway** para versionar o schema do banco (hoje gerenciado pelo Hibernate)
- [ ] **Redis** para cache da listagem de imóveis
- [ ] Refatoração de UI/UX do front-end
- [ ] Testes no front-end

## Autor

**Miguel**

- GitHub: [@Miguelggit](https://github.com/Miguelggit)
- LinkedIn: [@Luis Miguel](https://www.linkedin.com/in/luis-miguel-marinho-dos-santos-80813944b/)

