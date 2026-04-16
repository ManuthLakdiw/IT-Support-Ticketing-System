<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=30&pause=1000&color=6366F1&center=true&vCenter=true&width=750&lines=IT+Support+Ticketing+System;Full-Stack+%7C+Containerized+%7C+CI%2FCD;Built+for+Speed.+Designed+for+Clarity." alt="Typing SVG" />

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge&logo=statuspage&logoColor=white" alt="Status" />
  <img src="https://img.shields.io/badge/Type-Full--Stack-6366f1?style=for-the-badge&logo=stackshare&logoColor=white" alt="Type" />
  <img src="https://img.shields.io/badge/Purpose-Portfolio-f59e0b?style=for-the-badge&logo=bookstack&logoColor=white" alt="Purpose" />
  <img src="https://img.shields.io/badge/License-Unlicensed-94a3b8?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/Docker-Multi--Arch-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Auto--Update-Watchtower-1a365d?style=for-the-badge&logo=docker&logoColor=white" alt="Watchtower" />
  <img src="https://img.shields.io/badge/Registry-Docker_Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Hub" />
</p>

<p align="center">
  A modern, production-ready internal IT helpdesk solution — engineered with a strict role-based access model, a clean React dashboard, and a robust NestJS REST API. Fully containerized with a GitHub Actions CI/CD pipeline that automatically builds, tags, and publishes multi-architecture Docker images to Docker Hub on every push to <code>main</code>. A live Watchtower instance continuously polls Docker Hub and rolls out new images with zero manual intervention.
</p>

<br/>

---

</div>

## 📂 Documentation

