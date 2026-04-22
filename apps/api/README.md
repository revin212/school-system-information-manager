# SIM Sekolah API (Express + Drizzle + PostgreSQL + Better Auth)

Base URL: `http://localhost:8000`

## Menyalakan Postgres (dev)

Dari root repo:

```bash
docker compose up -d
```

## Menjalankan API (dev)

1) Copy env:
- dari root: `.env.example` → `.env` (atau set env var di terminal)
- atau `apps/api/.env.example` → `apps/api/.env`

2) Install & run:

```bash
cd apps/api
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Endpoint tahap 1

### Auth (cookie session)
- `POST /api/auth/login` body: `{ identifier, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Master Data: Mata Pelajaran
- `GET /api/v1/subjects?q=&status=`
- `POST /api/v1/subjects`
- `PATCH /api/v1/subjects/:id`
- `DELETE /api/v1/subjects/:id`

