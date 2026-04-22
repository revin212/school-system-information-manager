import { pgEnum, pgTable, text, integer, timestamp, unique } from 'drizzle-orm/pg-core'

export const weekdayEnum = pgEnum('weekday', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'])
export const scheduleStatusEnum = pgEnum('schedule_status', ['aktif', 'bentrok'])
export const gradebookStatusEnum = pgEnum('gradebook_status', ['draft', 'published'])

export const teachingSlots = pgTable('teaching_slots', {
  id: text('id').primaryKey(),
  guruId: text('guru_id').notNull(),
  hari: weekdayEnum('hari').notNull(),
  mulai: text('mulai').notNull(), // "07:00"
  selesai: text('selesai').notNull(),
  keterangan: text('keterangan').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

export const schedules = pgTable('schedules', {
  id: text('id').primaryKey(),
  tahunAkademikId: text('tahun_akademik_id').notNull(),
  kelasId: text('kelas_id').notNull(),
  hari: weekdayEnum('hari').notNull(),
  mulai: text('mulai').notNull(),
  selesai: text('selesai').notNull(),
  mapelId: text('mapel_id').notNull(),
  guruId: text('guru_id').notNull(),
  ruang: text('ruang').notNull(),
  status: scheduleStatusEnum('status').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

export const gradeCategories = pgTable('grade_categories', {
  id: text('id').primaryKey(),
  tahunAkademikId: text('tahun_akademik_id').notNull(),
  kelasId: text('kelas_id').notNull(),
  mapelId: text('mapel_id').notNull(),
  nama: text('nama').notNull(),
  bobot: integer('bobot').notNull(),
  keterangan: text('keterangan'),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

export const gradeEntries = pgTable('grade_entries', {
  id: text('id').primaryKey(),
  tahunAkademikId: text('tahun_akademik_id').notNull(),
  kelasId: text('kelas_id').notNull(),
  mapelId: text('mapel_id').notNull(),
  siswaId: text('siswa_id').notNull(),
  status: gradebookStatusEnum('status').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

export const gradeScores = pgTable(
  'grade_scores',
  {
    id: text('id').primaryKey(),
    gradeEntryId: text('grade_entry_id').notNull(),
    categoryId: text('category_id').notNull(),
    score: integer('score'),
  },
  (t) => ({
    uniq: unique().on(t.gradeEntryId, t.categoryId),
  }),
)

