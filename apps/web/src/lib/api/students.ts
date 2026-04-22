import type { Student, StudentStatus } from '../mockApi/types'
import { apiFetch } from './http'

export type ListStudentsParams = {
  q?: string
  kelasId?: string | ''
  jurusanId?: string | ''
  status?: StudentStatus | ''
}

export async function listStudents(params: ListStudentsParams): Promise<Student[]> {
  return apiFetch('/api/v1/students', {
    method: 'GET',
    query: {
      q: params.q ?? '',
      kelasId: params.kelasId ?? '',
      jurusanId: params.jurusanId ?? '',
      status: params.status ?? '',
    },
  })
}

export async function createStudent(input: {
  nis: string
  nama: string
  kelasId?: string
  jurusanId?: string
  noHp?: string
  status: StudentStatus
}): Promise<Student> {
  return apiFetch('/api/v1/students', { method: 'POST', body: input })
}

export async function updateStudent(
  id: string,
  patch: Partial<Pick<Student, 'nis' | 'nama' | 'kelasId' | 'jurusanId' | 'noHp' | 'status'>>,
): Promise<Student> {
  return apiFetch(`/api/v1/students/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteStudent(id: string): Promise<void> {
  await apiFetch(`/api/v1/students/${id}`, { method: 'DELETE' })
}

