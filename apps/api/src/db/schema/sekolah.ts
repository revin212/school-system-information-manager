import { pgEnum, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const schoolLevelEnum = pgEnum('school_level', ['sd', 'smp', 'sma'])

export const schoolIdentity = pgTable('school_identity', {
  id: text('id').primaryKey(),
  namaSekolah: text('nama_sekolah').notNull(),
  npsn: text('npsn').notNull(),
  jenjang: schoolLevelEnum('jenjang').notNull(),
  alamat: text('alamat').notNull(),
  provinsi: text('provinsi').notNull(),
  kota: text('kota').notNull(),
  email: text('email').notNull(),
  telepon: text('telepon').notNull(),
  logoDataUrl: text('logo_data_url'),
  statusAktif: boolean('status_aktif').notNull(),
  terverifikasi: boolean('terverifikasi').notNull(),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

