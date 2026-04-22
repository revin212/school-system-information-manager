import type { ScheduleItem, Weekday } from '../mockApi/types'
import { apiFetch } from './http'

export type ListSchedulesParams = {
  tahunAkademikId?: string | ''
  kelasId?: string | ''
}

export async function listSchedules(params: ListSchedulesParams): Promise<ScheduleItem[]> {
  return apiFetch('/api/v1/schedules', {
    method: 'GET',
    query: {
      tahunAkademikId: params.tahunAkademikId ?? '',
      kelasId: params.kelasId ?? '',
    },
  })
}

export async function createSchedule(input: Omit<ScheduleItem, 'id' | 'dibuatPada' | 'diubahPada'>): Promise<ScheduleItem> {
  return apiFetch('/api/v1/schedules', { method: 'POST', body: input })
}

export async function updateSchedule(
  id: string,
  patch: Partial<Omit<ScheduleItem, 'id' | 'dibuatPada' | 'diubahPada'>>,
): Promise<ScheduleItem> {
  return apiFetch(`/api/v1/schedules/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteSchedule(id: string): Promise<void> {
  await apiFetch(`/api/v1/schedules/${id}`, { method: 'DELETE' })
}

export type { Weekday }

