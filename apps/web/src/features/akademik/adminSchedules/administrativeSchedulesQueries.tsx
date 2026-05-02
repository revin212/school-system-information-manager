import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { administrativeSchedulesApi } from './administrativeSchedulesApi'
import type { AdministrativeSchedule } from '../../../lib/mockApi/types'
import { localDateString } from '../../../lib/dateLocal'

export const administrativeSchedulesKeys = {
  all: ['administrativeSchedules'] as const,
  list: (params: { tanggal?: string; dari?: string; sampai?: string }) =>
    ['administrativeSchedules', 'list', params] as const,
}

export function useAdministrativeSchedulesList(params: {
  tanggal?: string
  dari?: string
  sampai?: string
}) {
  return useQuery({
    queryKey: administrativeSchedulesKeys.list(params),
    queryFn: () => administrativeSchedulesApi.list(params),
  })
}

/** Jadwal untuk hari ini (tanggal lokal browser). */
export function useTodayAdministrativeSchedules() {
  const tanggal = localDateString()
  return useAdministrativeSchedulesList({ tanggal })
}

export function useCreateAdministrativeSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: administrativeSchedulesApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: administrativeSchedulesKeys.all })
    },
  })
}

export function useUpdateAdministrativeSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      id: string
      patch: Partial<{ tanggal: string; jam: string; judul: string; lokasi: string }>
    }) => administrativeSchedulesApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: administrativeSchedulesKeys.all })
    },
  })
}

export function useDeleteAdministrativeSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: administrativeSchedulesApi.remove,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: administrativeSchedulesKeys.all })
    },
  })
}

export type { AdministrativeSchedule }
