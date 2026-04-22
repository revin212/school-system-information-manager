const env = import.meta.env as unknown as Record<string, string | undefined>

function envString(key: string, fallback: string) {
  const v = env[key]
  return typeof v === 'string' && v.trim() ? v : fallback
}

function envBool(key: string, fallback: boolean) {
  const raw = env[key]
  if (typeof raw !== 'string') return fallback
  const v = raw.trim().toLowerCase()
  if (v === 'true' || v === '1' || v === 'yes') return true
  if (v === 'false' || v === '0' || v === 'no') return false
  return fallback
}

export const API_BASE_URL = envString('VITE_API_BASE_URL', 'http://localhost:8000')
export const USE_MOCK = envBool('VITE_USE_MOCK', true)

