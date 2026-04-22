import { ZodError } from 'zod'

export class AppError extends Error {
  status: number
  code?: string
  fieldErrors?: Record<string, string>

  constructor(params: { message: string; status?: number; code?: string; fieldErrors?: Record<string, string> }) {
    super(params.message)
    this.name = 'AppError'
    this.status = params.status ?? 400
    this.code = params.code
    this.fieldErrors = params.fieldErrors
  }
}

export function zodToFieldErrors(err: ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of err.issues) {
    const key = issue.path.join('.') || 'root'
    if (!out[key]) out[key] = issue.message
  }
  return out
}

