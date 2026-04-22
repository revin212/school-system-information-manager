import { z } from 'zod'

const EnvSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1),
})

export const env = EnvSchema.parse(process.env)

