import type { NextFunction, Request, Response } from 'express'
import { auth } from '../auth/auth'
import { AppError } from '../http/errors'

export type UserRole = 'ADMIN' | 'TU' | 'GURU' | 'KEPSEK'

export type AuthedRequest = Request & {
  authUser?: { id: string; nama: string; email?: string; peran: UserRole }
}

export async function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any })
    if (!session?.user) throw new AppError({ status: 401, message: 'Belum masuk.' })

    // better-auth user has `name`, `email`, and our additional field `role`
    const user = session.user as unknown as { id: string; name: string; email?: string; role?: UserRole }
    req.authUser = { id: user.id, nama: user.name, email: user.email, peran: (user.role ?? 'ADMIN') as UserRole }
    return next()
  } catch (e) {
    return next(e)
  }
}

export function requireRole(roles: UserRole[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.authUser) return next(new AppError({ status: 401, message: 'Belum masuk.' }))
    if (!roles.includes(req.authUser.peran)) return next(new AppError({ status: 403, message: 'Akses ditolak.' }))
    return next()
  }
}

