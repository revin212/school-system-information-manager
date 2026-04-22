import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PayrollStatus } from '../../../lib/mockApi/types'
import { payrollApi } from './payrollApi'

export const payrollKeys = {
  all: ['keuangan', 'payroll'] as const,
  list: (params: { q: string; periode: string; status: '' | PayrollStatus }) =>
    ['keuangan', 'payroll', 'list', params] as const,
}

export function usePayrollList(params: { q: string; periode: string; status: '' | PayrollStatus }) {
  return useQuery({
    queryKey: payrollKeys.list(params),
    queryFn: () => payrollApi.list(params),
  })
}

export function useUpsertPayroll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: payrollApi.upsert,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: payrollKeys.all })
    },
  })
}

export function useMarkPayrollPaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => payrollApi.markPaid(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: payrollKeys.all })
    },
  })
}

