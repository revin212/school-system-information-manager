export type UserRole = 'ADMIN' | 'TU' | 'GURU' | 'KEPSEK'

export type AuthUser = {
  id: string
  nama: string
  email?: string
  peran: UserRole
}

const STORAGE_KEY = 'simsekolah.auth.user'

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setAuthUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearAuthUser() {
  setAuthUser(null)
}

export async function mockLogin(params: {
  identifier: string
  password: string
}): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 350))

  const identifier = params.identifier.trim().toLowerCase()
  if (!identifier || !params.password) {
    throw new Error('Email/NIP dan kata sandi wajib diisi.')
  }

  // Simple demo users by identifier
  if (identifier.includes('guru')) {
    return { id: 'u_guru', nama: 'Ibu Sari', email: params.identifier, peran: 'GURU' }
  }
  if (identifier.includes('kepsek')) {
    return { id: 'u_kepsek', nama: 'Bapak Andi', email: params.identifier, peran: 'KEPSEK' }
  }
  if (identifier.includes('tu')) {
    return { id: 'u_tu', nama: 'Admin TU', email: params.identifier, peran: 'TU' }
  }
  return { id: 'u_admin', nama: 'Admin Utama', email: params.identifier, peran: 'ADMIN' }
}

export async function login(params: { identifier: string; password: string }): Promise<AuthUser> {
  const { USE_MOCK } = await import('../../lib/api/config')
  if (USE_MOCK) return mockLogin(params)
  const api = await import('../../lib/api/auth')
  return api.login(params)
}

export async function logout(): Promise<void> {
  const { USE_MOCK } = await import('../../lib/api/config')
  if (USE_MOCK) {
    clearAuthUser()
    return
  }
  const api = await import('../../lib/api/auth')
  await api.logout()
  clearAuthUser()
}

export async function fetchMe(): Promise<AuthUser> {
  const { USE_MOCK } = await import('../../lib/api/config')
  if (USE_MOCK) {
    const user = getAuthUser()
    if (!user) throw new Error('Belum masuk.')
    return user
  }
  const api = await import('../../lib/api/auth')
  return api.me()
}

