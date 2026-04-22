import { Router } from 'express'
import { z } from 'zod'
import { auth } from '../auth/auth'
import { ok } from '../http/respond'
import { AppError } from '../http/errors'

export const authRouter = Router()

const LoginBodySchema = z.object({
  identifier: z.string(),
  password: z.string(),
})

function resolveEmailFromIdentifier(identifierRaw: string) {
  const identifier = identifierRaw.trim().toLowerCase()
  if (identifier.includes('@')) return identifier
  // Adapter sementara supaya frontend bisa login pakai "nip" atau keyword role.
  if (identifier.includes('guru')) return 'guru@sim.local'
  if (identifier.includes('kepsek')) return 'kepsek@sim.local'
  if (identifier.includes('tu')) return 'tu@sim.local'
  if (identifier.includes('admin')) return 'admin@sim.local'
  return `${identifier}@sim.local`
}

function applySetCookie(res: any, headers: Headers) {
  const anyHeaders = headers as any
  const setCookies: string[] | undefined = typeof anyHeaders.getSetCookie === 'function' ? anyHeaders.getSetCookie() : undefined
  const single = headers.get('set-cookie')
  const value = setCookies?.length ? setCookies : single ? [single] : []
  if (value.length) res.setHeader('set-cookie', value)
}

authRouter.post('/api/auth/login', async (req, res, next) => {
  try {
    const body = LoginBodySchema.parse(req.body)
    const identifier = body.identifier.trim().toLowerCase()
    if (!identifier || !body.password) throw new AppError({ status: 400, message: 'Email/NIP dan kata sandi wajib diisi.' })

    const response = await auth.api.signInEmail({
      body: { email: resolveEmailFromIdentifier(body.identifier), password: body.password, rememberMe: true },
      headers: req.headers as any,
      asResponse: true,
    })

    applySetCookie(res, response.headers)

    const payload = (await response.json().catch(() => null)) as null | {
      user?: { id: string; name: string; email?: string; role?: string }
    }
    const user = payload?.user
    if (!user) throw new AppError({ status: 401, message: 'Email atau kata sandi salah.' })
    return res.json(ok({ id: user.id, nama: user.name, email: user.email, peran: (user.role ?? 'ADMIN') as any }))
  } catch (e) {
    next(e)
  }
})

authRouter.post('/api/auth/logout', async (req, res, next) => {
  try {
    const response = await auth.api.signOut({
      headers: req.headers as any,
      asResponse: true,
    })
    applySetCookie(res, response.headers)
    res.json(ok(true))
  } catch (e) {
    next(e)
  }
})

authRouter.get('/api/auth/me', async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any })
    if (!session?.user) throw new AppError({ status: 401, message: 'Belum masuk.' })
    const user = session.user as unknown as { id: string; name: string; email?: string; role?: string }
    res.json(ok({ id: user.id, nama: user.name, email: user.email, peran: (user.role ?? 'ADMIN') as any }))
  } catch (e) {
    next(e)
  }
})

