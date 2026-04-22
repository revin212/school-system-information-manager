import type { GradeCategory } from '../mockApi/types'
import { apiFetch } from './http'

export type ListGradeCategoriesParams = {
  tahunAkademikId: string
  kelasId: string
  mapelId: string
}

export async function listGradeCategories(params: ListGradeCategoriesParams): Promise<GradeCategory[]> {
  return apiFetch('/api/v1/grade-categories', {
    method: 'GET',
    query: {
      tahunAkademikId: params.tahunAkademikId,
      kelasId: params.kelasId,
      mapelId: params.mapelId,
    },
  })
}

export async function createGradeCategory(
  input: Omit<GradeCategory, 'id' | 'dibuatPada' | 'diubahPada'>,
): Promise<GradeCategory> {
  return apiFetch('/api/v1/grade-categories', { method: 'POST', body: input })
}

export async function updateGradeCategory(
  id: string,
  patch: Partial<Omit<GradeCategory, 'id' | 'dibuatPada' | 'diubahPada'>>,
): Promise<GradeCategory> {
  return apiFetch(`/api/v1/grade-categories/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteGradeCategory(id: string): Promise<void> {
  await apiFetch(`/api/v1/grade-categories/${id}`, { method: 'DELETE' })
}

