import type { GradeCategory, GradeEntry, GradebookStatus } from '../mockApi/types'
import { apiFetch } from './http'

export type GetGradebookParams = {
  tahunAkademikId: string
  kelasId: string
  mapelId: string
}

export async function getGradebook(params: GetGradebookParams): Promise<{ categories: GradeCategory[]; entries: GradeEntry[] }> {
  return apiFetch('/api/v1/gradebook', {
    method: 'GET',
    query: {
      tahunAkademikId: params.tahunAkademikId,
      kelasId: params.kelasId,
      mapelId: params.mapelId,
    },
  })
}

export async function upsertGradeScore(input: {
  tahunAkademikId: string
  kelasId: string
  mapelId: string
  siswaId: string
  categoryId: string
  score: number | null
}): Promise<GradeEntry> {
  return apiFetch('/api/v1/gradebook/score', { method: 'POST', body: input })
}

export async function setGradebookStatus(params: GetGradebookParams & { status: GradebookStatus }): Promise<void> {
  await apiFetch('/api/v1/gradebook/status', { method: 'POST', body: params })
}

