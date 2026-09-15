# MedClinic API

API REST desenvolvida em Node.js e TypeScript para gerenciamento da autenticação e autorização de usuários de uma clínica médica.

Este projeto corresponde à primeira etapa do desenvolvimento da MedClinic. Nesta etapa, o foco está na criação da estrutura do back-end, cadastro de usuários, autenticação com JWT e autorização baseada em perfis de acesso.

As funcionalidades de especialidades, médicos, pacientes, consultas e relatórios fazem parte das próximas etapas e não estão implementadas neste projeto.

---

## Status do projeto

**Concluído — Etapa de autenticação e autorização.**

A aplicação possui:

* Cadastro de usuários
* Autenticação utilizando JWT
* Proteção de rotas
* Autorização baseada em perfil (RBAC)
* Dois perfis de acesso: `admin` e `atendente`
* Persistência dos usuários em PostgreSQL
* Hash de senhas com bcrypt
* TypeORM para acesso ao banco
* Tratamento centralizado de erros
* Execução em containers com Podman/Docker
* Documentação dos endpoints

---

## Tecnologias

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* TypeORM
* JWT
* bcrypt
* Podman / Docker
* Thunder Client para testes manuais

---

## Arquitetura

O projeto utiliza uma arquitetura organizada em camadas, separando responsabilidades entre rotas, middlewares, controllers, services, repositories, entities, banco de dados e utilitários.

```text
Cliente HTTP
     │
     ▼
   Routes
     │
     ▼
 Middlewares
     │
     ▼
 Controllers
     │
     ▼
  Services
     │
     ▼
Repositories
     │
     ▼
 TypeORM
     │
     ▼
PostgreSQL
```

Cada camada possui uma responsabilidade específica.

### Routes

Define os endpoints disponíveis e associa as rotas aos controllers e middlewares necessários.

### Middlewares

Responsáveis por funcionalidades que acontecem antes da execução do controller, como:

* Autenticação por JWT
* Autorização por perfil
* Tratamento centralizado de erros

### Controllers

Recebem as requisições HTTP, extraem os dados necessários e chamam os services.

Também são responsáveis por retornar as respostas HTTP ao cliente.

### Services

São responsáveis pelas regras de negócio da aplicação, como validação dos dados, autenticação de usuários e criação de usuários, utilizando os repositories para acessar o banco de dados.

### Repositories

Responsáveis exclusivamente pelo acesso aos dados utilizando TypeORM.

### Entities

Representam as estruturas persistidas no banco de dados.

Nesta etapa existe apenas a entidade `User`.

### Database

Contém a configuração da conexão com PostgreSQL, DataSource e arquivos relacionados à criação da estrutura do banco.

### Utils

Contém funções reutilizáveis, como:

* Geração e validação de JWT
* Hash de senha
* Tratamento de erros

---

## Fluxo de uma requisição

Uma requisição para a API segue o fluxo:

```text
Cliente
   │
   ▼
Route
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
TypeORM
   │
   ▼
PostgreSQL
```

Depois que o banco retorna os dados, o fluxo acontece no sentido inverso até que o Controller envie a resposta HTTP ao cliente.

---

## Entidade User
Nesta etapa do projeto existe apenas a entidade `User`.

```text
┌──────────────────────────────┐
│            User              │
├──────────────────────────────┤
│ id                           │
│ name                         │
│ email                        │
│ password                     │
│ role                         │
│ createdAt                    │
└──────────────────────────────┘
```

O campo `role` representa o perfil de acesso do usuário.

Os valores utilizados atualmente são:

```text
admin
atendente
```

O `UserRole` é um enum utilizado para representar esses perfis. Ele não é uma tabela separada no banco de dados.

As entidades relacionadas a médicos, pacientes, especialidades e consultas serão adicionadas em etapas futuras.

---

## Estrutura do projeto

