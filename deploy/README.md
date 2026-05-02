## Deploy ke VPS (Docker)

Target: **1 domain** untuk web + API (cookie session aman), semuanya jalan via Docker:

- `caddy`: reverse proxy + HTTPS (Let's Encrypt)
- `web`: static React build (Nginx)
- `api`: Node/Express + Drizzle migrations auto-run saat start
- `postgres`: database

Stack didefinisikan di **`docker-compose.yml` pada root repo** (jalankan dengan `--profile full`).

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

### 1) Upload source code ke VPS

Opsi paling mudah: clone repo.

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
- **`POSTGRES_PASSWORD`**: ganti password DB (dan sesuaikan `DATABASE_URL` jika perlu).
- **`BETTER_AUTH_SECRET`**: ganti secret (minimal 32 karakter, acak).
- Pastikan **`BETTER_AUTH_URL`**, **`CORS_ORIGIN`**, **`VITE_API_BASE_URL`** pakai `https://<domain>` yang sama dengan browser.

**Opsi B — env di root** (setara): salin [`.env.docker.example`](../.env.docker.example) ke `.env.docker` di root dan isi nilai produksi.

### 3) Jalankan container (build + up)

Dari **root repo**:

```bash
docker compose --profile full --env-file deploy/.env.prod up -d --build
```

Jika memakai `.env.docker` di root:

```bash
docker compose --profile full --env-file .env.docker up -d --build
```

Cek status:

```bash
docker compose --profile full --env-file deploy/.env.prod ps
docker compose --profile full --env-file deploy/.env.prod logs -f --tail=200
```

(Sesuaikan `--env-file` jika memakai `.env.docker`.)

### 4) (Opsional) Seed database

Seed akan membuat user demo (lihat `README.md` root). Jalankan sekali saja.

```bash
docker compose --profile full --env-file deploy/.env.prod exec api npm run db:seed:dist
```

### 5) Update versi (redeploy)

```bash
git pull
docker compose --profile full --env-file deploy/.env.prod up -d --build
```

### Catatan penting

- Port publik hanya `80/443` dari Caddy. `api` dan `web` tidak diexpose keluar.
- Migrations jalan otomatis setiap `api` start (`npm run db:migrate`).
- Kalau domain belum mengarah ke VPS, Caddy tidak bisa issue sertifikat (HTTPS).
