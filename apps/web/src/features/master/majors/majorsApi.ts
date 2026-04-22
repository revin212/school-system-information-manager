import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/majors'
import * as mock from '../../../lib/mockApi/client'
import type { ListMajorsParams } from '../../../lib/mockApi/client'

export const majorsApi = {
  list: (params: ListMajorsParams) => (USE_MOCK ? mock.listMajors(params) : backend.listMajors(params)),
  create: (input: { kode: string; nama: string; status: 'aktif' | 'nonaktif' }) =>
    (USE_MOCK ? mock.createMajor(input) : backend.createMajor(input)),
  update: (id: string, patch: { kode: string; nama: string; status: 'aktif' | 'nonaktif' }) =>
    (USE_MOCK ? mock.updateMajor(id, patch) : backend.updateMajor(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteMajor(id) : backend.deleteMajor(id)),
}