```text
medclinic/
│
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── controllers/
│   │   ├── AdminController.ts
│   │   ├── AuthController.ts
│   │   └── UserController.ts
│   │
│   ├── database/
│       ├── data-source.ts
│       ├── migrations/
│       │   └── 1700000000000-CreateUsersTable.ts
│       └── sql/
│           └── create_users_table.sql
│   │
│   ├── dtos/
│   │   └── user.dto.ts
│   │
│   ├── entities/
│   │   ├── User.ts
│   │   └── UserRole.ts
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   └── rbacMiddleware.ts
│   │
│   ├── repositories/
│   │   └── UserRepository.ts
│   │
│   ├── routes/
│   │   ├── adminRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── index.ts
│   │   └── userRoutes.ts
│   │
│   ├── services/
│   │   └── AuthService.ts
│   │
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── hash.ts
│   │   └── jwt.ts
│   │
│   └── server.ts
│
├── .dockerignore
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

---

## Banco de dados

O projeto utiliza PostgreSQL como banco de dados e TypeORM como ORM.

A conexão é configurada através do `DataSource`.

As informações de conexão são carregadas através das variáveis de ambiente.

### Tabela `users`

A tabela possui os principais campos:

| Campo       | Descrição                      |
| ----------- | ------------------------------ |
| `id`        | Identificador único do usuário |
| `name`      | Nome do usuário                |
| `email`     | E-mail único                   |
| `password`  | Senha armazenada como hash     |
| `role`      | Perfil de acesso               |
| `createdAt` | Data de criação                |

O e-mail possui restrição de unicidade para impedir o cadastro de usuários duplicados.

As senhas são armazenadas utilizando bcrypt e nunca ficam salvas em texto puro.

---

## Como executar

Existem duas formas principais de executar o projeto.

### Opção 1 — Podman / Docker

É necessário ter Podman Desktop ou Docker instalado.

Na raiz do projeto:

```bash
npm install
```

Depois:

```bash
podman compose up -d
```

Para verificar os containers:

```bash
podman compose ps
```

A API ficará disponível em:

```text
http://localhost:3000
```

O PostgreSQL será executado em um container separado.

Para parar os containers:

```bash
podman compose down
```

Caso esteja utilizando Docker, os comandos equivalentes podem ser executados com `docker compose`.

### Opção 2 — Execução local

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`.

Depois compile o projeto:

```bash
npm run build
```

Para executar em desenvolvimento:

```bash
npm run dev
```

Para executar a versão compilada:

```bash
npm start
```

---

## Variáveis de ambiente

O projeto utiliza variáveis de ambiente para configurações sensíveis e informações de conexão.

Exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=medclinic

JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=1h
```

O arquivo `.env` não deve ser versionado.

As credenciais do banco de dados e o segredo utilizado pelo JWT devem permanecer fora do código-fonte.

---

## Endpoints da API

A API pode ser utilizada através de Postman, Insomnia, Thunder Client, REST Client do VS Code ou `curl`.

### Health Check

#### `GET /health`

Verifica se a API está disponível.

**Resposta:**

```json
{
  "status": "ok"
}
```

---

### Cadastro de usuário

#### `POST /auth/register`

Cria um novo usuário.

**Requisição:**

```json
{
  "name": "Dayana do Valle",
  "email": "dayana@email.com",
  "password": "123456"
}
```

O perfil padrão é `atendente`.

#### Validações

O cadastro verifica:

* Campos obrigatórios
* Formato do e-mail
* E-mail não cadastrado anteriormente
* Senha com no mínimo 6 caracteres
* Dados recebidos em formato válido

A senha nunca é armazenada em texto puro. Ela é protegida utilizando hash bcrypt.

#### Resposta

```json
{
  "id": "uuid",
  "name": "Dayana do Valle",
  "email": "dayana@email.com",
  "role": "atendente",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

E-mail já cadastrado:

```http
409 Conflict
```

Senha com menos de 6 caracteres:

```http
400 Bad Request
```

---

### Login

#### `POST /auth/login`

Autentica o usuário e gera um token JWT.

**Requisição:**

```json
{
  "email": "dayana@email.com",
  "password": "123456"
}
```

**Resposta:**

```json
{
  "token": "seu-jwt-aqui",
  "user": {
    "id": "uuid",
    "name": "Dayana do Valle",
    "email": "dayana@email.com",
    "role": "atendente",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

Credenciais inválidas:

```http
401 Unauthorized
```

A API não informa qual dos dados está incorreto.

---

### Usuário autenticado

#### `GET /users/me`

Retorna os dados do usuário identificado pelo JWT.

**Header:**

```http
Authorization: Bearer SEU_TOKEN
```

O token deve ser obtido através do endpoint de login.

Sem token, token inválido ou token expirado:

```http
401 Unauthorized
```

---

### Endpoint administrativo

#### `GET /admin/ping`

Endpoint protegido por autenticação e RBAC.

Somente o perfil `admin` pode acessar.

**Header:**

```http
Authorization: Bearer SEU_TOKEN
```

**Resposta:**

```json
{
  "message": "Acesso autorizado: voce esta logado como Administrador.",
  "userId": "uuid"
}
```

Um usuário autenticado com perfil `atendente` recebe:

```http
403 Forbidden
```

---

## Autenticação

A autenticação utiliza JSON Web Token (JWT).

O fluxo funciona da seguinte forma:

```text
1. Usuário realiza cadastro
          │
          ▼
2. Senha é transformada em hash bcrypt
          │
          ▼
3. Usuário é salvo no PostgreSQL
          │
          ▼
4. Usuário realiza login
          │
          ▼
5. API valida e-mail e senha
          │
          ▼
6. API gera JWT
          │
          ▼
7. Cliente envia JWT nas próximas requisições
```

O token contém informações necessárias para identificar o usuário e seu perfil de acesso.

### Exemplo simplificado do payload

```json
{
  "id": "uuid",
  "role": "atendente",
  "iat": 1700000000,
  "exp": 1700003600
}
```

O campo `exp` representa a expiração do token.

---

## Autorização com RBAC

A aplicação utiliza RBAC (Role-Based Access Control) para controlar o acesso aos recursos de acordo com o perfil do usuário.

Os perfis implementados são:

| Perfil      | Acesso                                      |
| ----------- | ------------------------------------------- |
| `admin`     | Acesso administrativo                       |
| `atendente` | Acesso aos recursos permitidos ao atendente |

### Fluxo de autorização

```text
Requisição
     │
     ▼
Verificação do JWT
     │
     ├── Token inválido ──► 401
     │
     ▼
Identificação do usuário
     │
     ▼
Verificação do perfil
     │
     ├── Sem permissão ──► 403
     │
     ▼
Acesso permitido
```

Por exemplo, o endpoint:

```http
GET /admin/ping
```

aceita somente usuários com o perfil:

```text
admin
```

Um usuário com perfil `atendente` recebe `403 Forbidden`.

---

## Tratamento de erros

A aplicação possui um middleware centralizado para tratamento de erros.

As respostas são retornadas em formato JSON.

Exemplos de situações tratadas:

| Situação                  | Status |
| ------------------------- | -----: |
| Dados inválidos           |  `400` |
| Token ausente ou inválido |  `401` |
| Acesso sem permissão      |  `403` |
| E-mail já cadastrado      |  `409` |
| Erro interno              |  `500` |

A utilização de uma camada centralizada evita a repetição de tratamento de erros em diferentes partes da aplicação.

---

## Testes realizados

Os principais fluxos da API foram testados manualmente utilizando o Thunder Client, com a aplicação e o PostgreSQL executando em containers Podman.

### Ambiente

* `npm run build` — compilação TypeScript realizada com sucesso.
* `GET /health` — API respondeu com `200 OK`.
* PostgreSQL — container iniciado e banco conectado com sucesso.

### Autenticação

| Teste                                     | Endpoint              | Resultado          |
| ----------------------------------------- | --------------------- | ------------------ |
| Cadastro de usuário                       | `POST /auth/register` | `201 Created`      |
| Cadastro com e-mail duplicado             | `POST /auth/register` | `409 Conflict`     |
| Cadastro com senha menor que 6 caracteres | `POST /auth/register` | `400 Bad Request`  |
| Login com credenciais válidas             | `POST /auth/login`    | `200 OK + JWT`     |
| Acesso com JWT válido                     | `GET /users/me`       | `200 OK`           |
| Acesso sem token                          | `GET /users/me`       | `401 Unauthorized` |
| Acesso com token inválido                 | `GET /users/me`       | `401 Unauthorized` |

### Autorização (RBAC)

| Perfil        | Endpoint          | Resultado       |
| ------------- | ----------------- | --------------- |
| Atendente     | `GET /admin/ping` | `403 Forbidden` |
| Administrador | `GET /admin/ping` | `200 OK`        |

### Segurança

Também foi verificado diretamente no PostgreSQL que as senhas cadastradas são armazenadas como hashes bcrypt, e não em texto puro.

Exemplo do formato armazenado:

```text
$2a$10$...
```

Os testes confirmaram o funcionamento dos principais fluxos de cadastro, autenticação, autorização por perfil, validação e proteção das rotas implementadas neste projeto.

---

## Escopo deste projeto

Esta versão da MedClinic está concentrada na autenticação e autorização de usuários.

### Implementado

* Cadastro de usuários
* Login
* Hash de senhas
* JWT
* Autenticação de rotas
* RBAC
* Perfis `admin` e `atendente`
* PostgreSQL
* TypeORM
* Arquitetura em camadas
* Tratamento centralizado de erros

### Não implementado nesta etapa

As seguintes funcionalidades fazem parte de futuras etapas:

* Cadastro de especialidades
* Cadastro de médicos
* Cadastro de pacientes
* Agendamento de consultas
* Gerenciamento de consultas
* Relatórios
* Demais funcionalidades relacionadas ao domínio da clínica

---

## Próximas etapas

A estrutura atual foi preparada para permitir a evolução da aplicação.

As próximas funcionalidades previstas incluem:

```text
Especialidades
      │
      ▼
Médicos
      │
      ▼
Pacientes
      │
      ▼
Consultas
      │
      ▼
Relatórios
```

Essas funcionalidades não fazem parte do escopo atual.

---

## Projeto acadêmico

Projeto desenvolvido como atividade avaliativa do curso de Qualificação Profissional em Back-End Node.

O projeto tem como objetivo aplicar conceitos de:

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* TypeORM
* Arquitetura em camadas
* Autenticação
* Autorização
* JWT
* RBAC
* Segurança de senhas
* APIs REST

---

## Autoria

**Dayana do Valle**

Projeto desenvolvido para fins acadêmicos e de aprendizado em desenvolvimento Back-End.

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos.
