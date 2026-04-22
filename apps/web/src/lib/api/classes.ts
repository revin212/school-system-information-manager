import type { ClassLevel, ClassStatus, SchoolClass } from '../mockApi/types'
import { apiFetch } from './http'

export type ListClassesParams = {
  q?: string
  status?: ClassStatus | ''
  tingkat?: ClassLevel | ''
}

export async function listClasses(params: ListClassesParams): Promise<SchoolClass[]> {
  return apiFetch('/api/v1/classes', {
    method: 'GET',
    query: {
      q: params.q ?? '',
      status: params.status ?? '',
      tingkat: params.tingkat ?? '',
    },
  })
}

export async function createClass(input: {
  nama: string
  tingkat: ClassLevel
  jurusanId?: string
  status: ClassStatus
}): Promise<SchoolClass> {
  return apiFetch('/api/v1/classes', { method: 'POST', body: input })
}

export async function updateClass(
  id: string,
  patch: Partial<Pick<SchoolClass, 'nama' | 'tingkat' | 'jurusanId' | 'status'>>,
): Promise<SchoolClass> {
  return apiFetch(`/api/v1/classes/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteClass(id: string): Promise<void> {
  await apiFetch(`/api/v1/classes/${id}`, { method: 'DELETE' })
}

