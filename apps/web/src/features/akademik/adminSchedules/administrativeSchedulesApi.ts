import { USE_MOCK } from '../../../lib/api/config'
import type { ListAdministrativeSchedulesParams } from '../../../lib/api/administrativeSchedules'
import * as backend from '../../../lib/api/administrativeSchedules'
import * as mock from '../../../lib/mockApi/client'

export const administrativeSchedulesApi = {
  list: (params: ListAdministrativeSchedulesParams) =>
    USE_MOCK ? mock.listAdministrativeSchedules(params) : backend.listAdministrativeSchedules(params),
  create: (input: { tanggal: string; jam: string; judul: string; lokasi: string }) =>
    USE_MOCK ? mock.createAdministrativeSchedule(input) : backend.createAdministrativeSchedule(input),
  update: (
    id: string,
    patch: Partial<{ tanggal: string; jam: string; judul: string; lokasi: string }>,
  ) => (USE_MOCK ? mock.updateAdministrativeSchedule(id, patch) : backend.updateAdministrativeSchedule(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteAdministrativeSchedule(id) : backend.deleteAdministrativeSchedule(id)),
}