> **Looking for technical details, setup instructions, or API endpoints?**
> Please refer to the dedicated documentation for each part of the system:
>
> | Part | README | Docker Hub |
> |------|--------|------------|
> | 🖥 **Frontend** — Next.js App, UI components, environment variables & routes | [**→ View Frontend README**](./frontend/README.md) | [`manuthlakdiw/ticketing-frontend`](https://hub.docker.com/r/manuthlakdiw/ticketing-frontend) |
> | ⚙️ **Backend** — NestJS API, database setup, API endpoints & seed credentials | [**→ View Backend README**](./backend/README.md) | [`manuthlakdiw/ticketing-backend`](https://hub.docker.com/r/manuthlakdiw/ticketing-backend) |

---

## 💡 Project Motivation

Every growing organization runs into the same invisible wall: **IT chaos**.

Support requests arrive through emails, Slack messages, hallway conversations, and sticky notes. Nothing is tracked. Nothing has a clear owner. Problems get lost, duplicated, or forgotten — and productivity suffers as a result.

> **Replace fragmented, ad-hoc IT communication with a single, structured, auditable ticketing workflow.**

| The Problem | The Solution |
|-------------|--------------|
| 🔴 No single source of truth — requests span inboxes and chat threads | ✅ One centralized dashboard where every ticket has a clear owner, status, and history |
| 🔴 Zero accountability — requests have no owner, no status, no audit trail | ✅ A strict, one-way lifecycle (`OPEN → IN_PROGRESS → RESOLVED`) that prevents regression |
| 🔴 Lost context — conversations disappear, the same issue gets reported repeatedly | ✅ Role-based access that separates admin capabilities from end-user capabilities |
| 🔴 No prioritization — every request feels equally urgent | ✅ A modern, responsive interface that makes adoption frictionless for end users |

---

## 🛠 Tech Stack

### Frontend

<p align="left">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Shadcn_UI-18181B?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn UI" />
  <img src="https://img.shields.io/badge/Redux_Toolkit_2-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/next--themes-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="next-themes" />
  <img src="https://img.shields.io/badge/Lucide_React-f97316?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React" />
</p>

### Backend

<p align="left">
  <img src="https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma_ORM_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white" alt="Passport.js" />
  <img src="https://img.shields.io/badge/bcrypt-525252?style=for-the-badge&logo=letsencrypt&logoColor=white" alt="bcrypt" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
</p>

### DevOps & Infrastructure

<p align="left">
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Docker_Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Hub" />
  <img src="https://img.shields.io/badge/Watchtower-1a365d?style=for-the-badge&logo=docker&logoColor=white" alt="Watchtower" />
  <img src="https://img.shields.io/badge/QEMU-FF6600?style=for-the-badge&logo=qemu&logoColor=white" alt="QEMU" />
  <img src="https://img.shields.io/badge/Buildx-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Buildx" />
  <img src="https://img.shields.io/badge/Node.js_v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier" />
</p>

---

## ✨ Key Features

|  | Feature | Description |
|--|---------|-------------|
| 🔐 | **JWT Authentication** | Secure token-based login with server-side validation on every request |
| 🛡 | **Role-Based Access Control** | Two strict roles (`USER` / `ADMIN`) enforced at API layer and in Next.js middleware |
| 🔄 | **One-Way Ticket Lifecycle** | `OPEN → IN_PROGRESS → RESOLVED` — status can never regress |
| 🔍 | **Debounced Live Search** | Case-insensitive, partial-match search across title, creator name, and email |
| 📄 | **Server-Side Pagination** | Efficient pagination with full `meta` info returned on every list response |
| 🌗 | **Light / Dark / System Theme** | OS-aware default with a smooth manual toggle using `next-themes` |
| 🖥 | **Responsive Dashboard** | Collapsible sidebar, skeleton loaders, and a fully responsive layout |
| 👤 | **Admin User Panel** | Full CRUD on user accounts — create, edit, suspend, or delete users in-app |
| ✏️ | **Edit Restrictions** | Tickets can only be edited by their owner while in `OPEN` status |
| 🔒 | **Security by Default** | bcrypt hashing, response sanitization, global validation pipe, and CORS hardening |
| 📖 | **Interactive API Docs** | Auto-generated Swagger UI available in development at `/api/docs` |
| 🚀 | **CI/CD Pipeline** | GitHub Actions automatically builds and pushes Docker images on every `main` push |
| 🏗 | **Multi-Arch Images** | Docker images built for both `linux/amd64` and `linux/arm64` via QEMU + Buildx |
| ♻️ | **Auto-Rolling Updates** | Watchtower polls Docker Hub every 60 seconds and live-updates running containers |

---

## 🚀 CI/CD Pipeline

This project implements a fully automated continuous delivery pipeline using **GitHub Actions**. Every push to the `main` branch triggers a pipeline that builds, tags, and publishes production Docker images — with **zero manual steps**.

### Pipeline Overview

```
  git push → main
       │
       ▼
  ┌─────────────────────────────────┐
  │    GitHub Actions Workflow       │
  │                                 │
  │  1. Checkout Code               │
  │  2. Set up QEMU (multi-arch)    │
  │  3. Set up Docker Buildx        │
  │  4. Login to Docker Hub         │
  │  5. Build & Push Backend Image  │  ──► manuthlakdiw/ticketing-backend:latest
  │  6. Build & Push Frontend Image │  ──► manuthlakdiw/ticketing-frontend:latest
  └─────────────────────────────────┘        (also tagged :v{run_number})
       │
       ▼
  Watchtower (running in Docker)
  polls Docker Hub every 60 seconds
       │
       ▼
  Pulls new :latest images and
  restarts containers automatically
```

### Workflow File — `.github/workflows/docker-publish.yml`

```yaml
name: CI/CD Docker Pipeline

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'README.md'
      - '.gitignore'
      - 'docs/**'
      - 'LICENSE'

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and Push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/ticketing-backend:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/ticketing-backend:v${{ github.run_number }}

      - name: Build and Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/ticketing-frontend:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/ticketing-frontend:v${{ github.run_number }}
```

### Pipeline Highlights

| Feature | Detail |
|---------|--------|
| **Trigger** | Any push to `main` (documentation-only commits are skipped via `paths-ignore`) |
| **Multi-Architecture** | Images are built for `linux/amd64` (x86 servers) and `linux/arm64` (Apple Silicon, Raspberry Pi) using QEMU emulation and Docker Buildx |
| **Dual Tagging** | Every successful run produces a `:latest` tag (for Watchtower) and a versioned `:v{run_number}` tag (for rollbacks) |
| **Secrets** | `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` are stored as GitHub repository secrets — no credentials ever appear in code |
| **Auditability** | Every image version maps to a specific GitHub Actions run number, making rollbacks trivial |

### Required GitHub Secrets

Navigate to **Settings → Secrets and variables → Actions** in your GitHub repository and add:

| Secret Name | Description |
|-------------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | A Docker Hub personal access token (not your password) |

---

## ♻️ Watchtower — Automatic Container Updates

The `docker-compose.yml` includes a **[Watchtower](https://containrrr.dev/watchtower/)** service that runs alongside the application stack. It acts as a live update agent — monitoring Docker Hub for new versions of the running images and automatically pulling and restarting containers when a new image is available.

```yaml
watchtower:
  image: containrrr/watchtower
  container_name: watchtower
  environment:
    - DOCKER_API_VERSION=1.44
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  command: --interval 60   # polls Docker Hub every 60 seconds
  restart: unless-stopped
```

**How the full loop works:**

1. A developer pushes code to `main`
2. GitHub Actions builds new images and publishes them to Docker Hub as `:latest`
3. Watchtower detects the new digest within ~60 seconds
4. Watchtower gracefully stops and replaces the running containers with the new images
5. The updated application is live — **no SSH, no manual `docker pull`, no downtime scripts**

---

## 🐳 Docker Quick Start

The fastest way to run the full system — **no Node.js, no build steps required**. Both images are published to Docker Hub and can be pulled and started in minutes.

### Published Images

| Service | Image | Architectures | Default Port |
|---------|-------|:-------------:|:------------:|
| Backend | [`manuthlakdiw/ticketing-backend`](https://hub.docker.com/r/manuthlakdiw/ticketing-backend) | `amd64` · `arm64` | `3000` |
| Frontend | [`manuthlakdiw/ticketing-frontend`](https://hub.docker.com/r/manuthlakdiw/ticketing-frontend) | `amd64` · `arm64` | `3001` |

### Pull the Images

```bash
docker pull manuthlakdiw/ticketing-backend:latest
docker pull manuthlakdiw/ticketing-frontend:latest
```

### Run with Docker Compose

Save the following as `docker-compose.yml` in any directory. Images are pulled from Docker Hub automatically — no local clone required.

> ⚠️ **Before running:** Copy `backend/.env` with your actual database credentials. The backend connects to your **host machine's local database** via `host.docker.internal`.

```yaml
services:

  backend:
    image: manuthlakdiw/ticketing-backend:latest
    container_name: ticketing_backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: host.docker.internal
      DB_USER: your_db_user
      DB_PASSWORD: your_db_password
      DB_NAME: ticketing_db
      DATABASE_URL: "mysql://your_db_user:your_db_password@host.docker.internal:3306/ticketing_db?allowPublicKeyRetrieval=true"
      JWT_SECRET: "your_strong_jwt_secret_here"
      JWT_EXPIRES_IN: "7d"
      CORS_ORIGIN: "http://localhost:3001"

  frontend:
    image: manuthlakdiw/ticketing-frontend:latest
    container_name: ticketing_frontend
    restart: unless-stopped
    ports:
      - "3001:3001"
    depends_on:
      - backend
    environment:
      NODE_ENV: production
      PORT: 3001
      API_URL: "http://backend:3000/api"
      NEXT_PUBLIC_API_URL: "http://localhost:3000/api"

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    environment:
      - DOCKER_API_VERSION=1.44
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 60
    restart: unless-stopped
```

Start the entire stack with a single command:

```bash
docker compose up -d
```

The system will be available at:

| Service | URL |
|---------|-----|
| 🖥 Frontend App | `http://localhost:3001` |
| ⚙️ Backend API | `http://localhost:3000/api` |
| 📖 Swagger UI | `http://localhost:3000/api/docs` |

---

## 🏗 Repository Structure

```
IT-Support-Ticketing-System/
├── .github/
│   └── workflows/
│       └── docker-publish.yml   🚀 CI/CD pipeline — builds & publishes on push to main
├── backend/                     ⚙️  NestJS REST API — see backend/README.md
├── frontend/                    🖥  Next.js 14 Client App — see frontend/README.md
├── docker-compose.yml           🐳 Full stack + Watchtower auto-updater
└── README.md                    📄 This file
```

For a complete breakdown of the internal file structure of each service, refer to the **Project Structure** sections in the respective README files linked in the [Documentation](#-documentation) section above.

---

## 👨‍💻 Developer

<div align="center">

Built with ☕ and a lot of TypeScript by:

### **Manuth Lakdiw**

*Full-Stack Developer*

<br/>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/manuth-lakdiw)
&nbsp;
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ManuthLakdiw)
&nbsp;
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/u/manuthlakdiw)

<br/>

*Feel free to connect, open an issue, or reach out if you have questions about this project.*

</div>

---

<div align="center">
  <sub>This project is <strong>UNLICENSED</strong> and intended for educational and portfolio purposes only.</sub>
</div>
