import type { Config } from 'drizzle-kit'
import { existsSync } from 'node:fs'
import { config as loadEnv } from 'dotenv'

// drizzle-kit does not automatically load .env.* files.
// We support local-first env files for dev.
const envPath = existsSync('.env.local') ? '.env.local' : existsSync('.env') ? '.env' : undefined
loadEnv(envPath ? { path: envPath } : undefined)

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is missing. Create apps/api/.env.local (or apps/api/.env) with DATABASE_URL=postgres://...',
  )
}

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config

