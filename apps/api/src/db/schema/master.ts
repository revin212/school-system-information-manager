import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const activeStatusEnum = pgEnum('active_status', ['aktif', 'nonaktif'])
export const classLevelEnum = pgEnum('class_level', ['X', 'XI', 'XII'])

export const majors = pgTable('majors', {
  id: text('id').primaryKey(),
  kode: text('kode').notNull().unique(),
  nama: text('nama').notNull(),
  status: activeStatusEnum('status').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

export const classes = pgTable('classes', {
  id: text('id').primaryKey(),
  nama: text('nama').notNull().unique(),
  tingkat: classLevelEnum('tingkat').notNull(),
  jurusanId: text('jurusan_id'),
  status: activeStatusEnum('status').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

export const academicYears = pgTable('academic_years', {
  id: text('id').primaryKey(),
  nama: text('nama').notNull().unique(),
  status: activeStatusEnum('status').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

