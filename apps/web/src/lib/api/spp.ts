import type { SppInvoice, SppInvoiceStatus, SppPayment, SppPaymentMethod } from '../mockApi/types'
import { apiFetch } from './http'

export type ListSppInvoicesParams = {
  q?: string
  kelasId?: string | ''
  status?: SppInvoiceStatus | ''
  bulan?: string | ''
}

export async function listSppInvoices(params: ListSppInvoicesParams): Promise<SppInvoice[]> {
  return apiFetch('/api/v1/spp/invoices', {
    method: 'GET',
    query: {
      q: params.q ?? '',
      kelasId: params.kelasId ?? '',
      status: params.status ?? '',
      bulan: params.bulan ?? '',
    },
  })
}

export async function listSppPayments(params: { invoiceId?: string; siswaId?: string }): Promise<SppPayment[]> {
  return apiFetch('/api/v1/spp/payments', {
    method: 'GET',
    query: {
      invoiceId: params.invoiceId ?? '',
      siswaId: params.siswaId ?? '',
    },
  })
}

export async function createSppPayment(input: {
  invoiceId: string
  metode: SppPaymentMethod
  nominal: number
  dibayarPada?: string
  catatan?: string
}): Promise<{ invoice: SppInvoice; payment: SppPayment }> {
  return apiFetch('/api/v1/spp/payments', { method: 'POST', body: input })
}

