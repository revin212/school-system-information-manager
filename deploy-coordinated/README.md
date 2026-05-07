## Deploy ke VPS (API di Docker, frontend di host)

Target deploy sesuai pola portfolio:

- **Frontend** (web) deploy **non-Docker** di host (build → static `dist/`, diserve Nginx host)
- **API** (Node/Express) deploy di Docker
- **PostgreSQL** tidak ikut stack repo ini di VPS: dipakai **satu instance container Postgres bersama** untuk banyak proyek di server yang sama
- **Nginx host** memegang `:80/:443` dan routing per subdomain (static + API)

Di workspace deploy ini, file yang dipakai untuk API-only adalah:

- [`docker-compose.api-only.yml`](docker-compose.api-only.yml)

### Prasyarat

- VPS Linux (Ubuntu/Debian recommended)
- DNS A record domain/subdomain → IP VPS (mis. `sim.revindennis.cloud`, `sim-api.revindennis.cloud`)
- Docker + Docker Compose plugin terpasang

Install Docker (Ubuntu):

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker version
docker compose version
```

### 0) Postgres bersama (sekali per VPS, untuk semua proyek)

**Network Docker** (portfolio mono-repo; default di env: `postgres-portfolio-net`):

```bash
docker network create postgres-portfolio-net
```

(Bisa juga dibuat otomatis oleh compose infra [`docker-infra/postgres`](../docker-infra/postgres/docker-compose.yml) di root workspace portfolio.)

**Container Postgres:** nama **`postgres-portfolio`**, image **`postgres:16-alpine`**, volume named, **jangan** publish `5432` ke `0.0.0.0`.

**Database untuk School SIM (user terpisah per aplikasi):** gunakan skrip [`../scripts/bootstrap-portfolio-databases.sql`](../scripts/bootstrap-portfolio-databases.sql) (user **`simsekolah_user`**, database **`simsekolah`**). Lalu set `DATABASE_URL` ke `postgres://simsekolah_user:...@postgres-portfolio:5432/simsekolah` dan `SHARED_DOCKER_NETWORK=postgres-portfolio-net`.

### 1) Upload source code ke VPS

```bash
git clone <repo-url> simsekolah
cd simsekolah
```

### 2) Siapkan env production

**Opsi A — env di folder deploy:**

```bash
cd deploy
cp .env.prod.example .env.prod
```

(Template terbaru: [`deploy/.env.prod.example`](deploy/.env.prod.example).)

Edit `deploy/.env.prod`:

- **`SHARED_DOCKER_NETWORK`**: `postgres-portfolio-net` (harus sama dengan infra Postgres portfolio).
- **`DATABASE_URL`**: host **`postgres-portfolio`**, user/password **`simsekolah_user`** (sesuai bootstrap), database **`simsekolah`**.
  - Contoh: `postgres://simsekolah_user:ganti_password_kuat@postgres-portfolio:5432/simsekolah`
- **`API_PORT`**: port loopback untuk Nginx host proxy (mis. `4005`)
- **`BETTER_AUTH_SECRET`**: ganti secret (minimal 32 karakter, acak).
- Pastikan **`BETTER_AUTH_URL`** dan **`CORS_ORIGIN`** mengarah ke origin frontend public (`https://sim.revindennis.cloud`)

**Opsi B — env di root** (setara): salin [`.env.docker.example`](../.env.docker.example) ke `.env.docker` di root dan isi nilai produksi; untuk VPS tetap sertakan `SHARED_DOCKER_NETWORK` dan `DATABASE_URL` ke Postgres bersama (bisa menambahkan key tersebut mengikuti `.env.prod.example`).

### 3) Jalankan container API (build + up)

Pastikan **network** sudah ada dan **Postgres bersama** sudah jalan sebelum menaikkan `api` (migrasi dijalankan saat start).

Dari folder repo aplikasi School SIM (atau folder hasil clone di VPS):

```bash
docker compose -f docker-compose.api-only.yml --env-file deploy/.env.prod up -d --build
```

Cek status:

```bash
docker compose -f docker-compose.api-only.yml --env-file deploy/.env.prod ps
docker compose -f docker-compose.api-only.yml --env-file deploy/.env.prod logs -f --tail=200
```

(Sesuaikan `--env-file` jika memakai `.env.docker`.)

### 4) (Opsional) Seed database

Seed akan membuat user demo (lihat `README.md` root). Jalankan sekali saja.

```bash
docker compose -f docker-compose.api-only.yml --env-file deploy/.env.prod exec api npm run db:seed:dist
```

### 5) Update versi (redeploy)

```bash
git pull
docker compose -f docker-compose.api-only.yml --env-file deploy/.env.prod up -d --build
```

### Catatan penting

- Port publik hanya `80/443` dari Nginx host. Compose API-only ini hanya mempublish port ke `127.0.0.1:<API_PORT>`.
- Migrations (jika ada) biasanya jalan saat start. Jika gagal karena DB belum siap, setelah Postgres sehat: `docker compose ... restart api`.
- Backup dan keamanan Postgres bersama memengaruhi **semua** proyek yang memakainya; jaga firewall dan kredensial per-database.

### Nginx host (routing subdomain)

Disarankan pakai subdomain terpisah:

- Frontend: `sim.revindennis.cloud` (static di host)
- API: `sim-api.revindennis.cloud` → `127.0.0.1:4005`
