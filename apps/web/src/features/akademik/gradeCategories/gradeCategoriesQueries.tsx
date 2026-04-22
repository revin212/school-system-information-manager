import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gradeCategoriesApi } from './gradeCategoriesApi'
import type { GradeCategory } from '../../../lib/mockApi/types'

export const gradeCategoriesKeys = {
  all: ['gradeCategories'] as const,
  list: (params: { tahunAkademikId: string; kelasId: string; mapelId: string }) =>
    ['gradeCategories', 'list', params] as const,
}

export function useGradeCategoriesList(params: { tahunAkademikId: string; kelasId: string; mapelId: string }) {
  return useQuery({
    queryKey: gradeCategoriesKeys.list(params),
    queryFn: () => gradeCategoriesApi.list(params),
    enabled: !!params.tahunAkademikId && !!params.kelasId && !!params.mapelId,
  })
}

export function useCreateGradeCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: gradeCategoriesApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: gradeCategoriesKeys.all })
    },
  })
}

export function useUpdateGradeCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; patch: { nama: string; bobot: number; keterangan?: string } }) =>
      gradeCategoriesApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: gradeCategoriesKeys.all })
    },
  })
}

export function useDeleteGradeCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => gradeCategoriesApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: gradeCategoriesKeys.all })
    },
  })
}

export type { GradeCategory }

