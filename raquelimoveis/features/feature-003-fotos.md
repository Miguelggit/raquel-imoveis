# Feature 003 — Fotos de Agenciamento

## Visão Geral

| Campo         | Valor                                              |
|---------------|----------------------------------------------------|
| Feature       | Upload e gestão de fotos dos agenciamentos         |
| Módulo        | `foto`                                             |
| Prioridade    | Alta (vitrine sem foto não funciona)               |
| Dependências  | Feature 001 (CRUD de Agenciamento)                 |
| Sprint        | 2 semanas                                          |
| Entrega       | Endpoints de upload, listagem, remoção e exibição  |
| Validação     | Postman                                            |

## Objetivo

Permitir que a corretora cadastre, visualize e remova fotos dos agenciamentos. As fotos são armazenadas no disco local do servidor e acessíveis via URL pública para exibição na vitrine.

## Fora do Escopo (não implementar agora)

- Armazenamento em cloud (S3, Azure Blob)
- Redimensionamento automático de imagens
- Marca d'água
- Limite de fotos por agenciamento
- Ordenação/reordenação das fotos
- Foto de capa (principal)

---

## Entidade: FotoAgenciamento

### Campos

| Campo              | Tipo           | Obrigatório | Observações                                     |
|--------------------|----------------|-------------|------------------------------------------------|
| `id`               | Long           | Auto        | PK, `@GeneratedValue(IDENTITY)`                |
| `nomeArquivo`      | String         | Sim         | Nome original do arquivo enviado               |
| `nomeArmazenado`   | String         | Sim         | Nome único gerado pelo sistema (UUID + extensão)|
| `contentType`      | String         | Sim         | Tipo MIME (image/jpeg, image/png, etc)          |
| `tamanho`          | Long           | Sim         | Tamanho do arquivo em bytes                     |
| `url`              | String         | Sim         | URL pública para acessar a imagem               |
| `agenciamento`     | AgenciamentoModel | Sim      | FK — relacionamento `@ManyToOne`                |
| `criadoEm`         | LocalDateTime  | Auto        | Preenchido automaticamente via `@PrePersist`    |

### Relacionamento

```
AgenciamentoModel (1) ←→ (N) FotoAgenciamento

AgenciamentoModel:
  @OneToMany(mappedBy = "agenciamento")
  private List<FotoAgenciamento> fotos;

FotoAgenciamento:
  @ManyToOne
  @JoinColumn(name = "agenciamento_id", nullable = false)
  private AgenciamentoModel agenciamento;
```

Um agenciamento pode ter várias fotos. Uma foto pertence a um único agenciamento.

---

## Armazenamento de Arquivos

### Estrutura no disco

```
uploads/
└── fotos/
    ├── 550e8400-e29b-41d4-a716-446655440000.jpg
    ├── 6ba7b810-9dad-11d1-80b4-00c04fd430c8.png
    └── ...
```

### Regras

- O arquivo é salvo com nome UUID + extensão original (ex: `550e8400.jpg`)
- O nome original é mantido no campo `nomeArquivo` da entidade
- O nome gerado é mantido no campo `nomeArmazenado`
- A URL é construída como: `/api/agenciamentos/fotos/{nomeArmazenado}`
- Caminho da pasta configurável via `application.yaml`

### Formatos aceitos

- `image/jpeg`
- `image/png`
- `image/webp`

### Validações

- Arquivo vazio → rejeitar com 400
- Formato não aceito → rejeitar com 400
- Agenciamento não encontrado → rejeitar com 404

---

## Endpoints

### POST /api/agenciamentos/{id}/fotos — Upload de foto

**Request:** `multipart/form-data`

| Campo    | Tipo           | Obrigatório | Descrição            |
|----------|----------------|-------------|----------------------|
| `foto`   | MultipartFile  | Sim         | Arquivo da imagem    |

**Response — 201 Created:**

```json
{
  "id": 1,
  "nomeArquivo": "sala-estar.jpg",
  "nomeArmazenado": "550e8400-e29b-41d4-a716-446655440000.jpg",
  "contentType": "image/jpeg",
  "tamanho": 245760,
  "url": "/api/agenciamentos/fotos/550e8400-e29b-41d4-a716-446655440000.jpg",
  "agenciamentoId": 1,
  "criadoEm": "2025-06-01T14:30:00"
}
```

**Critérios de aceitação:**

- [ ] Upload com imagem válida retorna 201 com dados da foto
- [ ] Arquivo é salvo no disco com nome UUID
- [ ] Registro é salvo no banco com metadados
- [ ] Agenciamento inexistente retorna 404
- [ ] Arquivo vazio retorna 400
- [ ] Formato não aceito (ex: .pdf, .txt) retorna 400
- [ ] Mesmo agenciamento pode ter múltiplas fotos

