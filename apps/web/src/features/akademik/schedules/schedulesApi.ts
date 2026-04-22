import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/schedules'
import * as mock from '../../../lib/mockApi/client'
import type { ListSchedulesParams } from '../../../lib/mockApi/client'
import type { ScheduleItem } from '../../../lib/mockApi/types'

type ScheduleInput = Omit<ScheduleItem, 'id' | 'dibuatPada' | 'diubahPada'>

export const schedulesApi = {
  list: (params: ListSchedulesParams) => (USE_MOCK ? mock.listSchedules(params) : backend.listSchedules(params)),
  create: (input: ScheduleInput) => (USE_MOCK ? mock.createSchedule(input) : backend.createSchedule(input)),
  update: (id: string, patch: Partial<ScheduleInput>) =>
    USE_MOCK ? mock.updateSchedule(id, patch) : backend.updateSchedule(id, patch),
  remove: (id: string) => (USE_MOCK ? mock.deleteSchedule(id) : backend.deleteSchedule(id)),
}

