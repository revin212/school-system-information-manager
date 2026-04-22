import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/employees'
import * as mock from '../../../lib/mockApi/client'
import type { ListEmployeesParams } from '../../../lib/mockApi/client'

export const employeesApi = {
  list: (params: ListEmployeesParams) => (USE_MOCK ? mock.listEmployees(params) : backend.listEmployees(params)),
  create: (input: {
    nip: string
    nama: string
    tipe: 'guru' | 'karyawan'
    noHp: string
    email?: string
    status: 'aktif' | 'cuti' | 'nonaktif'
  }) => (USE_MOCK ? mock.createEmployee(input) : backend.createEmployee(input)),
  update: (
    id: string,
    patch: {
      nip: string
      nama: string
      tipe: 'guru' | 'karyawan'
      noHp: string
      email?: string
      status: 'aktif' | 'cuti' | 'nonaktif'
    },
  ) => (USE_MOCK ? mock.updateEmployee(id, patch) : backend.updateEmployee(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteEmployee(id) : backend.deleteEmployee(id)),
}

