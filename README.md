## SIM Sekolah (School System Information Manager)

Monorepo untuk aplikasi manajemen sekolah: backend REST API (Express) + frontend web (React/Vite). Frontend bisa dijalankan dengan **mock API** atau terhubung ke **backend** lewat session-cookie auth.

## Tech stack

- **Frontend**: React, TypeScript, Vite, TanStack Query, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Zod, Better Auth (session cookie)
- **Database**: PostgreSQL (Docker Compose: DB saja untuk dev npm, atau full stack lihat bawah)
- **ORM/Migrations**: Drizzle ORM

## Struktur repo

- `apps/api`: REST API (`http://localhost:8000` saat dev npm)
- `apps/web`: Web app (Vite dev server, default `http://localhost:5173`)

## Menjalankan dengan Docker (full stack)

Seluruh stack (**PostgreSQL + API + frontend statik + Caddy**) dijalankan dari root repo. Layanan Postgres di compose memakai profil **`local-db`**; stack penuh membutuhkan **`--profile full`** dan **`--profile local-db`** bersamaan.

**Deploy ke VPS** dengan satu Postgres bersama (bukan container dari repo ini): ikuti [`deploy/README.md`](deploy/README.md) (`docker-compose.prod.yml` + network eksternal).

1. Siapkan env:

```bash
cp .env.docker.example .env.docker
```

Edit `.env.docker`:

- **`SITE_ADDRESS`**: hostname produksi (mis. `sim.example.com`, HTTPS otomatis via Caddy) atau **`http://localhost`** untuk uji lokal lewat port 80.
- **`BETTER_AUTH_URL`**, **`CORS_ORIGIN`**, **`VITE_API_BASE_URL`**: samakan dengan URL yang dipakai browser (mis. `https://domain` atau `http://localhost`).
- **`BETTER_AUTH_SECRET`**: minimal 32 karakter, acak.
- **`POSTGRES_PASSWORD`** / **`DATABASE_URL`**: sesuaikan jika mengganti user DB (`DATABASE_URL` memakai hostname service `postgres` di network compose lokal).

2. Build dan jalankan:

```bash
docker compose --profile full --profile local-db --env-file .env.docker up -d --build
```

Jika migrasi `api` gagal karena `postgres` belum siap saat start pertama, tunggu DB sehat lalu `docker compose --profile full --profile local-db --env-file .env.docker restart api`.

3. Buka app di browser sesuai `SITE_ADDRESS` (mis. `https://sim.example.com` atau `http://localhost`).

4. (Opsional, sekali) Seed user demo:

```bash
docker compose --profile full --profile local-db --env-file .env.docker exec api npm run db:seed:dist
```

(Pakai `db:seed:dist` di container: image hanya berisi hasil `build`, bukan sumber `tsx` penuh. Lokal dev tetap `npm run db:seed` di `apps/api`.)

Setelah seed, login bisa memakai identifier `admin` atau `admin@sim.local`, password `password1234` (lihat catatan di bawah).

### Menjalankan ulang Docker (migrasi + seed)

**Migrasi:** Saat container `api` menyala, image menjalankan `npm run db:migrate` lalu server (`apps/api/Dockerfile`). Jadi setelah rebuild/restart, skema database mengikuti file migrasi tanpa perlu perintah tambahan—kecuali Anda ingin menjalankan migrasi manual untuk debug:

```bash
docker compose --profile full --profile local-db --env-file .env.docker exec api npm run db:migrate
```

**Alur umum (build ulang + pastikan DB terbaru + data demo):**

```bash
docker compose --profile full --profile local-db --env-file .env.docker up -d --build
docker compose --profile full --profile local-db --env-file .env.docker exec api npm run db:seed:dist
```

Tunggu sampai layanan `postgres` sehat dan `api` sudah jalan sebelum `exec`. Seed boleh diulang; banyak data memakai insert idempotensi (`insertIfMissing`), tetapi duplikat tetap bisa terjadi pada bagian seed yang tidak mengecek duplikat—gunakan DB bersih jika ingin state yang rapat.

**Database dari nol (hapus volume PostgreSQL lalu naikkan lagi):**

```bash
docker compose --profile full --profile local-db --env-file .env.docker down -v
docker compose --profile full --profile local-db --env-file .env.docker up -d --build
docker compose --profile full --profile local-db --env-file .env.docker exec api npm run db:seed:dist
```

Perintah `down -v` menghapus volume yang dideklarasikan di Compose (termasuk data Postgres **lokal** dari compose ini). Setelah itu migrasi tetap dijalankan otomatis saat `api` start; seed memuat ulang user demo dan data contoh.

**Catatan:** `docker compose --profile local-db up -d` **tanpa** `--profile full` hanya menjalankan PostgreSQL (untuk workflow dev npm di bawah). Profile `full` menambahkan `api`, `web`, dan `caddy`; untuk stack lengkap dengan Postgres dari repo ini, pakai **`--profile full`** dan **`--profile local-db`**.

## Menjalankan lokal (dev dengan npm)

### 1) Jalankan PostgreSQL saja

Dari root repo:

```bash
docker compose --profile local-db up -d
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
- Contoh env untuk Docker full stack: `.env.docker.example`.

## Deploy ke VPS (Docker)

Lihat panduan lengkap di [`deploy/README.md`](deploy/README.md): Postgres **bersama** satu container untuk banyak proyek, network Docker, `DATABASE_URL`, serta perintah compose dengan [`docker-compose.prod.yml`](docker-compose.prod.yml).
