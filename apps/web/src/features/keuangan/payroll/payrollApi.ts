import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/payroll'
import * as mock from '../../../lib/mockApi/client'
import type { ListPayrollSlipsParams } from '../../../lib/mockApi/client'
import type { PayrollStatus } from '../../../lib/mockApi/types'

export const payrollApi = {
  list: (params: ListPayrollSlipsParams) => (USE_MOCK ? mock.listPayrollSlips(params) : backend.listPayrollSlips(params)),
  upsert: (input: {
    id?: string
    periode: string
    pegawaiId: string
    gajiPokok: number
    tunjangan: number
    potongan: number
    status: PayrollStatus
  }) => (USE_MOCK ? mock.upsertPayrollSlip(input) : backend.upsertPayrollSlip(input)),
  markPaid: (id: string) => (USE_MOCK ? mock.markPayrollPaid(id) : backend.markPayrollPaid(id)),
}

