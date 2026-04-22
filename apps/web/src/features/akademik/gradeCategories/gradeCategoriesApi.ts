import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/gradeCategories'
import * as mock from '../../../lib/mockApi/client'
import type { ListGradeCategoriesParams } from '../../../lib/mockApi/client'
import type { GradeCategory } from '../../../lib/mockApi/types'

type GradeCategoryInput = Omit<GradeCategory, 'id' | 'dibuatPada' | 'diubahPada'>

export const gradeCategoriesApi = {
  list: (params: ListGradeCategoriesParams) =>
    USE_MOCK ? mock.listGradeCategories(params) : backend.listGradeCategories(params),
  create: (input: GradeCategoryInput) => (USE_MOCK ? mock.createGradeCategory(input) : backend.createGradeCategory(input)),
  update: (
    id: string,
    patch: { nama: string; bobot: number; keterangan?: string },
  ) => (USE_MOCK ? mock.updateGradeCategory(id, patch) : backend.updateGradeCategory(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteGradeCategory(id) : backend.deleteGradeCategory(id)),
}

