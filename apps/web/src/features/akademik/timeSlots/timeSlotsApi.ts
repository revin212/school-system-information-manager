import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/teachingSlots'
import * as mock from '../../../lib/mockApi/client'
import type { ListTeachingSlotsParams } from '../../../lib/mockApi/client'

export const timeSlotsApi = {
  list: (params: ListTeachingSlotsParams) => (USE_MOCK ? mock.listTeachingSlots(params) : backend.listTeachingSlots(params)),
  create: (input: {
    guruId: string
    hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'
    mulai: string
    selesai: string
    keterangan: string
  }) => (USE_MOCK ? mock.createTeachingSlot(input) : backend.createTeachingSlot(input)),
  update: (
    id: string,
    patch: {
      guruId: string
      hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'
      mulai: string
      selesai: string
      keterangan: string
    },
  ) => (USE_MOCK ? mock.updateTeachingSlot(id, patch) : backend.updateTeachingSlot(id, patch)),
  remove: (id: string) => (USE_MOCK ? mock.deleteTeachingSlot(id) : backend.deleteTeachingSlot(id)),
}

