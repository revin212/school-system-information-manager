import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { classesApi } from './classesApi'
import type { ClassLevel, ClassStatus, SchoolClass } from '../../../lib/mockApi/types'

export const classesKeys = {
  all: ['classes'] as const,
  list: (params: { q: string; status: '' | ClassStatus; tingkat: '' | ClassLevel }) =>
    ['classes', 'list', params] as const,
}

export function useClassesList(params: { q: string; status: '' | ClassStatus; tingkat: '' | ClassLevel }) {
  return useQuery({
    queryKey: classesKeys.list(params),
    queryFn: () => classesApi.list(params),
  })
}

export function useCreateClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: classesApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: classesKeys.all })
    },
  })
}

export function useUpdateClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      id: string
      patch: { nama: string; tingkat: 'X' | 'XI' | 'XII'; jurusanId?: string; status: 'aktif' | 'nonaktif' }
    }) => classesApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: classesKeys.all })
    },
  })
}

export function useDeleteClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => classesApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: classesKeys.all })
    },
  })
}

export type { SchoolClass }

