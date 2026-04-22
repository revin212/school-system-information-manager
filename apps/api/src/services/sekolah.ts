import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { schoolIdentity } from '../db/schema'
import { AppError } from '../http/errors'

export type SchoolLevel = 'sd' | 'smp' | 'sma'
export type SchoolIdentityDto = {
  id: string
  namaSekolah: string
  npsn: string
  jenjang: SchoolLevel
  alamat: string
  provinsi: string
  kota: string
  email: string
  telepon: string
  logoDataUrl?: string
  statusAktif: boolean
  terverifikasi: boolean
  dibuatPada: string
  diubahPada: string
}

function toDto(row: typeof schoolIdentity.$inferSelect): SchoolIdentityDto {
  return {
    id: row.id,
    namaSekolah: row.namaSekolah,
    npsn: row.npsn,
    jenjang: row.jenjang as SchoolLevel,
    alamat: row.alamat,
    provinsi: row.provinsi,
    kota: row.kota,
    email: row.email,
    telepon: row.telepon,
    logoDataUrl: row.logoDataUrl ?? undefined,
    statusAktif: row.statusAktif,
    terverifikasi: row.terverifikasi,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

export async function getSchoolIdentity(): Promise<SchoolIdentityDto> {
  const rows = await db.select().from(schoolIdentity).limit(1)
  if (!rows.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  return toDto(rows[0])
}

export async function updateSchoolIdentity(
  patch: Partial<
    Pick<
      SchoolIdentityDto,
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
): Promise<SchoolIdentityDto> {
  const currentRows = await db.select().from(schoolIdentity).limit(1)
  if (!currentRows.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const cur = currentRows[0]

  const nextNama = (patch.namaSekolah ?? cur.namaSekolah).trim()
  const nextNpsn = (patch.npsn ?? cur.npsn).trim()
  const nextJenjang = (patch.jenjang ?? (cur.jenjang as SchoolLevel)) as SchoolLevel
  const nextAlamat = (patch.alamat ?? cur.alamat).trim()
  const nextProv = (patch.provinsi ?? cur.provinsi).trim()
  const nextKota = (patch.kota ?? cur.kota).trim()
  const nextEmail = (patch.email ?? cur.email).trim()
  const nextTelp = (patch.telepon ?? cur.telepon).trim()

  if (!nextNama) throw new AppError({ message: 'Nama sekolah wajib diisi.' })
  if (!nextNpsn) throw new AppError({ message: 'NPSN wajib diisi.' })
  if (!nextAlamat) throw new AppError({ message: 'Alamat wajib diisi.' })
  if (!nextProv) throw new AppError({ message: 'Provinsi wajib diisi.' })
  if (!nextKota) throw new AppError({ message: 'Kota/Kabupaten wajib diisi.' })
  if (!nextEmail) throw new AppError({ message: 'Email wajib diisi.' })
  if (!nextTelp) throw new AppError({ message: 'Nomor telepon wajib diisi.' })

  const [row] = await db
    .update(schoolIdentity)
    .set({
      namaSekolah: nextNama,
      npsn: nextNpsn,
      jenjang: nextJenjang,
      alamat: nextAlamat,
      provinsi: nextProv,
      kota: nextKota,
      email: nextEmail,
      telepon: nextTelp,
      logoDataUrl: patch.logoDataUrl === undefined ? cur.logoDataUrl : patch.logoDataUrl,
      statusAktif: patch.statusAktif ?? cur.statusAktif,
      terverifikasi: patch.terverifikasi ?? cur.terverifikasi,
      diubahPada: new Date(),
    })
    .where(eq(schoolIdentity.id, cur.id))
    .returning()

  return toDto(row)
}

