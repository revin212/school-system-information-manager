import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { academicYearsApi } from './academicYearsApi'
import type { AcademicYear, AcademicYearStatus } from '../../../lib/mockApi/types'

export const academicYearsKeys = {
  all: ['academicYears'] as const,
  list: (params: { q: string; status: '' | AcademicYearStatus }) =>
    ['academicYears', 'list', params] as const,
}

export function useAcademicYearsList(params: { q: string; status: '' | AcademicYearStatus }) {
  return useQuery({
    queryKey: academicYearsKeys.list(params),
    queryFn: () => academicYearsApi.list(params),
  })
}

export function useCreateAcademicYear() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: academicYearsApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: academicYearsKeys.all })
    },
  })
}

export function useUpdateAcademicYear() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; patch: { nama: string; status: 'aktif' | 'nonaktif' } }) =>
      academicYearsApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: academicYearsKeys.all })
    },
  })
}

export function useDeleteAcademicYear() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => academicYearsApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: academicYearsKeys.all })
    },
  })
}

export type { AcademicYear }

