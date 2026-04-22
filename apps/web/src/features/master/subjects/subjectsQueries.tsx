import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subjectsApi } from './subjectsApi'
import type { Subject, SubjectStatus } from '../../../lib/mockApi/types'

export const subjectsKeys = {
  all: ['subjects'] as const,
  list: (params: { q: string; status: '' | SubjectStatus }) => ['subjects', 'list', params] as const,
}

export function useSubjectsList(params: { q: string; status: '' | SubjectStatus }) {
  return useQuery({
    queryKey: subjectsKeys.list(params),
    queryFn: () => subjectsApi.list(params),
  })
}

export function useCreateSubject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: subjectsKeys.all })
    },
  })
}

export function useUpdateSubject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; patch: { kode: string; nama: string; status: 'aktif' | 'nonaktif' } }) =>
      subjectsApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: subjectsKeys.all })
    },
  })
}

export function useDeleteSubject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subjectsApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: subjectsKeys.all })
    },
  })
}

export type { Subject }

