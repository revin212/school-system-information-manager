import { API_BASE_URL } from './config'

type ApiEnvelopeOk<T> = { data: T }
type ApiEnvelopeErr = { error: { message: string; code?: string; fieldErrors?: Record<string, string> } }
type ApiEnvelope<T> = ApiEnvelopeOk<T> | ApiEnvelopeErr

export type ApiFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
}

function buildUrl(path: string, query?: ApiFetchOptions['query']) {
  const base = API_BASE_URL.replace(/\/+$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${base}${p}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

async function parseJsonSafe(res: Response) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

export async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.query)
  const method = opts.method ?? (opts.body ? 'POST' : 'GET')

  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: opts.body ? { 'content-type': 'application/json' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })

  const json = (await parseJsonSafe(res)) as ApiEnvelope<T> | null

  if (json && typeof json === 'object' && 'error' in json && json.error) {
    throw new Error(json.error.message || 'Terjadi kesalahan.')
  }

  if (!res.ok) {
    throw new Error('Terjadi kesalahan.')
  }

  if (json && typeof json === 'object' && 'data' in json) {
    return (json as ApiEnvelopeOk<T>).data
  }

  // fallback (jika endpoint mengembalikan raw JSON)
  return json as T
}

