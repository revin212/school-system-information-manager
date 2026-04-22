import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/gradebook'
import * as mock from '../../../lib/mockApi/client'
import type { GetGradebookParams } from '../../../lib/mockApi/client'

export const gradesApi = {
  get: (params: GetGradebookParams) => (USE_MOCK ? mock.getGradebook(params) : backend.getGradebook(params)),
  upsertScore: (input: {
    tahunAkademikId: string
    kelasId: string
    mapelId: string
    siswaId: string
    categoryId: string
    score: number | null
  }) => (USE_MOCK ? mock.upsertGradeScore(input) : backend.upsertGradeScore(input)),
  setStatus: (params: GetGradebookParams & { status: 'draft' | 'published' }) =>
    USE_MOCK ? mock.setGradebookStatus(params) : backend.setGradebookStatus(params),
}

