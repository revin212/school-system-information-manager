import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/classes'
import * as mock from '../../../lib/mockApi/client'
import type { ListClassesParams } from '../../../lib/mockApi/client'

export const classesApi = {
  list: (params: ListClassesParams) => (USE_MOCK ? mock.listClasses(params) : backend.listClasses(params)),
  create: (input: {
    nama: string
    tingkat: 'X' | 'XI' | 'XII'
    jurusanId?: string
    status: 'aktif' | 'nonaktif'
  }) => (USE_MOCK ? mock.createClass(input) : backend.createClass(input)),
  update: (
    id: string,
    patch: {
      nama: string
      tingkat: 'X' | 'XI' | 'XII'
      jurusanId?: string
      status: 'aktif' | 'nonaktif'
    },
  ) => (USE_MOCK ? mock.updateClass(id, patch) : backend.updateClass(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteClass(id) : backend.deleteClass(id)),
}

