import type { AcademicYear, AcademicYearStatus } from '../mockApi/types'
import { apiFetch } from './http'

export type ListAcademicYearsParams = {
  q?: string
  status?: AcademicYearStatus | ''
}

export async function listAcademicYears(params: ListAcademicYearsParams): Promise<AcademicYear[]> {
  return apiFetch('/api/v1/academic-years', {
    method: 'GET',
    query: { q: params.q ?? '', status: params.status ?? '' },
  })
}

export async function createAcademicYear(input: { nama: string; status: AcademicYearStatus }): Promise<AcademicYear> {
  return apiFetch('/api/v1/academic-years', { method: 'POST', body: input })
}

export async function updateAcademicYear(
  id: string,
  patch: Partial<Pick<AcademicYear, 'nama' | 'status'>>,
): Promise<AcademicYear> {
  return apiFetch(`/api/v1/academic-years/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteAcademicYear(id: string): Promise<void> {
  await apiFetch(`/api/v1/academic-years/${id}`, { method: 'DELETE' })
}

