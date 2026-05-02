import type { AdministrativeSchedule } from '../mockApi/types'
import { apiFetch } from './http'

export type ListAdministrativeSchedulesParams = {
  tanggal?: string
  dari?: string
  sampai?: string
}

export async function listAdministrativeSchedules(
  params: ListAdministrativeSchedulesParams,
): Promise<AdministrativeSchedule[]> {
  return apiFetch('/api/v1/administrative-schedules', {
    method: 'GET',
    query: {
      tanggal: params.tanggal ?? '',
      dari: params.dari ?? '',
      sampai: params.sampai ?? '',
    },
  })
}

export async function createAdministrativeSchedule(input: {
  tanggal: string
  jam: string
  judul: string
  lokasi: string
}): Promise<AdministrativeSchedule> {
  return apiFetch('/api/v1/administrative-schedules', { method: 'POST', body: input })
}

export async function updateAdministrativeSchedule(
  id: string,
  patch: Partial<{ tanggal: string; jam: string; judul: string; lokasi: string }>,
): Promise<AdministrativeSchedule> {
  return apiFetch(`/api/v1/administrative-schedules/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteAdministrativeSchedule(id: string): Promise<void> {
  await apiFetch(`/api/v1/administrative-schedules/${id}`, { method: 'DELETE' })
}
