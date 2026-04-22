import type { Major, MajorStatus } from '../mockApi/types'
import { apiFetch } from './http'

export type ListMajorsParams = {
  q?: string
  status?: MajorStatus | ''
}

export async function listMajors(params: ListMajorsParams): Promise<Major[]> {
  return apiFetch('/api/v1/majors', {
    method: 'GET',
    query: { q: params.q ?? '', status: params.status ?? '' },
  })
}

export async function createMajor(input: { kode: string; nama: string; status: MajorStatus }): Promise<Major> {
  return apiFetch('/api/v1/majors', { method: 'POST', body: input })
}

export async function updateMajor(
  id: string,
  patch: Partial<Pick<Major, 'kode' | 'nama' | 'status'>>,
): Promise<Major> {
  return apiFetch(`/api/v1/majors/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteMajor(id: string): Promise<void> {
  await apiFetch(`/api/v1/majors/${id}`, { method: 'DELETE' })
}

