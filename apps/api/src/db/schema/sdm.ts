import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const employeeTypeEnum = pgEnum('employee_type', ['guru', 'karyawan'])
export const sdmStatusEnum = pgEnum('sdm_status', ['aktif', 'cuti', 'nonaktif'])

export const employees = pgTable('employees', {
  id: text('id').primaryKey(),
  nip: text('nip').notNull().unique(),
  nama: text('nama').notNull(),
  tipe: employeeTypeEnum('tipe').notNull(),
  noHp: text('no_hp').notNull(),
  email: text('email'),
  status: sdmStatusEnum('status').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

export const students = pgTable('students', {
  id: text('id').primaryKey(),
  nis: text('nis').notNull().unique(),
  nama: text('nama').notNull(),
  kelasId: text('kelas_id'),
  jurusanId: text('jurusan_id'),
  noHp: text('no_hp'),
  status: sdmStatusEnum('status').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

