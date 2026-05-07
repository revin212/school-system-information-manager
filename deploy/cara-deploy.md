# Cara Deploy School SIM (Ubuntu VPS)

Panduan ini mengikuti pola koordinasi portfolio:

- Frontend static di host: `https://sim.revindennis.cloud`
- API di Docker: `https://sim-api.revindennis.cloud` -> `127.0.0.1:4005`
- Postgres bersama: container `postgres-portfolio` pada network `postgres-portfolio-net`

## 1) Prasyarat server

Di VPS Ubuntu:

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx ufw
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker version
docker compose version
```

Firewall minimal:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## 2) DNS yang harus aktif

Pastikan A record sudah mengarah ke IP VPS:

- `sim.revindennis.cloud`
- `sim-api.revindennis.cloud`

## 3) Siapkan Postgres bersama (sekali per VPS)

Network Docker koordinasi:

```bash
docker network create postgres-portfolio-net
```

Pastikan container Postgres bersama aktif:

- Nama container: `postgres-portfolio`
- Terhubung ke network: `postgres-portfolio-net`
- Jangan expose `5432` ke publik internet

DB dan user School SIM:

- User: `simsekolah_user`
- Database: `simsekolah`

## 4) Clone repo dan set environment

```bash
git clone <repo-url> school-information-manager
cd school-information-manager
cp deploy/.env.prod.example deploy/.env.prod
```

Edit `deploy/.env.prod`:

- `SHARED_DOCKER_NETWORK=postgres-portfolio-net`
- `DATABASE_URL=postgres://simsekolah_user:<PASSWORD_DB>@postgres-portfolio:5432/simsekolah`
- `BETTER_AUTH_SECRET=...` (random panjang, minimal 32 karakter)
- `BETTER_AUTH_URL=https://sim.revindennis.cloud`
- `CORS_ORIGIN=https://sim.revindennis.cloud`
- `VITE_API_BASE_URL=https://sim-api.revindennis.cloud`
- `API_PORT=4005`
- `API_INTERNAL_PORT=8000`

## 5) Build frontend ke host path

```bash
cd apps/web
npm ci
VITE_API_BASE_URL=https://sim-api.revindennis.cloud npm run build
sudo mkdir -p /var/www/sim
sudo rsync -av --delete dist/ /var/www/sim/dist/
cd ../..
```

## 6) Jalankan API Docker (API-only)

Dari root repo:

```bash
docker compose -f deploy/docker-compose.api-only.yml --env-file deploy/.env.prod up -d --build
docker compose -f deploy/docker-compose.api-only.yml --env-file deploy/.env.prod ps
docker compose -f deploy/docker-compose.api-only.yml --env-file deploy/.env.prod logs -f --tail=200
```

Catatan:

- API hanya bind ke `127.0.0.1:4005`.
- Akses publik API wajib lewat Nginx host.

## 7) Pasang konfigurasi Nginx

```bash
sudo cp deploy/nginx/sim.revindennis.cloud.conf /etc/nginx/sites-available/sim.revindennis.cloud.conf
sudo ln -sf /etc/nginx/sites-available/sim.revindennis.cloud.conf /etc/nginx/sites-enabled/sim.revindennis.cloud.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 8) Aktifkan HTTPS (Certbot)

```bash
sudo certbot --nginx -d sim.revindennis.cloud -d sim-api.revindennis.cloud
sudo systemctl status certbot.timer
```

## 9) Verifikasi

```bash
curl -I https://sim.revindennis.cloud
curl -I https://sim-api.revindennis.cloud/health
```

Yang harus lolos:

- Frontend membuka School SIM di `sim.revindennis.cloud`
- Request API frontend masuk ke `sim-api.revindennis.cloud`
- Cookie/session auth valid pada origin HTTPS frontend

## 10) Redeploy update aplikasi

```bash
git pull
cd apps/web
npm ci
VITE_API_BASE_URL=https://sim-api.revindennis.cloud npm run build
sudo rsync -av --delete dist/ /var/www/sim/dist/
cd ../..
docker compose -f deploy/docker-compose.api-only.yml --env-file deploy/.env.prod up -d --build
```

## Coordination (ringkas)

- Frontend: `https://sim.revindennis.cloud`
- API public: `https://sim-api.revindennis.cloud`
- API loopback: `127.0.0.1:4005`
- Database: `simsekolah` (user `simsekolah_user`)
- Env yang harus selalu sinkron dengan Nginx/Certbot:
  - `BETTER_AUTH_URL`
  - `CORS_ORIGIN`
  - `VITE_API_BASE_URL`
  - `API_PORT`
