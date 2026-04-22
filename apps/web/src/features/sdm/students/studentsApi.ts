import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/students'
import * as mock from '../../../lib/mockApi/client'
import type { ListStudentsParams } from '../../../lib/mockApi/client'

export const studentsApi = {
  list: (params: ListStudentsParams) => (USE_MOCK ? mock.listStudents(params) : backend.listStudents(params)),
  create: (input: {
    nis: string
    nama: string
    kelasId?: string
    jurusanId?: string
    noHp?: string
    status: 'aktif' | 'cuti' | 'nonaktif'
  }) => (USE_MOCK ? mock.createStudent(input) : backend.createStudent(input)),
  update: (
    id: string,
    patch: {
      nis: string
      nama: string
      kelasId?: string
      jurusanId?: string
      noHp?: string
      status: 'aktif' | 'cuti' | 'nonaktif'
    },
  ) => (USE_MOCK ? mock.updateStudent(id, patch) : backend.updateStudent(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteStudent(id) : backend.deleteStudent(id)),
}

