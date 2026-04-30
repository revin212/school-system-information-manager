## Deploy ke VPS (Docker)

Target: **1 domain** untuk web + API (cookie session aman), semuanya jalan via Docker:

- `caddy`: reverse proxy + HTTPS (Let's Encrypt)
- `web`: static React build (Nginx)
- `api`: Node/Express + Drizzle migrations auto-run saat start
- `postgres`: database

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

Copy contoh env:

```bash
cd deploy
cp .env.prod.example .env.prod
```

Edit `deploy/.env.prod`:

- `APP_DOMAIN`: domain kamu (mis. `sim.example.com`)
- `POSTGRES_PASSWORD`: ganti password DB
- `BETTER_AUTH_SECRET`: ganti secret (minimal 32 chars, random)
- Pastikan `BETTER_AUTH_URL`, `CORS_ORIGIN`, `VITE_API_BASE_URL` pakai `https://<domain>`

### 3) Jalankan container (build + up)

Dari root repo:

```bash
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env.prod up -d --build
```

Cek status:

```bash
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env.prod ps
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env.prod logs -f --tail=200
```

### 4) (Opsional) Seed database

Seed akan membuat user demo (lihat `README.md` root). Jalankan sekali saja.

```bash
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env.prod exec api npm run db:seed
```

### 5) Update versi (redeploy)

```bash
git pull
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env.prod up -d --build
```

### Catatan penting

- Port publik hanya `80/443` dari Caddy. `api` dan `web` tidak diexpose keluar.
- Migrations jalan otomatis setiap `api` start (`npm run db:migrate`).
- Kalau domain belum mengarah ke VPS, Caddy tidak bisa issue sertifikat (HTTPS).

