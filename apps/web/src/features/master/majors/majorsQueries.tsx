import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { majorsApi } from './majorsApi'
import type { Major, MajorStatus } from '../../../lib/mockApi/types'

export const majorsKeys = {
  all: ['majors'] as const,
  list: (params: { q: string; status: '' | MajorStatus }) => ['majors', 'list', params] as const,
}

export function useMajorsList(params: { q: string; status: '' | MajorStatus }) {
  return useQuery({
    queryKey: majorsKeys.list(params),
    queryFn: () => majorsApi.list(params),
  })
}

export function useCreateMajor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: majorsApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: majorsKeys.all })
    },
  })
}

export function useUpdateMajor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; patch: { kode: string; nama: string; status: 'aktif' | 'nonaktif' } }) =>
      majorsApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: majorsKeys.all })
    },
  })
}

export function useDeleteMajor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => majorsApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: majorsKeys.all })
    },
  })
}

export type { Major }

