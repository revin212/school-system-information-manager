import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/schoolIdentity'
import * as mock from '../../../lib/mockApi/client'
import type { SchoolIdentity, SchoolLevel } from '../../../lib/mockApi/types'

export const schoolIdentityApi = {
  get: () => (USE_MOCK ? mock.getSchoolIdentity() : backend.getSchoolIdentity()),
  update: (
    patch: Partial<
      Pick<
        SchoolIdentity,
        | 'namaSekolah'
        | 'npsn'
        | 'jenjang'
        | 'alamat'
        | 'provinsi'
        | 'kota'
        | 'email'
        | 'telepon'
        | 'logoDataUrl'
        | 'statusAktif'
        | 'terverifikasi'
      >
    > & { jenjang?: SchoolLevel },
  ) => (USE_MOCK ? mock.updateSchoolIdentity(patch) : backend.updateSchoolIdentity(patch)),
}

