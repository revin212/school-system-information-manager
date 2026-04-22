import { z } from 'zod'

export const SppInvoiceStatusSchema = z.enum(['lunas', 'belum_lunas', 'terlambat'])
export const SppPaymentMethodSchema = z.enum(['tunai', 'transfer_bank', 'e_wallet', 'qris'])
export const PayrollStatusSchema = z.enum(['draft', 'diproses', 'dibayar'])

export const ListSppInvoicesQuerySchema = z.object({
  q: z.string().optional().default(''),
  kelasId: z.string().optional().default(''),
  status: z.union([SppInvoiceStatusSchema, z.literal('')]).optional().default(''),
  bulan: z.string().optional().default(''),
})

export const CreateSppPaymentBodySchema = z.object({
  invoiceId: z.string(),
  metode: SppPaymentMethodSchema,
  nominal: z.number(),
  dibayarPada: z.string().optional(),
  catatan: z.string().optional(),
})

export const ListSppPaymentsQuerySchema = z.object({
  invoiceId: z.string().optional(),
  siswaId: z.string().optional(),
})

export const ListPayrollSlipsQuerySchema = z.object({
  q: z.string().optional().default(''),
  periode: z.string().optional().default(''),
  status: z.union([PayrollStatusSchema, z.literal('')]).optional().default(''),
})

export const UpsertPayrollSlipBodySchema = z.object({
  id: z.string().optional(),
  periode: z.string(),
  pegawaiId: z.string(),
  gajiPokok: z.number(),
  tunjangan: z.number(),
  potongan: z.number(),
  status: PayrollStatusSchema,
})

