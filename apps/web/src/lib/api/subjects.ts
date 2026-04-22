import type { Subject, SubjectStatus } from '../mockApi/types'
import { apiFetch } from './http'

export type ListSubjectsParams = {
  q?: string
  status?: SubjectStatus | ''
}

export async function listSubjects(params: ListSubjectsParams): Promise<Subject[]> {
  return apiFetch('/api/v1/subjects', {
    method: 'GET',
    query: {
      q: params.q ?? '',
      status: params.status ?? '',
    },
  })
}

export async function createSubject(input: { kode: string; nama: string; status: SubjectStatus }): Promise<Subject> {
  return apiFetch('/api/v1/subjects', { method: 'POST', body: input })
}

export async function updateSubject(
  id: string,
  patch: Partial<Pick<Subject, 'kode' | 'nama' | 'status'>>,
): Promise<Subject> {
  return apiFetch(`/api/v1/subjects/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteSubject(id: string): Promise<void> {
  await apiFetch(`/api/v1/subjects/${id}`, { method: 'DELETE' })
}

