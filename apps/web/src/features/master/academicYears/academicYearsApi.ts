import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/academicYears'
import * as mock from '../../../lib/mockApi/client'
import type { ListAcademicYearsParams } from '../../../lib/mockApi/client'

export const academicYearsApi = {
  list: (params: ListAcademicYearsParams) => (USE_MOCK ? mock.listAcademicYears(params) : backend.listAcademicYears(params)),
  create: (input: { nama: string; status: 'aktif' | 'nonaktif' }) =>
    (USE_MOCK ? mock.createAcademicYear(input) : backend.createAcademicYear(input)),
  update: (id: string, patch: { nama: string; status: 'aktif' | 'nonaktif' }) =>
    (USE_MOCK ? mock.updateAcademicYear(id, patch) : backend.updateAcademicYear(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteAcademicYear(id) : backend.deleteAcademicYear(id)),
}

