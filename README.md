# MedClinic API

API REST desenvolvida em Node.js e TypeScript para a primeira etapa de um sistema de gerenciamento de clínica médica.

Nesta etapa, o projeto concentra-se em autenticação, autorização, cadastro de usuários, validações, persistência de dados, tratamento de erros e organização da aplicação em camadas.

## Status do projeto

### Implementado

* API REST com Express
* TypeScript
* PostgreSQL
* TypeORM
* Entidade de usuário
* DTO para dados de usuário
* Cadastro de usuários
* Validação dos dados
* Verificação de e-mail duplicado
* Hash de senha com bcryptjs
* Login
* Autenticação com JWT
* Bearer Token
* Middleware de autenticação
* Controle de acesso baseado em funções (RBAC)
* Perfis `admin` e `atendente`
* Middleware centralizado de tratamento de erros
* Migration do banco de dados
* Script SQL para criação da tabela de usuários
* Docker / Podman
* Git / GitHub

### Próximas funcionalidades

As funcionalidades abaixo não fazem parte desta etapa:

* Especialidades médicas
* Cadastro e gerenciamento de médicos
* Cadastro e gerenciamento de pacientes
* Consultas e agendamentos
* Relatórios
* Swagger / OpenAPI
* Testes automatizados
* CI/CD
* Melhorias de logs e observabilidade
* Evolução das regras de autorização

> As funcionalidades de domínio da clínica serão implementadas em uma etapa futura, utilizando a estrutura criada neste projeto.

---

# Tecnologias

| Tecnologia      | Utilização                         |
| --------------- | ---------------------------------- |
| Node.js         | Runtime da aplicação               |
| TypeScript      | Desenvolvimento da API             |
| Express         | Framework HTTP                     |
| PostgreSQL      | Banco de dados relacional          |
| TypeORM         | ORM e acesso ao banco              |
| JWT             | Autenticação                       |
| bcryptjs        | Hash de senhas                     |
| dotenv          | Variáveis de ambiente              |
| CORS            | Controle de origem das requisições |
| Docker / Podman | Containerização                    |
| Git / GitHub    | Versionamento                      |

---

# Arquitetura

A aplicação utiliza uma arquitetura MVC organizada em camadas, separando as responsabilidades de cada parte do sistema.

```text
                    MedClinic API

                         Cliente
                            |
                            v
                         Routes
                            |
                            v
                       Middlewares
                            |
                            v
                       Controllers
                            |
                            v
                         Services
                            |
                            v
                       Repositories
                            |
                            v
                          TypeORM
                            |
                            v
                       PostgreSQL
```

### Responsabilidades

**Routes**

Define os endpoints da API e associa controllers e middlewares.

**Middlewares**

Intercepta as requisições para autenticação JWT, autorização RBAC e tratamento centralizado de erros.

**Controllers**

Recebe as requisições HTTP, trata os dados de entrada e retorna as respostas.

**Services**

Concentra as regras de negócio, validações e processamento das operações.

**Repositories**

Centraliza o acesso ao PostgreSQL utilizando TypeORM.

**Entities**

Representa os dados persistidos utilizando classes e decorators do TypeORM.

**Database**

Centraliza a configuração do `DataSource`, migrations e scripts SQL.

**Utils**

Contém funções reutilizáveis, como hash de senha, JWT e tratamento de erros.

---

# Fluxo de uma requisição

```text
Cliente
   |
   v
Route
   |
   v
Middleware
   |
   v
Controller
   |
   v
Service
   |
   v
Repository
   |
   v
PostgreSQL
   |
   v
Resposta HTTP
```

A requisição passa pelas camadas responsáveis até chegar ao banco de dados. O resultado retorna pelas camadas até chegar ao cliente.

---

# Entidade e relacionamento

Nesta primeira etapa, a única entidade obrigatória é `User`.

O perfil de acesso é representado por `UserRole`, utilizado como enum para definir os papéis disponíveis.

```text
┌──────────────────────────┐
│          User            │
├──────────────────────────┤
│ id                       │
│ name                     │
│ email                    │
│ password                 │
│ role                     │
│ createdAt                │
└────────────┬─────────────┘
             │
             │ role
             v
┌──────────────────────────┐
│        UserRole          │
├──────────────────────────┤
│ admin                    │
│ atendente                │
└──────────────────────────┘
```

Neste estágio, `UserRole` não representa uma tabela separada no banco. Ele define os valores permitidos para o campo `role` da entidade `User`.

A estrutura foi preparada para receber futuramente as entidades de domínio da clínica, como médicos, pacientes, especialidades e consultas.

