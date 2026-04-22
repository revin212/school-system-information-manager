import { pgEnum, pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const sppInvoiceStatusEnum = pgEnum('spp_invoice_status', ['lunas', 'belum_lunas', 'terlambat'])
export const sppPaymentMethodEnum = pgEnum('spp_payment_method', ['tunai', 'transfer_bank', 'e_wallet', 'qris'])

export const sppInvoices = pgTable('spp_invoices', {
  id: text('id').primaryKey(),
  siswaId: text('siswa_id').notNull(),
  kelasId: text('kelas_id'),
  bulan: text('bulan').notNull(), // "2023-09"
  jatuhTempo: text('jatuh_tempo').notNull(), // ISO date string
  nominal: integer('nominal').notNull(),
  dibayar: integer('dibayar').notNull(),
  status: sppInvoiceStatusEnum('status').notNull(),
  lunasPada: timestamp('lunas_pada', { withTimezone: true }),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

export const sppPayments = pgTable('spp_payments', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull(),
  siswaId: text('siswa_id').notNull(),
  metode: sppPaymentMethodEnum('metode').notNull(),
  dibayarPada: timestamp('dibayar_pada', { withTimezone: true }).notNull(),
  nominal: integer('nominal').notNull(),
  catatan: text('catatan'),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
})

export const payrollStatusEnum = pgEnum('payroll_status', ['draft', 'diproses', 'dibayar'])

export const payrollSlips = pgTable('payroll_slips', {
  id: text('id').primaryKey(),
  periode: text('periode').notNull(), // "2023-11"
  pegawaiId: text('pegawai_id').notNull(),
  gajiPokok: integer('gaji_pokok').notNull(),
  tunjangan: integer('tunjangan').notNull(),
  potongan: integer('potongan').notNull(),
  total: integer('total').notNull(),
  status: payrollStatusEnum('status').notNull(),
  dibayarPada: timestamp('dibayar_pada', { withTimezone: true }),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull(),
  diubahPada: timestamp('diubah_pada', { withTimezone: true }).notNull(),
})

