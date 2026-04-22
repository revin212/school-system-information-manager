import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { schedulesApi } from './schedulesApi'
import type { ScheduleItem } from '../../../lib/mockApi/types'

export const schedulesKeys = {
  all: ['schedules'] as const,
  list: (params: { tahunAkademikId: string; kelasId: string }) => ['schedules', 'list', params] as const,
}

export function useSchedulesList(params: { tahunAkademikId: string; kelasId: string }) {
  return useQuery({
    queryKey: schedulesKeys.list(params),
    queryFn: () => schedulesApi.list(params),
    enabled: !!params.tahunAkademikId && !!params.kelasId,
  })
}

export function useCreateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: schedulesApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: schedulesKeys.all })
    },
  })
}

export function useUpdateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      id: string
      patch: {
        tahunAkademikId: string
        kelasId: string
        hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'
        mulai: string
        selesai: string
        mapelId: string
        guruId: string
        ruang: string
        status: 'aktif' | 'bentrok'
      }
    }) => schedulesApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: schedulesKeys.all })
    },
  })
}

export function useDeleteSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => schedulesApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: schedulesKeys.all })
    },
  })
}

export type { ScheduleItem }

