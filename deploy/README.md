# Deploy School SIM (Nginx Host + API Docker)

Folder ini berisi artefak deploy yang sudah disinkronkan ke pola koordinasi portfolio:

- Reverse proxy tunggal di VPS: **Nginx host** (bukan Caddy).
- Frontend School SIM: static file di host (`/var/www/sim/dist`).
- API School SIM: container Docker, bind ke loopback `127.0.0.1:4005`.
- Postgres: container bersama `postgres-portfolio` pada network `postgres-portfolio-net`.

## File di folder deploy

- `.env.prod.example`: template env produksi School SIM.
- `docker-compose.api-only.yml`: compose API-only (tanpa service database).
- `nginx/sim.revindennis.cloud.conf`: snippet Nginx untuk frontend + API School SIM.
- `cara-deploy.md`: langkah deploy Ubuntu berbahasa Indonesia.

## Coordination

- Public URL frontend: `https://sim.revindennis.cloud`
- Public URL API: `https://sim-api.revindennis.cloud`
- Loopback API upstream: `127.0.0.1:4005`
- DB user/database: `simsekolah_user` / `simsekolah`
- Env yang wajib sinkron dengan Nginx/Certbot:
  - `BETTER_AUTH_URL=https://sim.revindennis.cloud`
  - `CORS_ORIGIN=https://sim.revindennis.cloud`
  - `VITE_API_BASE_URL=https://sim-api.revindennis.cloud`
  - `API_PORT=4005`

## Minimal deviation dari deploy-coordinated

- Path Dockerfile API di repo ini adalah `apps/api/Dockerfile`, jadi pada compose deploy dipakai `context: ..` + `dockerfile: ./apps/api/Dockerfile` agar tetap bisa dijalankan dari file `deploy/docker-compose.api-only.yml`.