### Estrutura da tabela

```text
users
├── id
├── name
├── email
├── password
├── role
└── created_at
```

O e-mail é único e a senha é armazenada somente em formato de hash.

---

# Estrutura do projeto

```text
medclinic/

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
│   │   ├── data-source.ts
│   │   ├── migrations/
│   │   │   └── 1700000000000-CreateUsersTable.ts
│   │   └── sql/
│   │       └── create_users_table.sql
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
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── .prettierrc
└── tsconfig.json
```

---

# Banco de dados

A aplicação utiliza PostgreSQL através do TypeORM.

A estrutura do banco pode ser criada utilizando:

* migration do TypeORM; ou
* script SQL localizado em `src/database/sql/create_users_table.sql`.

Não é necessário executar os dois métodos no mesmo banco.

---

# Como executar a aplicação

Existem **duas formas de executar o projeto**:

1. utilizando Docker ou Podman;
2. utilizando PostgreSQL instalado localmente.

---

## 1. Executar com Docker ou Podman

### Pré-requisitos

* Docker ou Podman
* Git

O arquivo `docker-compose.yml` configura os containers necessários para a aplicação.

### Podman

Subir a aplicação:

```bash
podman compose up
```

Subir reconstruindo a imagem:

```bash
podman compose up --build
```

Encerrar:

```bash
podman compose down
```

### Docker

Subir a aplicação:

```bash
docker compose up
```

Subir reconstruindo a imagem:

```bash
docker compose up --build
```

Encerrar:

```bash
docker compose down
```

Com os containers em execução:

```text
Cliente
   |
   v
medclinic-api
   |
   v
medclinic-postgres
```

A API fica disponível em:

```text
http://localhost:3000
```

O PostgreSQL utiliza a porta:

```text
5432
```

---

## 2. Executar localmente

Nesta opção, somente a aplicação é executada pelo Node.js. O PostgreSQL precisa estar instalado e em execução na máquina.

### Pré-requisitos

* Node.js 18 ou superior
* npm
* PostgreSQL
* Git

### Instalar as dependências

```bash
npm install
```

### Configurar o ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure o `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=medclinic

JWT_SECRET=troque-esta-chave
JWT_EXPIRES_IN=1h
```

### Criar a estrutura do banco

Utilizando TypeORM:

```bash
npm run typeorm migration:run
```

Ou utilizando o script:

```text
src/database/sql/create_users_table.sql
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Compilar

```bash
npm run build
```

### Executar a aplicação compilada

```bash
npm start
```

---

# Variáveis de ambiente

| Variável         | Descrição                          | Exemplo             |
| ---------------- | ---------------------------------- | ------------------- |
| `PORT`           | Porta da API                       | `3000`              |
| `DB_HOST`        | Host do PostgreSQL                 | `localhost`         |
| `DB_PORT`        | Porta do PostgreSQL                | `5432`              |
| `DB_USERNAME`    | Usuário do PostgreSQL              | `postgres`          |
| `DB_PASSWORD`    | Senha do PostgreSQL                | `postgres`          |
| `DB_DATABASE`    | Banco utilizado pela aplicação     | `medclinic`         |
| `JWT_SECRET`     | Chave utilizada para assinar o JWT | `troque-esta-chave` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token        | `1h`                |

O arquivo `.env` não deve ser versionado.

---

# Endpoints da API

A API pode ser utilizada através de Postman, Insomnia, Thunder Client, REST Client do VS Code ou `curl`.

## Health Check

### `GET /health`

Verifica se a API está disponível.

Resposta:

```json
{
  "status": "ok"
}
```

---

## Cadastro de usuário

### `POST /auth/register`

Cria um novo usuário.

### Requisição

```json
{
  "name": "Dayana do Valle",
  "email": "dayana@email.com",
  "password": "123456"
}
```

O perfil padrão é `atendente`.

### Validações

O cadastro verifica:

* campos obrigatórios;
* formato do e-mail;
* e-mail não cadastrado anteriormente;
* dados recebidos em formato válido.

A senha nunca é armazenada em texto puro.

### Resposta

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

---

## Login

### `POST /auth/login`

Autentica o usuário e gera um token JWT.

### Requisição

```json
{
  "email": "dayana@email.com",
  "password": "123456"
}
```

### Resposta

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

## Usuário autenticado

### `GET /users/me`

Retorna os dados do usuário identificado pelo JWT.

### Header

```http
Authorization: Bearer SEU_TOKEN
```

