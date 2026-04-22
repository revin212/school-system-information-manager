import type { SchoolIdentity } from '../mockApi/types'
import { apiFetch } from './http'

export async function getSchoolIdentity(): Promise<SchoolIdentity> {
  return apiFetch('/api/v1/school-identity', { method: 'GET' })
}

export async function updateSchoolIdentity(
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
  >,
): Promise<SchoolIdentity> {
  return apiFetch('/api/v1/school-identity', { method: 'PATCH', body: patch })
}

