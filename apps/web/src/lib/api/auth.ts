import type { AuthUser } from '../../features/auth/authStore'
import { apiFetch } from './http'

export async function login(params: { identifier: string; password: string }): Promise<AuthUser> {
  return apiFetch('/api/auth/login', { method: 'POST', body: params })
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST', body: {} })
}

export async function me(): Promise<AuthUser> {
  return apiFetch('/api/auth/me', { method: 'GET' })
}

