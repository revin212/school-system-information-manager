import { and, eq, ilike, or, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '../db/client'
import { employees, students } from '../db/schema'
import { AppError } from '../http/errors'

export type EmployeeType = 'guru' | 'karyawan'
export type SdmStatus = 'aktif' | 'cuti' | 'nonaktif'

export type EmployeeDto = {
  id: string
  nip: string
  nama: string
  tipe: EmployeeType
  noHp: string
  email?: string
  status: SdmStatus
  dibuatPada: string
  diubahPada: string
}

export type StudentDto = {
  id: string
  nis: string
  nama: string
  kelasId?: string
  jurusanId?: string
  noHp?: string
  status: SdmStatus
  dibuatPada: string
  diubahPada: string
}

function empDto(row: typeof employees.$inferSelect): EmployeeDto {
  return {
    id: row.id,
    nip: row.nip,
    nama: row.nama,
    tipe: row.tipe as EmployeeType,
    noHp: row.noHp,
    email: row.email ?? undefined,
    status: row.status as SdmStatus,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

function stuDto(row: typeof students.$inferSelect): StudentDto {
  return {
    id: row.id,
    nis: row.nis,
    nama: row.nama,
    kelasId: row.kelasId ?? undefined,
    jurusanId: row.jurusanId ?? undefined,
    noHp: row.noHp ?? undefined,
    status: row.status as SdmStatus,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

// Employees
export async function listEmployees(params: { q?: string; tipe?: EmployeeType | ''; status?: SdmStatus | '' }): Promise<EmployeeDto[]> {
  const q = (params.q ?? '').trim()
  const tipe = (params.tipe ?? '') as EmployeeType | ''
  const status = (params.status ?? '') as SdmStatus | ''
  const whereParts = []
  if (tipe) whereParts.push(eq(employees.tipe, tipe))
  if (status) whereParts.push(eq(employees.status, status))
  if (q) whereParts.push(or(ilike(employees.nip, `%${q}%`), ilike(employees.nama, `%${q}%`)))

  const rows = await db
    .select()
    .from(employees)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(employees.nama)
  return rows.map(empDto)
}

export async function createEmployee(input: {
  nip: string
  nama: string
  tipe: EmployeeType
  noHp: string
  email?: string
  status: SdmStatus
}): Promise<EmployeeDto> {
  const nip = input.nip.trim()
  const nama = input.nama.trim()
  const noHp = input.noHp.trim()
  if (!nip || !nama) throw new AppError({ message: 'NIP dan nama wajib diisi.' })
  const dup = await db.select({ id: employees.id }).from(employees).where(eq(employees.nip, nip)).limit(1)
  if (dup.length) throw new AppError({ message: 'NIP sudah digunakan.' })
  const now = new Date()
  const [row] = await db
    .insert(employees)
    .values({
      id: randomUUID(),
      nip,
      nama,
      tipe: input.tipe,
      noHp,
      email: input.email?.trim() || null,
      status: input.status,
      dibuatPada: now,
      diubahPada: now,
    })
    .returning()
  return empDto(row)
}

export async function updateEmployee(
  id: string,
  patch: Partial<{ nip: string; nama: string; tipe: EmployeeType; noHp: string; email?: string; status: SdmStatus }>,
): Promise<EmployeeDto> {
  const cur = await db.select().from(employees).where(eq(employees.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const nextNip = (patch.nip ?? cur[0].nip).trim()
  const nextNama = (patch.nama ?? cur[0].nama).trim()
  const nextNoHp = (patch.noHp ?? cur[0].noHp).trim()
  if (!nextNip || !nextNama) throw new AppError({ message: 'NIP dan nama wajib diisi.' })
  const dup = await db
    .select({ id: employees.id })
    .from(employees)
    .where(and(eq(employees.nip, nextNip), sql`${employees.id} <> ${id}`))
    .limit(1)
  if (dup.length) throw new AppError({ message: 'NIP sudah digunakan.' })
  const [row] = await db
    .update(employees)
    .set({
      nip: nextNip,
      nama: nextNama,
      tipe: (patch.tipe ?? (cur[0].tipe as EmployeeType)) as EmployeeType,
      noHp: nextNoHp,
      email: (patch.email ?? cur[0].email)?.trim() || null,
      status: (patch.status ?? (cur[0].status as SdmStatus)) as SdmStatus,
      diubahPada: new Date(),
    })
    .where(eq(employees.id, id))
    .returning()
  return empDto(row)
}

export async function deleteEmployee(id: string): Promise<void> {
  await db.delete(employees).where(eq(employees.id, id))
}

// Students
export async function listStudents(params: {
  q?: string
  kelasId?: string | ''
  jurusanId?: string | ''
  status?: SdmStatus | ''
}): Promise<StudentDto[]> {
  const q = (params.q ?? '').trim()
  const kelasId = (params.kelasId ?? '').trim()
  const jurusanId = (params.jurusanId ?? '').trim()
  const status = (params.status ?? '') as SdmStatus | ''
  const whereParts = []
  if (kelasId) whereParts.push(eq(students.kelasId, kelasId))
  if (jurusanId) whereParts.push(eq(students.jurusanId, jurusanId))
  if (status) whereParts.push(eq(students.status, status))
  if (q) whereParts.push(or(ilike(students.nis, `%${q}%`), ilike(students.nama, `%${q}%`)))
  const rows = await db
    .select()
    .from(students)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(students.nama)
  return rows.map(stuDto)
}

export async function createStudent(input: {
  nis: string
  nama: string
  kelasId?: string
  jurusanId?: string
  noHp?: string
  status: SdmStatus
}): Promise<StudentDto> {
  const nis = input.nis.trim()
  const nama = input.nama.trim()
  if (!nis || !nama) throw new AppError({ message: 'NIS dan nama siswa wajib diisi.' })
  const dup = await db.select({ id: students.id }).from(students).where(eq(students.nis, nis)).limit(1)
  if (dup.length) throw new AppError({ message: 'NIS sudah digunakan.' })
  const now = new Date()
  const [row] = await db
    .insert(students)
    .values({
      id: randomUUID(),
      nis,
      nama,
      kelasId: input.kelasId ?? null,
      jurusanId: input.jurusanId ?? null,
      noHp: input.noHp?.trim() || null,
      status: input.status,
      dibuatPada: now,
      diubahPada: now,
    })
    .returning()
  return stuDto(row)
}

export async function updateStudent(
  id: string,
  patch: Partial<{ nis: string; nama: string; kelasId?: string; jurusanId?: string; noHp?: string; status: SdmStatus }>,
): Promise<StudentDto> {
  const cur = await db.select().from(students).where(eq(students.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const nextNis = (patch.nis ?? cur[0].nis).trim()
  const nextNama = (patch.nama ?? cur[0].nama).trim()
  if (!nextNis || !nextNama) throw new AppError({ message: 'NIS dan nama siswa wajib diisi.' })
  const dup = await db
    .select({ id: students.id })
    .from(students)
    .where(and(eq(students.nis, nextNis), sql`${students.id} <> ${id}`))
    .limit(1)
  if (dup.length) throw new AppError({ message: 'NIS sudah digunakan.' })
  const [row] = await db
    .update(students)
    .set({
      nis: nextNis,
      nama: nextNama,
      kelasId: patch.kelasId ?? cur[0].kelasId,
      jurusanId: patch.jurusanId ?? cur[0].jurusanId,
      noHp: (patch.noHp ?? cur[0].noHp)?.trim() || null,
      status: (patch.status ?? (cur[0].status as SdmStatus)) as SdmStatus,
      diubahPada: new Date(),
    })
    .where(eq(students.id, id))
    .returning()
  return stuDto(row)
}

export async function deleteStudent(id: string): Promise<void> {
  await db.delete(students).where(eq(students.id, id))
}

