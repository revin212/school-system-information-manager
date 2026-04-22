import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '../db/client'
import { employees, payrollSlips, sppInvoices, sppPayments, students } from '../db/schema'
import { AppError } from '../http/errors'

export type SppInvoiceStatus = 'lunas' | 'belum_lunas' | 'terlambat'
export type SppPaymentMethod = 'tunai' | 'transfer_bank' | 'e_wallet' | 'qris'
export type PayrollStatus = 'draft' | 'diproses' | 'dibayar'

export type SppInvoiceDto = {
  id: string
  siswaId: string
  kelasId?: string
  bulan: string
  jatuhTempo: string
  nominal: number
  dibayar: number
  status: SppInvoiceStatus
  lunasPada?: string
  dibuatPada: string
  diubahPada: string
}

export type SppPaymentDto = {
  id: string
  invoiceId: string
  siswaId: string
  metode: SppPaymentMethod
  dibayarPada: string
  nominal: number
  catatan?: string
  dibuatPada: string
}

export type PayrollSlipDto = {
  id: string
  periode: string
  pegawaiId: string
  gajiPokok: number
  tunjangan: number
  potongan: number
  total: number
  status: PayrollStatus
  dibayarPada?: string
  dibuatPada: string
  diubahPada: string
}

function computeSppStatus(inv: { jatuhTempo: string; nominal: number; dibayar: number }): SppInvoiceStatus {
  if (inv.dibayar >= inv.nominal) return 'lunas'
  const due = new Date(inv.jatuhTempo).getTime()
  if (Date.now() > due) return 'terlambat'
  return 'belum_lunas'
}

