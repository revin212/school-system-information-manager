## SIM Sekolah (School System Information Manager)

Monorepo untuk aplikasi manajemen sekolah: backend REST API (Express) + frontend web (React/Vite). Frontend bisa dijalankan dengan **mock API** atau terhubung ke **backend** lewat session-cookie auth.

## Tech stack

- **Frontend**: React, TypeScript, Vite, TanStack Query, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Zod, Better Auth (session cookie)
- **Database**: PostgreSQL (dev via Docker Compose)
- **ORM/Migrations**: Drizzle ORM

## Struktur repo

- `apps/api`: REST API (`http://localhost:8000`)
- `apps/web`: Web app (Vite dev server, default `http://localhost:5173`)

## Menjalankan lokal (dev)

### 1) Jalankan PostgreSQL (dev)

Dari root repo:

```bash
docker compose up -d
```

### 2) Jalankan backend (apps/api)

1) Buat env:
- Copy `.env.example` → `.env` (di root), atau
- Copy `apps/api/.env.example` → `apps/api/.env`

2) Install & run:

```bash
cd apps/api
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Endpoint auth (cookie session):
- `POST /api/auth/login` body: `{ identifier, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Demo user hasil seed (dev):
- identifier: `admin` (atau `admin@sim.local`)
- password: `password1234`

### 3) Jalankan frontend (apps/web)

```bash
cd apps/web
npm install
npm run dev
```

#### Mode data source (mock vs backend)

Frontend pakai env berikut (buat file `apps/web/.env.local`):

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=false
```

- `VITE_USE_MOCK=true`: pakai `apps/web/src/lib/mockApi/*`
- `VITE_USE_MOCK=false`: request ke backend dengan `credentials: 'include'`

## Catatan

- Root `.env.example` berisi env dev untuk backend (port, DB URL, CORS, Better Auth).
- `apps/web/.env.example` berisi contoh env khusus frontend.

