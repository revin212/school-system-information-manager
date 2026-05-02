import { and, asc, eq, gte, inArray, lte, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '../db/client'
import {
  administrativeSchedules,
  gradeCategories,
  gradeEntries,
  gradeScores,
  schedules,
  teachingSlots,
} from '../db/schema'
import { AppError } from '../http/errors'

export type Weekday = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'
export type ScheduleStatus = 'aktif' | 'bentrok'
export type GradebookStatus = 'draft' | 'published'

export type TeachingSlotDto = {
  id: string
  guruId: string
  hari: Weekday
  mulai: string
  selesai: string
  keterangan: string
  dibuatPada: string
  diubahPada: string
}

export type ScheduleDto = {
  id: string
  tahunAkademikId: string
  kelasId: string
  hari: Weekday
  mulai: string
  selesai: string
  mapelId: string
  guruId: string
  ruang: string
  status: ScheduleStatus
  dibuatPada: string
  diubahPada: string
}

export type AdministrativeScheduleDto = {
  id: string
  tanggal: string
  jam: string
  judul: string
  lokasi: string
  dibuatPada: string
  diubahPada: string
}

export type GradeCategoryDto = {
  id: string
  tahunAkademikId: string
  kelasId: string
  mapelId: string
  nama: string
  bobot: number
  keterangan?: string
  dibuatPada: string
  diubahPada: string
}

export type GradeEntryDto = {
  id: string
  tahunAkademikId: string
  kelasId: string
  mapelId: string
  siswaId: string
  nilai: Record<string, number | null>
  status: GradebookStatus
  dibuatPada: string
  diubahPada: string
}

function slotDto(row: typeof teachingSlots.$inferSelect): TeachingSlotDto {
  return {
    id: row.id,
    guruId: row.guruId,
    hari: row.hari as Weekday,
    mulai: row.mulai,
    selesai: row.selesai,
    keterangan: row.keterangan,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

function scheduleDto(row: typeof schedules.$inferSelect): ScheduleDto {
  return {
    id: row.id,
    tahunAkademikId: row.tahunAkademikId,
    kelasId: row.kelasId,
    hari: row.hari as Weekday,
    mulai: row.mulai,
    selesai: row.selesai,
    mapelId: row.mapelId,
    guruId: row.guruId,
    ruang: row.ruang,
    status: row.status as ScheduleStatus,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

function administrativeScheduleDto(row: typeof administrativeSchedules.$inferSelect): AdministrativeScheduleDto {
  return {
    id: row.id,
    tanggal: row.tanggal,
    jam: row.jam,
    judul: row.judul,
    lokasi: row.lokasi,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

function categoryDto(row: typeof gradeCategories.$inferSelect): GradeCategoryDto {
  return {
    id: row.id,
    tahunAkademikId: row.tahunAkademikId,
    kelasId: row.kelasId,
    mapelId: row.mapelId,
    nama: row.nama,
    bobot: row.bobot,
    keterangan: row.keterangan ?? undefined,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

// Teaching slots
export async function listTeachingSlots(params: { guruId?: string | ''; hari?: Weekday | '' }): Promise<TeachingSlotDto[]> {
  const guruId = (params.guruId ?? '').trim()
  const hari = (params.hari ?? '') as Weekday | ''
  const whereParts = []
  if (guruId) whereParts.push(eq(teachingSlots.guruId, guruId))
  if (hari) whereParts.push(eq(teachingSlots.hari, hari))
  const rows = await db
    .select()
    .from(teachingSlots)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(sql`${teachingSlots.hari} asc, ${teachingSlots.mulai} asc`)
  return rows.map(slotDto)
}

export async function createTeachingSlot(input: {
  guruId: string
  hari: Weekday
  mulai: string
  selesai: string
  keterangan: string
}): Promise<TeachingSlotDto> {
  if (!input.guruId) throw new AppError({ message: 'Guru wajib dipilih.' })
  const keterangan = input.keterangan.trim()
  if (!keterangan) throw new AppError({ message: 'Keterangan wajib diisi.' })
  const now = new Date()
  const [row] = await db
    .insert(teachingSlots)
    .values({
      id: randomUUID(),
      guruId: input.guruId,
      hari: input.hari,
      mulai: input.mulai,
      selesai: input.selesai,
      keterangan,
      dibuatPada: now,
      diubahPada: now,
    })
    .returning()
  return slotDto(row)
}

export async function updateTeachingSlot(
  id: string,
  patch: Partial<{ guruId: string; hari: Weekday; mulai: string; selesai: string; keterangan: string }>,
): Promise<TeachingSlotDto> {
  const cur = await db.select().from(teachingSlots).where(eq(teachingSlots.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const next = {
    guruId: patch.guruId ?? cur[0].guruId,
    hari: (patch.hari ?? (cur[0].hari as Weekday)) as Weekday,
    mulai: patch.mulai ?? cur[0].mulai,
    selesai: patch.selesai ?? cur[0].selesai,
    keterangan: (patch.keterangan ?? cur[0].keterangan).trim(),
  }
  if (!next.keterangan) throw new AppError({ message: 'Keterangan wajib diisi.' })
  const [row] = await db
    .update(teachingSlots)
    .set({ ...next, diubahPada: new Date() })
    .where(eq(teachingSlots.id, id))
    .returning()
  return slotDto(row)
}

export async function deleteTeachingSlot(id: string): Promise<void> {
  await db.delete(teachingSlots).where(eq(teachingSlots.id, id))
}

// Schedules
export async function listSchedules(params: { tahunAkademikId?: string | ''; kelasId?: string | '' }): Promise<ScheduleDto[]> {
  const tahun = (params.tahunAkademikId ?? '').trim()
  const kelas = (params.kelasId ?? '').trim()
  const whereParts = []
  if (tahun) whereParts.push(eq(schedules.tahunAkademikId, tahun))
  if (kelas) whereParts.push(eq(schedules.kelasId, kelas))
  const rows = await db
    .select()
    .from(schedules)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(sql`${schedules.hari} asc, ${schedules.mulai} asc`)
  return rows.map(scheduleDto)
}

export async function createSchedule(input: Omit<ScheduleDto, 'id' | 'dibuatPada' | 'diubahPada'>): Promise<ScheduleDto> {
  const now = new Date()
  const [row] = await db
    .insert(schedules)
    .values({ id: randomUUID(), ...input, dibuatPada: now, diubahPada: now })
    .returning()
  return scheduleDto(row)
}

export async function updateSchedule(
  id: string,
  patch: Partial<Omit<ScheduleDto, 'id' | 'dibuatPada' | 'diubahPada'>>,
): Promise<ScheduleDto> {
  const cur = await db.select().from(schedules).where(eq(schedules.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const [row] = await db.update(schedules).set({ ...patch, diubahPada: new Date() }).where(eq(schedules.id, id)).returning()
  return scheduleDto(row)
}

export async function deleteSchedule(id: string): Promise<void> {
  await db.delete(schedules).where(eq(schedules.id, id))
}

// Jadwal administratif (kalender kegiatan per tanggal)
export async function listAdministrativeSchedules(params: {
  tanggal?: string
  dari?: string
  sampai?: string
}): Promise<AdministrativeScheduleDto[]> {
  const t = (params.tanggal ?? '').trim()
  if (t) {
    const rows = await db
      .select()
      .from(administrativeSchedules)
      .where(eq(administrativeSchedules.tanggal, t))
      .orderBy(asc(administrativeSchedules.jam))
    return rows.map(administrativeScheduleDto)
  }
  const dari = (params.dari ?? '').trim()
  const sampai = (params.sampai ?? '').trim()
  if (dari && sampai) {
    const rows = await db
      .select()
      .from(administrativeSchedules)
      .where(and(gte(administrativeSchedules.tanggal, dari), lte(administrativeSchedules.tanggal, sampai)))
      .orderBy(asc(administrativeSchedules.tanggal), asc(administrativeSchedules.jam))
    return rows.map(administrativeScheduleDto)
  }
  return []
}

export async function createAdministrativeSchedule(input: {
  tanggal: string
  jam: string
  judul: string
  lokasi: string
}): Promise<AdministrativeScheduleDto> {
  const judul = input.judul.trim()
  const lokasi = input.lokasi.trim()
  if (!judul) throw new AppError({ message: 'Judul kegiatan wajib diisi.' })
  if (!lokasi) throw new AppError({ message: 'Lokasi wajib diisi.' })
  const now = new Date()
  const [row] = await db
    .insert(administrativeSchedules)
    .values({
      id: randomUUID(),
      tanggal: input.tanggal,
      jam: input.jam,
      judul,
      lokasi,
      dibuatPada: now,
      diubahPada: now,
    })
    .returning()
  return administrativeScheduleDto(row)
}

export async function updateAdministrativeSchedule(
  id: string,
  patch: Partial<{ tanggal: string; jam: string; judul: string; lokasi: string }>,
): Promise<AdministrativeScheduleDto> {
  const cur = await db.select().from(administrativeSchedules).where(eq(administrativeSchedules.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const judul = (patch.judul ?? cur[0].judul).trim()
  const lokasi = (patch.lokasi ?? cur[0].lokasi).trim()
  if (!judul) throw new AppError({ message: 'Judul kegiatan wajib diisi.' })
  if (!lokasi) throw new AppError({ message: 'Lokasi wajib diisi.' })
  const [row] = await db
    .update(administrativeSchedules)
    .set({
      tanggal: patch.tanggal ?? cur[0].tanggal,
      jam: patch.jam ?? cur[0].jam,
      judul,
      lokasi,
      diubahPada: new Date(),
    })
    .where(eq(administrativeSchedules.id, id))
    .returning()
  return administrativeScheduleDto(row)
}

export async function deleteAdministrativeSchedule(id: string): Promise<void> {
  await db.delete(administrativeSchedules).where(eq(administrativeSchedules.id, id))
}

// Grade categories
export async function listGradeCategories(params: { tahunAkademikId: string; kelasId: string; mapelId: string }): Promise<GradeCategoryDto[]> {
  const rows = await db
    .select()
    .from(gradeCategories)
    .where(and(eq(gradeCategories.tahunAkademikId, params.tahunAkademikId), eq(gradeCategories.kelasId, params.kelasId), eq(gradeCategories.mapelId, params.mapelId)))
    .orderBy(gradeCategories.nama)
  return rows.map(categoryDto)
}

export async function createGradeCategory(input: {
  tahunAkademikId: string
  kelasId: string
  mapelId: string
  nama: string
  bobot: number
  keterangan?: string
}): Promise<GradeCategoryDto> {
  const nama = input.nama.trim()
  if (!nama) throw new AppError({ message: 'Nama kategori wajib diisi.' })
  if (input.bobot <= 0) throw new AppError({ message: 'Bobot harus lebih dari 0%.' })
  const now = new Date()
  const [row] = await db
    .insert(gradeCategories)
    .values({
      id: randomUUID(),
      tahunAkademikId: input.tahunAkademikId,
      kelasId: input.kelasId,
      mapelId: input.mapelId,
      nama,
      bobot: Math.floor(input.bobot),
      keterangan: input.keterangan?.trim() || null,
      dibuatPada: now,
      diubahPada: now,
    })
    .returning()
  return categoryDto(row)
}

export async function updateGradeCategory(
  id: string,
  patch: Partial<{ tahunAkademikId: string; kelasId: string; mapelId: string; nama: string; bobot: number; keterangan?: string }>,
): Promise<GradeCategoryDto> {
  const cur = await db.select().from(gradeCategories).where(eq(gradeCategories.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Data tidak ditemukan.' })
  const nextNama = (patch.nama ?? cur[0].nama).trim()
  if (!nextNama) throw new AppError({ message: 'Nama kategori wajib diisi.' })
  const [row] = await db
    .update(gradeCategories)
    .set({
      ...patch,
      nama: nextNama,
      bobot: patch.bobot != null ? Math.floor(patch.bobot) : cur[0].bobot,
      keterangan: patch.keterangan != null ? patch.keterangan.trim() || null : cur[0].keterangan,
      diubahPada: new Date(),
    })
    .where(eq(gradeCategories.id, id))
    .returning()
  return categoryDto(row)
}

export async function deleteGradeCategory(id: string): Promise<void> {
  await db.delete(gradeScores).where(eq(gradeScores.categoryId, id))
  await db.delete(gradeCategories).where(eq(gradeCategories.id, id))
}

// Gradebook
export async function getGradebook(params: { tahunAkademikId: string; kelasId: string; mapelId: string }): Promise<{
  categories: GradeCategoryDto[]
  entries: GradeEntryDto[]
}> {
  const categories = await listGradeCategories(params)
  const entriesRows = await db
    .select()
    .from(gradeEntries)
    .where(and(eq(gradeEntries.tahunAkademikId, params.tahunAkademikId), eq(gradeEntries.kelasId, params.kelasId), eq(gradeEntries.mapelId, params.mapelId)))

  if (!entriesRows.length) return { categories, entries: [] }

  const entryIds = entriesRows.map((e) => e.id)
  const scores = await db.select().from(gradeScores).where(inArray(gradeScores.gradeEntryId, entryIds))

  const nilaiByEntry: Record<string, Record<string, number | null>> = {}
  for (const sc of scores) {
    if (!nilaiByEntry[sc.gradeEntryId]) nilaiByEntry[sc.gradeEntryId] = {}
    nilaiByEntry[sc.gradeEntryId][sc.categoryId] = sc.score == null ? null : sc.score
  }

  const entries: GradeEntryDto[] = entriesRows.map((r) => ({
    id: r.id,
    tahunAkademikId: r.tahunAkademikId,
    kelasId: r.kelasId,
    mapelId: r.mapelId,
    siswaId: r.siswaId,
    nilai: nilaiByEntry[r.id] ?? {},
    status: r.status as GradebookStatus,
    dibuatPada: r.dibuatPada.toISOString(),
    diubahPada: r.diubahPada.toISOString(),
  }))

  return { categories, entries }
}

export async function upsertGradeScore(input: {
  tahunAkademikId: string
  kelasId: string
  mapelId: string
  siswaId: string
  categoryId: string
  score: number | null
}): Promise<GradeEntryDto> {
  const existing = await db
    .select()
    .from(gradeEntries)
    .where(and(eq(gradeEntries.tahunAkademikId, input.tahunAkademikId), eq(gradeEntries.kelasId, input.kelasId), eq(gradeEntries.mapelId, input.mapelId), eq(gradeEntries.siswaId, input.siswaId)))
    .limit(1)
  const now = new Date()

  let entryId: string
  if (!existing.length) {
    entryId = randomUUID()
    await db.insert(gradeEntries).values({
      id: entryId,
      tahunAkademikId: input.tahunAkademikId,
      kelasId: input.kelasId,
      mapelId: input.mapelId,
      siswaId: input.siswaId,
      status: 'draft',
      dibuatPada: now,
      diubahPada: now,
    })
  } else {
    entryId = existing[0].id
    await db.update(gradeEntries).set({ diubahPada: now }).where(eq(gradeEntries.id, entryId))
  }

  const scoreId = `${entryId}_${input.categoryId}`
  await db
    .insert(gradeScores)
    .values({
      id: scoreId,
      gradeEntryId: entryId,
      categoryId: input.categoryId,
      score: input.score == null ? null : Math.floor(input.score),
    })
    .onConflictDoUpdate({
      target: [gradeScores.gradeEntryId, gradeScores.categoryId],
      set: { score: input.score == null ? null : Math.floor(input.score) },
    })

  const entry = (await db.select().from(gradeEntries).where(eq(gradeEntries.id, entryId)).limit(1))[0]
  const allScores = await db.select().from(gradeScores).where(eq(gradeScores.gradeEntryId, entryId))
  const nilai: Record<string, number | null> = {}
  for (const sc of allScores) nilai[sc.categoryId] = sc.score == null ? null : sc.score

  return {
    id: entry.id,
    tahunAkademikId: entry.tahunAkademikId,
    kelasId: entry.kelasId,
    mapelId: entry.mapelId,
    siswaId: entry.siswaId,
    nilai,
    status: entry.status as GradebookStatus,
    dibuatPada: entry.dibuatPada.toISOString(),
    diubahPada: entry.diubahPada.toISOString(),
  }
}

export async function setGradebookStatus(params: { tahunAkademikId: string; kelasId: string; mapelId: string; status: GradebookStatus }): Promise<void> {
  await db
    .update(gradeEntries)
    .set({ status: params.status, diubahPada: new Date() })
    .where(and(eq(gradeEntries.tahunAkademikId, params.tahunAkademikId), eq(gradeEntries.kelasId, params.kelasId), eq(gradeEntries.mapelId, params.mapelId)))
}

