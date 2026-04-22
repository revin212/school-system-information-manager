import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from './studentsApi'
import type { Student, StudentStatus } from '../../../lib/mockApi/types'

export const studentsKeys = {
  all: ['students'] as const,
  list: (params: { q: string; kelasId: string; jurusanId: string; status: '' | StudentStatus }) =>
    ['students', 'list', params] as const,
}

export function useStudentsList(params: { q: string; kelasId: string; jurusanId: string; status: '' | StudentStatus }) {
  return useQuery({
    queryKey: studentsKeys.list(params),
    queryFn: () => studentsApi.list(params),
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: studentsApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: studentsKeys.all })
    },
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      id: string
      patch: { nis: string; nama: string; kelasId?: string; jurusanId?: string; noHp?: string; status: 'aktif' | 'cuti' | 'nonaktif' }
    }) => studentsApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: studentsKeys.all })
    },
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => studentsApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: studentsKeys.all })
    },
  })
}

export type { Student }