O token deve ser obtido através do endpoint de login.

Sem token, token inválido ou token expirado:

```http
401 Unauthorized
```

---

## Endpoint administrativo

### `GET /admin/ping`

Endpoint protegido por autenticação e RBAC.

Somente o perfil `admin` pode acessar.

### Header

```http
Authorization: Bearer SEU_TOKEN
```

### Resposta

```json
{
  "message": "Acesso administrativo autorizado.",
  "userId": "uuid"
}
```

Um usuário autenticado com perfil `atendente` recebe:

```http
403 Forbidden
```

---

# Autenticação

O fluxo de autenticação funciona da seguinte forma:

```text
POST /auth/login
       |
       v
AuthController
       |
       v
AuthService
       |
       +---- busca usuário
       |
       +---- compara senha com bcryptjs
       |
       +---- gera JWT
                    |
                    v
                 Cliente
```

O token é enviado posteriormente nas rotas protegidas:

```http
Authorization: Bearer <token>
```

O `authMiddleware` valida o token antes de permitir que a requisição continue.

---

# Autorização com RBAC

O controle de acesso utiliza os perfis definidos no usuário.

```text
Requisição
     |
     v
authMiddleware
     |
     v
JWT válido?
   /     \
 não      sim
 |          |
 v          v
401     rbacMiddleware
             |
             v
       Perfil permitido?
          /       \
        não        sim
         |           |
         v           v
        403      Controller
```

### Perfis

| Perfil      | Acesso                                      |
| ----------- | ------------------------------------------- |
| `admin`     | Acesso administrativo                       |
| `atendente` | Acesso autenticado com permissões restritas |

---

# Tratamento de erros

A aplicação possui um middleware centralizado para tratamento de erros.

| Código | Significado                              |
| ------ | ---------------------------------------- |
| `400`  | Requisição inválida                      |
| `401`  | Não autenticado ou credenciais inválidas |
| `403`  | Usuário sem permissão                    |
| `404`  | Recurso não encontrado                   |
| `409`  | Conflito, como e-mail duplicado          |
| `500`  | Erro interno                             |

Exemplo:

```json
{
  "message": "Email ou senha inválidos."
}
```

---

# Segurança

A senha do usuário não é armazenada em texto puro.

```text
Senha informada
      |
      v
   bcryptjs
      |
      v
    Hash
      |
      v
 PostgreSQL
```

No login:

```text
Senha informada
      |
      v
Comparação com hash
      |
      v
JWT
      |
      v
Cliente
```

O JWT possui tempo de expiração configurado através do `.env`.

---

# Testes manuais realizados

Os principais fluxos desta etapa foram verificados utilizando cliente HTTP:

```text
GET  /health

POST /auth/register

POST /auth/login

GET  /users/me

GET  /admin/ping
```

Também são verificadas situações como:

* cadastro com dados inválidos;
* e-mail duplicado;
* login com credenciais inválidas;
* ausência de token;
* token inválido;
* token expirado;
* acesso administrativo autorizado;
* acesso administrativo negado.

---

# Escopo desta etapa

Esta entrega implementa exclusivamente a base de:

```text
Usuários
   +
Autenticação
   +
Autorização
   +
RBAC
```

As funcionalidades de domínio da clínica não fazem parte desta etapa. O enunciado determina que especialidades, médicos, pacientes, consultas e relatórios sejam desenvolvidos posteriormente.

---

# Próximas etapas

A estrutura criada nesta etapa servirá como base para a evolução da API:

```text
Autenticação e Autorização
          |
          v
     Especialidades
          |
          v
        Médicos
          |
          v
       Pacientes
          |
          v
Consultas e Agendamentos
          |
          v
       Relatórios
```

Também poderão ser adicionados futuramente:

* Swagger / OpenAPI;
* testes automatizados;
* CI/CD;
* melhorias de logs e observabilidade;
* novas regras de autorização.

---

# Projeto acadêmico

Projeto desenvolvido como atividade prática do Módulo 02 — Back End Node da SCTEC.

O projeto aplica conceitos de:

* Node.js;
* TypeScript;
* Express;
* TypeORM;
* PostgreSQL;
* APIs REST;
* arquitetura MVC em camadas;
* DTOs;
* autenticação JWT;
* autorização RBAC;
* hash de senhas;
* migrations;
* programação assíncrona;
* Git e GitHub.

---

# Autoria

**Dayana do Valle**

Repositório:

`https://github.com/DayanadoValle/medClinicApi`

---

## Licença

Projeto desenvolvido para fins acadêmicos e de portfólio.