function invoiceDto(row: typeof sppInvoices.$inferSelect): SppInvoiceDto {
  return {
    id: row.id,
    siswaId: row.siswaId,
    kelasId: row.kelasId ?? undefined,
    bulan: row.bulan,
    jatuhTempo: row.jatuhTempo,
    nominal: row.nominal,
    dibayar: row.dibayar,
    status: row.status as SppInvoiceStatus,
    lunasPada: row.lunasPada?.toISOString() ?? undefined,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

function paymentDto(row: typeof sppPayments.$inferSelect): SppPaymentDto {
  return {
    id: row.id,
    invoiceId: row.invoiceId,
    siswaId: row.siswaId,
    metode: row.metode as SppPaymentMethod,
    dibayarPada: row.dibayarPada.toISOString(),
    nominal: row.nominal,
    catatan: row.catatan ?? undefined,
    dibuatPada: row.dibuatPada.toISOString(),
  }
}

function slipDto(row: typeof payrollSlips.$inferSelect): PayrollSlipDto {
  return {
    id: row.id,
    periode: row.periode,
    pegawaiId: row.pegawaiId,
    gajiPokok: row.gajiPokok,
    tunjangan: row.tunjangan,
    potongan: row.potongan,
    total: row.total,
    status: row.status as PayrollStatus,
    dibayarPada: row.dibayarPada?.toISOString() ?? undefined,
    dibuatPada: row.dibuatPada.toISOString(),
    diubahPada: row.diubahPada.toISOString(),
  }
}

// SPP invoices
export async function listSppInvoices(params: {
  q?: string
  kelasId?: string | ''
  status?: SppInvoiceStatus | ''
  bulan?: string | ''
}): Promise<SppInvoiceDto[]> {
  const q = (params.q ?? '').trim()
  const kelasId = (params.kelasId ?? '').trim()
  const status = (params.status ?? '') as SppInvoiceStatus | ''
  const bulan = (params.bulan ?? '').trim()

  const whereParts = []
  if (kelasId) whereParts.push(eq(sppInvoices.kelasId, kelasId))
  if (bulan) whereParts.push(eq(sppInvoices.bulan, bulan))

  const rows = await db
    .select()
    .from(sppInvoices)
    .where(whereParts.length ? and(...whereParts) : undefined)

  // Apply computed status like mock
  const updatedRows = rows.map((r) => {
    const statusNow = computeSppStatus(r)
    return statusNow === (r.status as SppInvoiceStatus) ? r : ({ ...r, status: statusNow } as typeof r)
  })

  // q filter needs student data
  let studentById: Record<string, { nama: string; nis: string }> = {}
  if (q) {
    const stus = await db.select({ id: students.id, nama: students.nama, nis: students.nis }).from(students)
    studentById = Object.fromEntries(stus.map((s) => [s.id, { nama: s.nama.toLowerCase(), nis: s.nis.toLowerCase() }]))
  }

  const filtered = updatedRows
    .filter((inv) => (status ? (inv.status as any) === status : true))
    .filter((inv) => {
      if (!q) return true
      const stu = studentById[inv.siswaId]
      const name = stu?.nama ?? ''
      const nis = stu?.nis ?? ''
      const ql = q.toLowerCase()
      return name.includes(ql) || nis.includes(ql) || inv.bulan.includes(q)
    })
    .sort((a, b) => `${b.bulan} ${a.jatuhTempo}`.localeCompare(`${a.bulan} ${b.jatuhTempo}`))

  return filtered.map((r) => invoiceDto(r as any))
}

export async function createSppPayment(input: {
  invoiceId: string
  metode: SppPaymentMethod
  nominal: number
  dibayarPada?: string
  catatan?: string
}): Promise<{ invoice: SppInvoiceDto; payment: SppPaymentDto }> {
  const invRows = await db.select().from(sppInvoices).where(eq(sppInvoices.id, input.invoiceId)).limit(1)
  if (!invRows.length) throw new AppError({ status: 404, message: 'Tagihan tidak ditemukan.' })
  const inv = invRows[0]

  const nominal = Math.max(0, Math.floor(input.nominal))
  if (nominal <= 0) throw new AppError({ message: 'Nominal pembayaran harus lebih dari 0.' })

  const nowIso = input.dibayarPada ?? new Date().toISOString()
  const dibayarPada = new Date(nowIso)
  const paymentRow = await db
    .insert(sppPayments)
    .values({
      id: randomUUID(),
      invoiceId: inv.id,
      siswaId: inv.siswaId,
      metode: input.metode,
      dibayarPada,
      nominal,
      catatan: input.catatan?.trim() || null,
      dibuatPada: dibayarPada,
    })
    .returning()

  const nextDibayar = inv.dibayar + nominal
  const statusNow = nextDibayar >= inv.nominal ? 'lunas' : computeSppStatus({ jatuhTempo: inv.jatuhTempo, nominal: inv.nominal, dibayar: nextDibayar })
  const lunasPada = nextDibayar >= inv.nominal ? dibayarPada : inv.lunasPada

  const [updated] = await db
    .update(sppInvoices)
    .set({
      dibayar: nextDibayar,
      status: statusNow,
      lunasPada,
      diubahPada: new Date(),
    })
    .where(eq(sppInvoices.id, inv.id))
    .returning()

  return { invoice: invoiceDto(updated), payment: paymentDto(paymentRow[0]) }
}

export async function listSppPayments(params: { invoiceId?: string; siswaId?: string }): Promise<SppPaymentDto[]> {
  const invoiceId = (params.invoiceId ?? '').trim()
  const siswaId = (params.siswaId ?? '').trim()
  const whereParts = []
  if (invoiceId) whereParts.push(eq(sppPayments.invoiceId, invoiceId))
  if (siswaId) whereParts.push(eq(sppPayments.siswaId, siswaId))
  const rows = await db
    .select()
    .from(sppPayments)
    .where(whereParts.length ? and(...whereParts) : undefined)
    .orderBy(desc(sppPayments.dibayarPada))
  return rows.map(paymentDto)
}

// Payroll
export async function listPayrollSlips(params: { q?: string; periode?: string | ''; status?: PayrollStatus | '' }): Promise<PayrollSlipDto[]> {
  const q = (params.q ?? '').trim()
  const periode = (params.periode ?? '').trim()
  const status = (params.status ?? '') as PayrollStatus | ''

  const whereParts = []
  if (periode) whereParts.push(eq(payrollSlips.periode, periode))
  if (status) whereParts.push(eq(payrollSlips.status, status))
  const rows = await db
    .select()
    .from(payrollSlips)
    .where(whereParts.length ? and(...whereParts) : undefined)

  let empById: Record<string, { nama: string; nip: string }> = {}
  if (q) {
    const emps = await db.select({ id: employees.id, nama: employees.nama, nip: employees.nip }).from(employees)
    empById = Object.fromEntries(emps.map((e) => [e.id, { nama: e.nama.toLowerCase(), nip: e.nip.toLowerCase() }]))
  }
  const filtered = rows
    .filter((s) => {
      if (!q) return true
      const emp = empById[s.pegawaiId]
      const ql = q.toLowerCase()
      return (emp?.nama ?? '').includes(ql) || (emp?.nip ?? '').includes(ql)
    })
    .sort((a, b) => `${b.periode} ${a.status}`.localeCompare(`${a.periode} ${b.status}`))

  return filtered.map(slipDto)
}

export async function upsertPayrollSlip(input: {
  id?: string
  periode: string
  pegawaiId: string
  gajiPokok: number
  tunjangan: number
  potongan: number
  status: PayrollStatus
}): Promise<PayrollSlipDto> {
  if (!input.periode) throw new AppError({ message: 'Periode wajib dipilih.' })
  if (!input.pegawaiId) throw new AppError({ message: 'Pegawai wajib dipilih.' })
  const gajiPokok = Math.max(0, Math.floor(input.gajiPokok))
  const tunjangan = Math.max(0, Math.floor(input.tunjangan))
  const potongan = Math.max(0, Math.floor(input.potongan))
  const total = Math.max(0, gajiPokok + tunjangan - potongan)
  const now = new Date()

  if (input.id) {
    const cur = await db.select().from(payrollSlips).where(eq(payrollSlips.id, input.id)).limit(1)
    if (!cur.length) throw new AppError({ status: 404, message: 'Slip gaji tidak ditemukan.' })
    const [row] = await db
      .update(payrollSlips)
      .set({
        periode: input.periode,
        pegawaiId: input.pegawaiId,
        gajiPokok,
        tunjangan,
        potongan,
        total,
        status: input.status,
        diubahPada: now,
      })
      .where(eq(payrollSlips.id, input.id))
      .returning()
    return slipDto(row)
  }

  const dup = await db
    .select({ id: payrollSlips.id })
    .from(payrollSlips)
    .where(and(eq(payrollSlips.periode, input.periode), eq(payrollSlips.pegawaiId, input.pegawaiId)))
    .limit(1)
  if (dup.length) throw new AppError({ message: 'Slip gaji untuk pegawai & periode ini sudah ada.' })

  const [row] = await db
    .insert(payrollSlips)
    .values({
      id: randomUUID(),
      periode: input.periode,
      pegawaiId: input.pegawaiId,
      gajiPokok,
      tunjangan,
      potongan,
      total,
      status: input.status,
      dibayarPada: null,
      dibuatPada: now,
      diubahPada: now,
    })
    .returning()
  return slipDto(row)
}

export async function markPayrollPaid(id: string): Promise<PayrollSlipDto> {
  const cur = await db.select().from(payrollSlips).where(eq(payrollSlips.id, id)).limit(1)
  if (!cur.length) throw new AppError({ status: 404, message: 'Slip gaji tidak ditemukan.' })
  const now = new Date()
  const [row] = await db
    .update(payrollSlips)
    .set({ status: 'dibayar', dibayarPada: now, diubahPada: now })
    .where(eq(payrollSlips.id, id))
    .returning()
  return slipDto(row)
}

