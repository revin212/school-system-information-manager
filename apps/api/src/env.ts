import { z } from 'zod'
import { existsSync } from 'node:fs'
import { config as loadEnv } from 'dotenv'

// Ensure env is loaded for scripts (seed/migrate/dev).
const envPath = existsSync('apps/api/.env.local')
  ? 'apps/api/.env.local'
  : existsSync('apps/api/.env')
    ? 'apps/api/.env'
    : existsSync('.env.local')
      ? '.env.local'
      : existsSync('.env')
        ? '.env'
        : undefined
loadEnv(envPath ? { path: envPath } : undefined)

const EnvSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1),
})

export const env = EnvSchema.parse(process.env)

