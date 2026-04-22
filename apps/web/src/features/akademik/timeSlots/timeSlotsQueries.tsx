import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { timeSlotsApi } from './timeSlotsApi'
import type { TeachingSlot, Weekday } from '../../../lib/mockApi/types'

export const timeSlotsKeys = {
  all: ['teachingSlots'] as const,
  list: (params: { guruId: string; hari: '' | Weekday }) => ['teachingSlots', 'list', params] as const,
}

export function useTimeSlotsList(params: { guruId: string; hari: '' | Weekday }) {
  return useQuery({
    queryKey: timeSlotsKeys.list(params),
    queryFn: () => timeSlotsApi.list(params),
  })
}

export function useCreateTimeSlot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: timeSlotsApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: timeSlotsKeys.all })
    },
  })
}

export function useUpdateTimeSlot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      id: string
      patch: {
        guruId: string
        hari: Weekday
        mulai: string
        selesai: string
        keterangan: string
      }
    }) => timeSlotsApi.update(vars.id, vars.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: timeSlotsKeys.all })
    },
  })
}

export function useDeleteTimeSlot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => timeSlotsApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: timeSlotsKeys.all })
    },
  })
}

export type { TeachingSlot }

