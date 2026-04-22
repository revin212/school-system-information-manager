import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gradesApi } from './gradesApi'
import type { GradeCategory, GradeEntry } from '../../../lib/mockApi/types'

export const gradebookKeys = {
  all: ['gradebook'] as const,
  get: (params: { tahunAkademikId: string; kelasId: string; mapelId: string }) =>
    ['gradebook', 'get', params] as const,
}

export function useGradebook(params: { tahunAkademikId: string; kelasId: string; mapelId: string }) {
  return useQuery({
    queryKey: gradebookKeys.get(params),
    queryFn: () => gradesApi.get(params),
    enabled: !!params.tahunAkademikId && !!params.kelasId && !!params.mapelId,
  })
}

export function useUpsertScore() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: gradesApi.upsertScore,
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({
        queryKey: gradebookKeys.get({
          tahunAkademikId: vars.tahunAkademikId,
          kelasId: vars.kelasId,
          mapelId: vars.mapelId,
        }),
      })
    },
  })
}

export function useSetGradebookStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: gradesApi.setStatus,
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({
        queryKey: gradebookKeys.get({
          tahunAkademikId: vars.tahunAkademikId,
          kelasId: vars.kelasId,
          mapelId: vars.mapelId,
        }),
      })
    },
  })
}

export type { GradeCategory, GradeEntry }

