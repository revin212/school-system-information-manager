import type { NextFunction, Request, Response } from 'express'
import { APIError, isAPIError } from 'better-auth/api'
import { ZodError } from 'zod'
import { AppError, zodToFieldErrors } from '../http/errors'
import { fail } from '../http/respond'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json(fail({ message: err.message, code: err.code, fieldErrors: err.fieldErrors }))
  }

  if (err instanceof ZodError) {
    return res.status(400).json(fail({ message: 'Input tidak valid.', code: 'VALIDATION_ERROR', fieldErrors: zodToFieldErrors(err) }))
  }

  if (isAPIError(err)) {
    const e = err as APIError
    const status = typeof e.status === 'number' ? e.status : Number(e.status ?? 400)
    return res.status(Number.isFinite(status) ? status : 400).json(fail({ message: e.message || 'Terjadi kesalahan.' }))
  }

  // eslint-disable-next-line no-console
  console.error(err)
  return res.status(500).json(fail({ message: 'Terjadi kesalahan pada server.' }))
}

