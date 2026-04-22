import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const subjectStatusEnum = pgEnum('subject_status', ['aktif', 'nonaktif'])

export const subjects = pgTable('subjects', {
  id: text('id').primaryKey(),
  kode: text('kode').notNull().unique(),
  nama: text('nama').notNull(),
  status: subjectStatusEnum('status').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

