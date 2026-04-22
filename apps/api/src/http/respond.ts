export function ok<T>(data: T) {
  return { data } as const
}

export function fail(params: { message: string; code?: string; fieldErrors?: Record<string, string> }) {
  return { error: { message: params.message, code: params.code, fieldErrors: params.fieldErrors } } as const
}

