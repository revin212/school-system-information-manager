import { and, eq, ilike, or, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '../db/client'
import { academicYears, classes, majors } from '../db/schema'
import { AppError } from '../http/errors'

export type ActiveStatus = 'aktif' | 'nonaktif'
export type ClassLevel = 'X' | 'XI' | 'XII'

export type MajorDto = { id: string; kode: string; nama: string; status: ActiveStatus; dibuatPada: string; diubahPada: string }
export type ClassDto = {
  id: string
  nama: string
  tingkat: ClassLevel
  jurusanId?: string
  status: ActiveStatus
  dibuatPada: string
  diubahPada: string
}
export type AcademicYearDto = { id: string; nama: string; status: ActiveStatus; dibuatPada: string; diubahPada: string }

function majorDto(row: typeof majors.$inferSelect): MajorDto {
  return {
    id: row.id,
    kode: row.kode,
    nama: row.nama,
    status: row.status as ActiveStatus,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

function classDto(row: typeof classes.$inferSelect): ClassDto {
  return {
    id: row.id,
    nama: row.nama,
    tingkat: row.tingkat as ClassLevel,
    jurusanId: row.jurusanId ?? undefined,
    status: row.status as ActiveStatus,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

function yearDto(row: typeof academicYears.$inferSelect): AcademicYearDto {
  return {
    id: row.id,
    nama: row.nama,
    status: row.status as ActiveStatus,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

// =========================
// Majors
// =========================

export async function listMajors(params: { q?: string; status?: ActiveStatus | '' }): Promise<MajorDto[]> {
  const q = (params.q ?? '').trim()
  const status = (params.status ?? '') as ActiveStatus | ''
  const whereParts = []
  if (status) whereParts.push(eq(majors.status, status))
  if (q) whereParts.push(or(ilike(majors.kode, `%${q}%`), ilike(majors.nama, `%${q}%`)))
  const rows = await db
    .select()
    .from(majors)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(majors.kode)
  return rows.map(majorDto)
}

export async function createMajor(input: { kode: string; nama: string; status: ActiveStatus }): Promise<MajorDto> {
  const kode = input.kode.trim()
  const nama = input.nama.trim()
  if (!kode || !nama) throw new AppError({ message: 'Kode dan nama jurusan wajib diisi.' })
  const dup = await db.select({ id: majors.id }).from(majors).where(sql`lower(${majors.kode}) = lower(${kode})`).limit(1)
  if (dup.length) throw new AppError({ message: 'Kode jurusan sudah digunakan.' })
  const now = new Date()
  const [row] = await db
    .insert(majors)
    .values({ id: randomUUID(), kode, nama, status: input.status, dibuatPada: now, diubahPada: now })
    .returning()
  return majorDto(row)
}

export async function updateMajor(
  id: string,
  patch: Partial<{ kode: string; nama: string; status: ActiveStatus }>,
): Promise<MajorDto> {
  const cur = await db.select().from(majors).where(eq(majors.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const nextKode = (patch.kode ?? cur[0].kode).trim()
  const nextNama = (patch.nama ?? cur[0].nama).trim()
  const nextStatus = (patch.status ?? (cur[0].status as ActiveStatus)) as ActiveStatus
  if (!nextKode || !nextNama) throw new AppError({ message: 'Kode dan nama jurusan wajib diisi.' })
  const dup = await db
    .select({ id: majors.id })
    .from(majors)
    .where(and(sql`lower(${majors.kode}) = lower(${nextKode})`, sql`${majors.id} <> ${id}`))
    .limit(1)
  if (dup.length) throw new AppError({ message: 'Kode jurusan sudah digunakan.' })
  const [row] = await db
    .update(majors)
    .set({ kode: nextKode, nama: nextNama, status: nextStatus, diubahPada: new Date() })
    .where(eq(majors.id, id))
    .returning()
  return majorDto(row)
}

export async function deleteMajor(id: string): Promise<void> {
  const inUse = await db.select({ id: classes.id }).from(classes).where(eq(classes.jurusanId, id)).limit(1)
  if (inUse.length) throw new AppError({ message: 'Jurusan masih digunakan oleh data kelas.' })
  await db.delete(majors).where(eq(majors.id, id))
}

// =========================
// Classes
// =========================

export async function listClasses(params: {
  q?: string
  status?: ActiveStatus | ''
  tingkat?: ClassLevel | ''
}): Promise<ClassDto[]> {
  const q = (params.q ?? '').trim()
  const status = (params.status ?? '') as ActiveStatus | ''
  const tingkat = (params.tingkat ?? '') as ClassLevel | ''
  const whereParts = []
  if (status) whereParts.push(eq(classes.status, status))
  if (tingkat) whereParts.push(eq(classes.tingkat, tingkat))
  if (q) whereParts.push(ilike(classes.nama, `%${q}%`))
  const rows = await db
    .select()
    .from(classes)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(classes.nama)
  return rows.map(classDto)
}

export async function createClass(input: {
  nama: string
  tingkat: ClassLevel
  jurusanId?: string
  status: ActiveStatus
}): Promise<ClassDto> {
  const nama = input.nama.trim()
  if (!nama) throw new AppError({ message: 'Nama kelas wajib diisi.' })
  const dup = await db.select({ id: classes.id }).from(classes).where(sql`lower(${classes.nama}) = lower(${nama})`).limit(1)
  if (dup.length) throw new AppError({ message: 'Nama kelas sudah digunakan.' })
  const now = new Date()
  const [row] = await db
    .insert(classes)
    .values({
      id: randomUUID(),
      nama,
      tingkat: input.tingkat,
      jurusanId: input.jurusanId ?? null,
      status: input.status,
      dibuatPada: now,
      diubahPada: now,
    })
    .returning()
  return classDto(row)
}

export async function updateClass(
  id: string,
  patch: Partial<{ nama: string; tingkat: ClassLevel; jurusanId?: string; status: ActiveStatus }>,
): Promise<ClassDto> {
  const cur = await db.select().from(classes).where(eq(classes.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const nextNama = (patch.nama ?? cur[0].nama).trim()
  if (!nextNama) throw new AppError({ message: 'Nama kelas wajib diisi.' })
  const dup = await db
    .select({ id: classes.id })
    .from(classes)
    .where(and(sql`lower(${classes.nama}) = lower(${nextNama})`, sql`${classes.id} <> ${id}`))
    .limit(1)
  if (dup.length) throw new AppError({ message: 'Nama kelas sudah digunakan.' })
  const [row] = await db
    .update(classes)
    .set({
      nama: nextNama,
      tingkat: (patch.tingkat ?? (cur[0].tingkat as ClassLevel)) as ClassLevel,
      jurusanId: patch.jurusanId ?? cur[0].jurusanId,
      status: (patch.status ?? (cur[0].status as ActiveStatus)) as ActiveStatus,
      diubahPada: new Date(),
    })
    .where(eq(classes.id, id))
    .returning()
  return classDto(row)
}

export async function deleteClass(id: string): Promise<void> {
  await db.delete(classes).where(eq(classes.id, id))
}

// =========================
// Academic Years
// =========================

export async function listAcademicYears(params: { q?: string; status?: ActiveStatus | '' }): Promise<AcademicYearDto[]> {
  const q = (params.q ?? '').trim()
  const status = (params.status ?? '') as ActiveStatus | ''
  const whereParts = []
  if (status) whereParts.push(eq(academicYears.status, status))
  if (q) whereParts.push(ilike(academicYears.nama, `%${q}%`))
  const rows = await db
    .select()
    .from(academicYears)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(sql`${academicYears.nama} desc`)
  return rows.map(yearDto)
}

export async function createAcademicYear(input: { nama: string; status: ActiveStatus }): Promise<AcademicYearDto> {
  const nama = input.nama.trim()
  if (!nama) throw new AppError({ message: 'Nama tahun akademik wajib diisi.' })
  const dup = await db.select({ id: academicYears.id }).from(academicYears).where(sql`lower(${academicYears.nama}) = lower(${nama})`).limit(1)
  if (dup.length) throw new AppError({ message: 'Tahun akademik sudah ada.' })
  const now = new Date()
  const [row] = await db.insert(academicYears).values({ id: randomUUID(), nama, status: input.status, dibuatPada: now, diubahPada: now }).returning()
  return yearDto(row)
}

export async function updateAcademicYear(
  id: string,
  patch: Partial<{ nama: string; status: ActiveStatus }>,
): Promise<AcademicYearDto> {
  const cur = await db.select().from(academicYears).where(eq(academicYears.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const nextNama = (patch.nama ?? cur[0].nama).trim()
  if (!nextNama) throw new AppError({ message: 'Nama tahun akademik wajib diisi.' })
  const dup = await db
    .select({ id: academicYears.id })
    .from(academicYears)
    .where(and(sql`lower(${academicYears.nama}) = lower(${nextNama})`, sql`${academicYears.id} <> ${id}`))
    .limit(1)
  if (dup.length) throw new AppError({ message: 'Tahun akademik sudah ada.' })
  const [row] = await db
    .update(academicYears)
    .set({ nama: nextNama, status: (patch.status ?? (cur[0].status as ActiveStatus)) as ActiveStatus, diubahPada: new Date() })
    .where(eq(academicYears.id, id))
    .returning()
  return yearDto(row)
}

export async function deleteAcademicYear(id: string): Promise<void> {
  await db.delete(academicYears).where(eq(academicYears.id, id))
}

