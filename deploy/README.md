## Deploy ke VPS (Docker)

Target: **satu domain** untuk web + API (cookie session aman), stack aplikasi (`caddy`, `web`, `api`) jalan via Docker. **PostgreSQL tidak ikut stack repo ini di VPS**—dipakai **satu instance container Postgres bersama** untuk banyak proyek di server yang sama.

- `caddy`: reverse proxy + HTTPS (Let's Encrypt)
- `web`: static React build (Nginx)
- `api`: Node/Express + Drizzle migrations auto-run saat start
- **PostgreSQL**: container terpisah (sekali di VPS), banyak database/user per aplikasi; aplikasi ini menyambung lewat **Docker network bersama**

Definisi Compose: [`docker-compose.yml`](../docker-compose.yml) + untuk produksi [`docker-compose.prod.yml`](../docker-compose.prod.yml) (network eksternal, tanpa menaikkan layanan `postgres`).

### Prasyarat

- VPS Linux (Ubuntu/Debian recommended)
- DNS A record domain → IP VPS (mis. `sim.example.com`)
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

**Network Docker** (nama konsisten; default di env: `shared_db`):

```bash
docker network create shared_db
```

**Container Postgres** (jalankan **di luar** repo ini—folder infra terpisah atau `docker run`). Kontrak yang disarankan:

- Image: `postgres:16-alpine` (selaras dengan dev lokal)
- **Volume named** untuk data (`/var/lib/postgresql/data`)
- Sambungkan container ke network yang sama: `docker network connect shared_db <nama_container_postgres>` saat membuat, atau gunakan flag `--network shared_db`
- **Jangan** publish `5432` ke `0.0.0.0` di internet. Jika perlu akses admin dari host saja: `-p 127.0.0.1:5432:5432` atau hanya koneksi antar-container (tanpa publish port)

**Database dan user khusus aplikasi ini** (ganti password; jalankan sebagai superuser Postgres, mis. `psql` ke container):

```sql
CREATE USER simsekolah WITH PASSWORD 'ganti_password_kuat';
CREATE DATABASE simsekolah OWNER simsekolah;
GRANT ALL PRIVILEGES ON DATABASE simsekolah TO simsekolah;
```

Sesuaikan nama user/database/password dengan nilai di `DATABASE_URL`.

Host di `DATABASE_URL` harus **nama DNS Docker** yang bisa di-resolve dari container `api`—biasanya **nama container** Postgres atau **alias network** (contoh: `shared-postgres`, `pg`). Semua container itu harus berada di network **`shared_db`** (atau nama yang Anda set di `SHARED_DOCKER_NETWORK`).

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

Edit `deploy/.env.prod`:

- **`SITE_ADDRESS`**: domain kamu (mis. `sim.example.com`); dipakai Caddy untuk HTTPS otomatis.
- **`SHARED_DOCKER_NETWORK`**: nama network Docker bersama (default `shared_db`); harus sama dengan network tempat container Postgres bersama terpasang.
- **`DATABASE_URL`**: URL ke Postgres bersama, host = nama container/alias di network itu, bukan `postgres` dari compose lokal kecuali Anda memang memberi nama tersebut di network bersama.
  - Contoh: `postgres://simsekolah:ganti_password_kuat@nama_container_pg:5432/simsekolah`
- **`BETTER_AUTH_SECRET`**: ganti secret (minimal 32 karakter, acak).
- Pastikan **`BETTER_AUTH_URL`**, **`CORS_ORIGIN`**, **`VITE_API_BASE_URL`** pakai `https://<domain>` yang sama dengan browser.
- Variabel **`POSTGRES_*`** di file contoh bersifat **referensi** untuk provisioning DB (tidak dipakai Compose produksi tanpa layanan `postgres`).

**Opsi B — env di root** (setara): salin [`.env.docker.example`](../.env.docker.example) ke `.env.docker` di root dan isi nilai produksi; untuk VPS tetap sertakan `SHARED_DOCKER_NETWORK` dan `DATABASE_URL` ke Postgres bersama (bisa menambahkan key tersebut mengikuti `.env.prod.example`).

### 3) Jalankan container (build + up)

Pastikan **network** sudah ada dan **Postgres bersama** sudah jalan sebelum menaikkan `api` (migrasi dijalankan saat start).

Dari **root repo**:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile full --env-file deploy/.env.prod up -d --build
```

Jika memakai `.env.docker` di root (tambahkan `SHARED_DOCKER_NETWORK` dan `DATABASE_URL` yang benar di file tersebut):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile full --env-file .env.docker up -d --build
```

Cek status:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile full --env-file deploy/.env.prod ps
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile full --env-file deploy/.env.prod logs -f --tail=200
```

(Sesuaikan `--env-file` jika memakai `.env.docker`.)

### 4) (Opsional) Seed database

Seed akan membuat user demo (lihat `README.md` root). Jalankan sekali saja.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile full --env-file deploy/.env.prod exec api npm run db:seed:dist
```

### 5) Update versi (redeploy)

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile full --env-file deploy/.env.prod up -d --build
```

### Catatan penting

- Port publik hanya `80/443` dari Caddy. `api` dan `web` tidak diexpose keluar.
- Migrations jalan otomatis setiap `api` start (`npm run db:migrate`). Jika migrasi gagal karena DB belum siap, setelah Postgres sehat jalankan `docker compose ... restart api` sekali.
- Kalau domain belum mengarah ke VPS, Caddy tidak bisa issue sertifikat (HTTPS).
- **`docker compose ... down` atau `down -v` pada stack aplikasi ini** hanya memengaruhi volume yang dideklarasikan di project ini (mis. Caddy). **Tidak** menghapus volume data Postgres bersama (karena Postgres tidak termasuk project ini). Tetap hati-hati dengan flag `-v` pada stack lain yang memang memuat Postgres.
- Backup dan keamanan Postgres bersama memengaruhi **semua** proyek yang memakainya; jaga firewall dan kredensial per-database.

### Lokal / dev: Postgres dari compose repo ini

Untuk menjalankan PostgreSQL dari [`docker-compose.yml`](../docker-compose.yml) (profil `local-db`), full stack lokal, atau dev npm + DB saja, lihat [`README.md`](../README.md) bagian Docker—perintah memakai `--profile local-db` bersama `postgres`.
