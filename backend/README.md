# 🎫 IT Support Ticketing System — Backend API

A production-ready REST API built with **NestJS** and **TypeScript** for managing internal IT support tickets. The system enforces a strict role-based access model, a one-way ticket lifecycle, and comprehensive security practices out of the box.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Default Seed Credentials](#-default-seed-credentials)
- [Available Scripts](#-available-scripts)
- [Docker Deployment](#-docker-deployment)

---

## 🛠 Tech Stack

| Layer           | Technology                                      |
| --------------- | ----------------------------------------------- |
| Framework       | [NestJS](https://nestjs.com/) v11               |
| Language        | [TypeScript](https://www.typescriptlang.org/) v5 |
| ORM             | [Prisma ORM](https://www.prisma.io/) v7          |
| Database        | [MariaDB](https://mariadb.org/) (MySQL-compatible) |
| DB Driver       | `@prisma/adapter-mariadb` (driver adapter)      |
| Authentication  | JWT via `@nestjs/jwt` + `passport-jwt`          |
| Validation      | `class-validator` + `class-transformer`         |
| Password Hashing| `bcrypt` (12 salt rounds)                       |
| API Docs        | Swagger / OpenAPI via `@nestjs/swagger`         |

---

## ✨ Key Features

### 🔐 Authentication
- **Registration** — New users can self-register with email and password. Duplicate emails are rejected with a `409 Conflict`.
- **Login** — Returns a signed **JWT access token** alongside basic user info (`id`, `email`, `name`, `role`).
- **Suspended Account Guard** — The JWT strategy re-validates `isActive` on every request, ensuring suspended users cannot use previously issued tokens.

### 🛡 Role-Based Access Control (RBAC)
Two distinct roles are enforced at the guard level using a custom `@Roles()` decorator and `RolesGuard`:

| Role    | Permissions                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------- |
| `USER`  | Register · Login · Create tickets · View own tickets · Edit/delete own **OPEN** tickets · Change own password |
| `ADMIN` | Login · View **all** tickets · Update ticket status · Full CRUD on user accounts · Cannot create tickets |

### 🔄 Ticket Lifecycle Management
Tickets follow a **strict, one-way status flow**:

```
OPEN  ──►  IN_PROGRESS  ──►  RESOLVED
```

- Only **ADMINs** can advance the ticket status.
- Once a ticket moves out of `OPEN`, it **cannot be edited** by the owning user.
- **RESOLVED** tickets cannot be deleted.

### 🔍 Advanced Search
The `GET /api/tickets` endpoint supports a query parameter `?q=` that performs a **case-insensitive, partial-match search** across three fields simultaneously using Prisma's `OR` logic:

1. Ticket **Title**
2. Creator **Email**
3. Creator **Name**

Combined with **pagination** (`page`, `limit`), results are always returned with a `meta` object containing `total`, `page`, `limit`, and `lastPage`.

### 🔒 Security
- **Bcrypt password hashing** with 12 salt rounds applied to all passwords at rest.
- **Secure password update flow**: A user must supply their current password to set a new one. The API also prevents reusing the same password.
- **Response sanitization**: The `password` field is never returned in any API response; all queries use explicit `select` projections.
- **Global Validation Pipe**: `whitelist: true` and `forbidNonWhitelisted: true` strip and reject any unknown request body properties.
- **CORS** configured for known local development origins.

### ✏️ Edit Restrictions
- A user can only edit ticket `title` and `description` if:
  1. They are the **owner** of the ticket.
  2. The ticket status is **`OPEN`**.
- Any edit attempt on an `IN_PROGRESS` or `RESOLVED` ticket returns `403 Forbidden`.

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Ticket models + enums)
│   └── seed.ts                # Database seeder (admin + sample user + 5 tickets)
│
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── change-password.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts    # Passport JWT strategy + isActive check
│   │   ├── auth.controller.ts     # POST /auth/register, /auth/login, PATCH /auth/password
│   │   ├── auth.module.ts
│   │   └── auth.service.ts        # register, login, changePassword logic
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts  # @CurrentUser() param decorator
│   │   │   └── roles.decorator.ts         # @Roles() metadata decorator
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts          # Extends AuthGuard('jwt')
│   │       └── roles.guard.ts             # Reads @Roles() metadata, enforces RBAC
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts      # PrismaClient with MariaDB driver adapter
│   │
│   ├── tickets/
│   │   ├── dto/
│   │   │   ├── create-ticket.dto.ts
│   │   │   ├── update-ticket-status.dto.ts
│   │   │   └── update-ticket.dto.ts
│   │   ├── tickets.controller.ts  # Full ticket CRUD + status update
│   │   ├── tickets.module.ts
│   │   └── tickets.service.ts     # Lifecycle, search, ownership & pagination logic
│   │
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── users.controller.ts    # ADMIN-only user management
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   │
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                    # Bootstrap: CORS, ValidationPipe, Swagger setup
│
├── .env.example                   # Environment variable template
├── nest-cli.json
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── tsconfig.build.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A running **MariaDB** (or MySQL-compatible) server

### Step 1 — Install Dependencies

```bash
cd backend
npm install
```

### Step 2 — Configure Environment Variables

Copy the example file and fill in your local values:

```bash
cp .env.example .env
```

Open `.env` and set your database credentials and JWT secret. See the [Environment Variables](#-environment-variables) section for the full reference.

### Step 3 — Generate the Prisma Client

```bash
npx prisma generate
```

This compiles the Prisma schema into a type-safe client in `node_modules/@prisma/client`.

### Step 4 — Apply Database Migrations (Optional)

If you want Prisma to create the tables automatically, run:

```bash
npx prisma db push
```

> **Note:** `db push` is recommended for local development. For production, use `prisma migrate deploy`.

### Step 5 — Seed the Database

Populate the database with a default **admin** user, a **regular user**, and **5 sample tickets**:

```bash
npx prisma db seed
```

### Step 6 — Start the Development Server

```bash
npm run start:dev
```

The API will be available at:
- **Base URL:** `http://localhost:3000/api`
- **Swagger UI:** `http://localhost:3000/api/docs`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory. All variables are required unless marked optional.

```dotenv
# ─── Database ────────────────────────────────────────────────────────────────

# Full connection string used by Prisma CLI (migrations, db push, etc.)
DATABASE_URL="mysql://your_db_user:your_db_password@localhost:3306/your_db_name"

# Individual credentials used by the Prisma Driver Adapter at runtime
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password_here
DB_NAME=ticketing_db

# ─── Application ─────────────────────────────────────────────────────────────

# Port the NestJS server listens on
PORT=3000

# ─── JWT ─────────────────────────────────────────────────────────────────────

# Strong random secret — change this in production!
JWT_SECRET="generate_a_strong_secret_key_here"

# Token expiry duration (e.g. 7d, 24h, 3600)
JWT_EXPIRES_IN="7d"
```

> ⚠️ **Important:** `DATABASE_URL` is used exclusively by the Prisma CLI. The Driver Adapter at runtime reads the individual `DB_*` variables instead.

---

## 📖 API Documentation

All endpoints are prefixed with `/api`. Interactive documentation is available at `http://localhost:3000/api/docs` once the server is running.

### Authentication (`/api/auth`)

| Method  | Endpoint           | Auth Required | Role  | Description                              |
| ------- | ------------------ | :-----------: | ----- | ---------------------------------------- |
| `POST`  | `/auth/register`   | ❌             | —     | Register a new user account              |
| `POST`  | `/auth/login`      | ❌             | —     | Login and receive a JWT `access_token`   |
| `PATCH` | `/auth/password`   | ✅ JWT         | Any   | Change own password (requires old password) |

---

### Tickets (`/api/tickets`)

| Method   | Endpoint              | Auth Required | Role    | Description                                                |
| -------- | --------------------- | :-----------: | ------- | ---------------------------------------------------------- |
| `POST`   | `/tickets`            | ✅ JWT         | `USER`  | Create a new support ticket                                |
| `GET`    | `/tickets`            | ✅ JWT         | Any     | List tickets with pagination & search (`?page=&limit=&q=`) |
| `GET`    | `/tickets/:id`        | ✅ JWT         | Any     | Get a single ticket by UUID                                |
| `PATCH`  | `/tickets/:id`        | ✅ JWT         | `USER`  | Edit own ticket (only if status is `OPEN`)                 |
| `PATCH`  | `/tickets/:id/status` | ✅ JWT         | `ADMIN` | Update ticket status (`OPEN → IN_PROGRESS → RESOLVED`)     |
| `DELETE` | `/tickets/:id`        | ✅ JWT         | `USER`  | Delete own ticket (not allowed if `RESOLVED`)              |

**Search Query Parameters for `GET /tickets`:**

| Parameter | Type     | Default | Description                                      |
| --------- | -------- | ------- | ------------------------------------------------ |
| `page`    | `number` | `1`     | Page number                                      |
| `limit`   | `number` | `9`     | Results per page (max: 50)                       |
| `q`       | `string` | —       | Search term matched against title, email, or name |

---

### Users (`/api/users`)

> All user management endpoints require **ADMIN** role.

| Method   | Endpoint       | Description                               |
| -------- | -------------- | ----------------------------------------- |
| `GET`    | `/users`       | List all users                            |
| `GET`    | `/users/:id`   | Get a single user by UUID                 |
| `POST`   | `/users`       | Create a new user account (admin action)  |
| `PATCH`  | `/users/:id`   | Update user name, role, or `isActive` flag |
| `DELETE` | `/users/:id`   | Permanently delete a user account         |

---

## 🌱 Default Seed Credentials

After running `npx prisma db seed`, the following test accounts will be available:

| Role    | Email               | Password     |
| ------- | ------------------- | ------------ |
| `ADMIN` | admin@support.com   | `Admin1234!` |
| `USER`  | user@support.com    | `User1234!`  |

> ⚠️ **Never use these credentials in a production environment.**

---

## 📦 Available Scripts

Run all commands from the `backend/` directory.

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm run start:dev`     | Start in watch mode (development)                |
| `npm run start:prod`    | Start compiled production build                  |
| `npm run build`         | Compile TypeScript to `dist/`                    |
| `npm run lint`          | Run ESLint and auto-fix issues                   |
| `npm run format`        | Format code with Prettier                        |
| `npm run test`          | Run unit tests with Jest                         |
| `npm run test:cov`      | Run tests with coverage report                   |
| `npm run test:e2e`      | Run end-to-end tests                             |
| `npx prisma generate`   | Regenerate the Prisma Client after schema changes |
| `npx prisma db push`    | Sync schema to the database (dev only)           |
| `npx prisma db seed`    | Run the database seeder                          |
| `npx prisma studio`     | Open Prisma Studio (visual DB explorer)          |

---

## 🐳 Docker Deployment

<p>
  <a href="https://hub.docker.com/r/manuthlakdiw/ticketing-backend">
    <img src="https://img.shields.io/badge/Docker_Hub-manuthlakdiw%2Fticke‌​ting--backend-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Hub" />
  </a>
  <img src="https://img.shields.io/badge/Image_Tag-v1-0ea5e9?style=for-the-badge" alt="v1" />
  <img src="https://img.shields.io/badge/Port-3000-6366f1?style=for-the-badge" alt="Port 3000" />
</p>

A pre-built production image is available on Docker Hub. No local build or Node.js installation required.

### Pull the Image

```bash
docker pull manuthlakdiw/ticketing-backend:v1
```

### Run as a Standalone Container

The container connects to your **host machine's local MariaDB** database via `host.docker.internal`. Pass all required credentials as environment variables at runtime:

```bash
docker run -d \
  --name ticketing_backend \
  -p 3000:3000 \
  --add-host=host.docker.internal:host-gateway \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=root \
  -e DB_PASSWORD=your_db_password_here \
  -e DB_NAME=ticketing_db \
  -e DATABASE_URL="mysql://root:your_db_password_here@host.docker.internal:3306/ticketing_db?allowPublicKeyRetrieval=true" \
  -e JWT_SECRET=your_strong_jwt_secret_here \
  -e JWT_EXPIRES_IN=7d \
  -e CORS_ORIGIN=http://localhost:3001 \
  manuthlakdiw/ticketing-backend:v1
```

Once running, the API is available at:
- **Base URL:** `http://localhost:3000/api`
- **Swagger UI:** `http://localhost:3000/api/docs`

> **Tip:** For running both services together, use the Docker Compose quick-start in the [Root README](../README.md#-docker-quick-start).

---

## 📄 License

This project is **UNLICENSED** and intended for educational purposes only.