---

### GET /api/agenciamentos/{id}/fotos — Listar fotos de um agenciamento

**Response — 200 OK:**

```json
[
  {
    "id": 1,
    "nomeArquivo": "sala-estar.jpg",
    "nomeArmazenado": "550e8400-e29b-41d4-a716-446655440000.jpg",
    "contentType": "image/jpeg",
    "tamanho": 245760,
    "url": "/api/agenciamentos/fotos/550e8400-e29b-41d4-a716-446655440000.jpg",
    "criadoEm": "2025-06-01T14:30:00"
  },
  {
    "id": 2,
    "nomeArquivo": "quarto-principal.jpg",
    "nomeArmazenado": "6ba7b810-9dad-11d1-80b4-00c04fd430c8.jpg",
    "contentType": "image/jpeg",
    "tamanho": 189440,
    "url": "/api/agenciamentos/fotos/6ba7b810-9dad-11d1-80b4-00c04fd430c8.jpg",
    "criadoEm": "2025-06-01T14:32:00"
  }
]
```

**Critérios de aceitação:**

- [ ] Retorna lista de fotos do agenciamento
- [ ] Agenciamento sem fotos retorna 200 com array vazio `[]`
- [ ] Agenciamento inexistente retorna 404
- [ ] Response não inclui dados do agenciamento (só das fotos)

---

### GET /api/agenciamentos/fotos/{nomeArmazenado} — Servir imagem

**Response — 200 OK:**

Retorna o arquivo binário da imagem com o `Content-Type` correto (image/jpeg, image/png, etc). Não é JSON — é a imagem em si. Essa URL é a que o frontend usa no `<img src="...">`.

**Critérios de aceitação:**

- [ ] Retorna a imagem com Content-Type correto
- [ ] Arquivo inexistente retorna 404
- [ ] A URL funciona diretamente no navegador (abrir a URL mostra a imagem)

---

### DELETE /api/agenciamentos/fotos/{id} — Remover foto

**Response — 204 No Content**

**Critérios de aceitação:**

- [ ] Remove o registro do banco
- [ ] Remove o arquivo do disco
- [ ] ID inexistente retorna 404
- [ ] Após remoção, foto não aparece mais na listagem
- [ ] Após remoção, URL da imagem retorna 404

---

## Configuração

### application-dev.yaml

```yaml
app:
  upload:
    dir: ./uploads/fotos
```

O caminho é relativo à raiz do projeto. A Service lê essa configuração com `@Value("${app.upload.dir}")`.

---

## Arquitetura

```
Controller (recebe MultipartFile / serve imagem)
    ↓
Service (valida, gera UUID, salva arquivo, persiste metadados)
    ↓
Repository (persiste FotoAgenciamento no MySQL)
    ↓
Disco local (armazena o arquivo físico)
```

### Arquivos novos

```
foto/
├── controller/
│   └── FotoController.java
├── dto/
│   └── FotoResponseDTO.java
├── model/
│   └── FotoAgenciamento.java
├── repository/
│   └── FotoRepository.java
└── service/
    └── FotoService.java

agenciamento/
├── model/
│   └── AgenciamentoModel.java          ← modifica (adiciona @OneToMany)
└── exceptions/
    ├── ArquivoVazioException.java      ← NOVO
    └── FormatoInvalidoException.java   ← NOVO
```

---

## Testes via Postman

### Upload de foto

- Método: POST
- URL: `http://localhost:8080/api/agenciamentos/1/fotos`
- Body: form-data
  - Key: `foto` (tipo File)
  - Value: selecionar imagem do computador

### Listar fotos

```
GET http://localhost:8080/api/agenciamentos/1/fotos
```

### Ver imagem no navegador

```
GET http://localhost:8080/api/agenciamentos/fotos/550e8400-e29b-41d4-a716-446655440000.jpg
```

### Remover foto

```
DELETE http://localhost:8080/api/agenciamentos/fotos/1
```

---

## Definition of Done

- [ ] Entidade FotoAgenciamento criada com relacionamento @ManyToOne
- [ ] Upload de foto funcionando via Postman
- [ ] Listagem de fotos por agenciamento funcionando
- [ ] Imagem acessível via URL pública
- [ ] Remoção de foto (banco + disco) funcionando
- [ ] Validações de formato e arquivo vazio
- [ ] Testes unitários cobrindo Service
- [ ] Testado via Postman com todos os cenários
- [ ] Código commitado na branch `feature/add-photo-upload`
- [ ] PR mergeado na dev
