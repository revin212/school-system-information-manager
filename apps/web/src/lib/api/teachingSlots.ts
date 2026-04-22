import type { TeachingSlot, Weekday } from '../mockApi/types'
import { apiFetch } from './http'

export type ListTeachingSlotsParams = {
  guruId?: string | ''
  hari?: Weekday | ''
}

export async function listTeachingSlots(params: ListTeachingSlotsParams): Promise<TeachingSlot[]> {
  return apiFetch('/api/v1/teaching-slots', {
    method: 'GET',
    query: { guruId: params.guruId ?? '', hari: params.hari ?? '' },
  })
}

export async function createTeachingSlot(input: {
  guruId: string
  hari: Weekday
  mulai: string
  selesai: string
  keterangan: string
}): Promise<TeachingSlot> {
  return apiFetch('/api/v1/teaching-slots', { method: 'POST', body: input })
}

export async function updateTeachingSlot(
  id: string,
  patch: Partial<Pick<TeachingSlot, 'guruId' | 'hari' | 'mulai' | 'selesai' | 'keterangan'>>,
): Promise<TeachingSlot> {
  return apiFetch(`/api/v1/teaching-slots/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteTeachingSlot(id: string): Promise<void> {
  await apiFetch(`/api/v1/teaching-slots/${id}`, { method: 'DELETE' })
}

