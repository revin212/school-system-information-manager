import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/subjects'
import * as mock from '../../../lib/mockApi/client'
import type { ListSubjectsParams } from '../../../lib/mockApi/client'

export const subjectsApi = {
  list: (params: ListSubjectsParams) => (USE_MOCK ? mock.listSubjects(params) : backend.listSubjects(params)),
  create: (input: { kode: string; nama: string; status: 'aktif' | 'nonaktif' }) =>
    (USE_MOCK ? mock.createSubject(input) : backend.createSubject(input)),
  update: (id: string, patch: { kode: string; nama: string; status: 'aktif' | 'nonaktif' }) =>
    (USE_MOCK ? mock.updateSubject(id, patch) : backend.updateSubject(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteSubject(id) : backend.deleteSubject(id)),
}

