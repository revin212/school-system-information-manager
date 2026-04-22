import type { PayrollSlip, PayrollStatus } from '../mockApi/types'
import { apiFetch } from './http'

export type ListPayrollSlipsParams = {
  q?: string
  periode?: string | ''
  status?: PayrollStatus | ''
}

export async function listPayrollSlips(params: ListPayrollSlipsParams): Promise<PayrollSlip[]> {
  return apiFetch('/api/v1/payroll/slips', {
    method: 'GET',
    query: {
      q: params.q ?? '',
      periode: params.periode ?? '',
      status: params.status ?? '',
    },
  })
}

export async function upsertPayrollSlip(input: {
  id?: string
  periode: string
  pegawaiId: string
  gajiPokok: number
  tunjangan: number
  potongan: number
  status: PayrollStatus
}): Promise<PayrollSlip> {
  return apiFetch('/api/v1/payroll/slips', { method: 'POST', body: input })
}

export async function markPayrollPaid(id: string): Promise<PayrollSlip> {
  return apiFetch(`/api/v1/payroll/slips/${id}/mark-paid`, { method: 'POST', body: {} })
}

