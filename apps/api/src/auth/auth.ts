import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { env } from '../env'
import { db } from '../db/client'
import { account, session, user, verificationToken } from '../db/schema'

const publicUrl = env.BETTER_AUTH_URL
const isHttps = publicUrl.startsWith('https://')

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: publicUrl,
  trustedOrigins: [publicUrl],
  advanced: {
    // Docker sets NODE_ENV=production; without this, session cookies get Secure and browsers drop them on http:// (local full stack).
    useSecureCookies: isHttps,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verificationToken,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'ADMIN',
      },
    },
  },
})

