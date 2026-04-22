import { and, eq, ilike, or, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '../db/client'
import { subjects } from '../db/schema'
import { AppError } from '../http/errors'

export type SubjectStatus = 'aktif' | 'nonaktif'
export type SubjectDto = {
  id: string
  kode: string
  nama: string
  status: SubjectStatus
  dibuatPada: string
  diubahPada: string
}

function toDto(row: typeof subjects.$inferSelect): SubjectDto {
  return {
    id: row.id,
    kode: row.kode,
    nama: row.nama,
    status: row.status as SubjectStatus,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

export async function listSubjects(params: { q?: string; status?: SubjectStatus | '' }): Promise<SubjectDto[]> {
  const q = (params.q ?? '').trim()
  const status = (params.status ?? '') as SubjectStatus | ''

  const whereParts = []
  if (status) whereParts.push(eq(subjects.status, status))
  if (q) whereParts.push(or(ilike(subjects.kode, `%${q}%`), ilike(subjects.nama, `%${q}%`)))

  const rows = await db
    .select()
    .from(subjects)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(subjects.kode)

  return rows.map(toDto)
}

export async function createSubject(input: { kode: string; nama: string; status: SubjectStatus }): Promise<SubjectDto> {
  const kode = input.kode.trim()
  const nama = input.nama.trim()
  if (!kode || !nama) throw new AppError({ message: 'Kode dan nama pelajaran wajib diisi.' })

  const existing = await db.select({ id: subjects.id }).from(subjects).where(sql`lower(${subjects.kode}) = lower(${kode})`).limit(1)
  if (existing.length) throw new AppError({ message: 'Kode mata pelajaran sudah digunakan.' })

  const now = new Date()
  const [row] = await db
    .insert(subjects)
    .values({ id: randomUUID(), kode, nama, status: input.status, dibuatPada: now, diubahPada: now })
    .returning()

  return toDto(row)
}

export async function updateSubject(
  id: string,
  patch: Partial<{ kode: string; nama: string; status: SubjectStatus }>,
): Promise<SubjectDto> {
  const current = await db.select().from(subjects).where(eq(subjects.id, id)).limit(1)
  if (!current.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })

  const nextKode = (patch.kode ?? current[0].kode).trim()
  const nextNama = (patch.nama ?? current[0].nama).trim()
  const nextStatus = (patch.status ?? (current[0].status as SubjectStatus)) as SubjectStatus

  if (!nextKode || !nextNama) throw new AppError({ message: 'Kode dan nama pelajaran wajib diisi.' })

  const dup = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(and(sql`lower(${subjects.kode}) = lower(${nextKode})`, sql`${subjects.id} <> ${id}`))
    .limit(1)
  if (dup.length) throw new AppError({ message: 'Kode mata pelajaran sudah digunakan.' })

  const [row] = await db
    .update(subjects)
    .set({ kode: nextKode, nama: nextNama, status: nextStatus, diubahPada: new Date() })
    .where(eq(subjects.id, id))
    .returning()

  return toDto(row)
}

export async function deleteSubject(id: string): Promise<void> {
  await db.delete(subjects).where(eq(subjects.id, id))
}

