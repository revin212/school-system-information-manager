import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from './employeesApi'
import type { Employee, EmployeeStatus, EmployeeType } from '../../../lib/mockApi/types'

export const employeesKeys = {
  all: ['employees'] as const,
  list: (params: { q: string; tipe: '' | EmployeeType; status: '' | EmployeeStatus }) =>
    ['employees', 'list', params] as const,
}

export function useEmployeesList(params: { q: string; tipe: '' | EmployeeType; status: '' | EmployeeStatus }) {
  return useQuery({
    queryKey: employeesKeys.list(params),
    queryFn: () => employeesApi.list(params),
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: employeesApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: employeesKeys.all })
    },
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      id: string
      patch: {
        nip: string
        nama: string
        tipe: 'guru' | 'karyawan'
        noHp: string
        email?: string
        status: 'aktif' | 'cuti' | 'nonaktif'
      }
    }) => employeesApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: employeesKeys.all })
    },
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => employeesApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: employeesKeys.all })
    },
  })
}

export type { Employee }

