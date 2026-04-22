import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SppInvoiceStatus, SppPaymentMethod } from '../../../lib/mockApi/types'
import { sppApi } from './sppApi'

export const sppKeys = {
  all: ['keuangan', 'spp'] as const,
  invoices: (params: { q: string; kelasId: string; status: '' | SppInvoiceStatus; bulan: string }) =>
    ['keuangan', 'spp', 'invoices', params] as const,
  paymentsByInvoice: (invoiceId: string) => ['keuangan', 'spp', 'payments', 'invoice', invoiceId] as const,
}

export function useSppInvoicesList(params: { q: string; kelasId: string; status: '' | SppInvoiceStatus; bulan: string }) {
  return useQuery({
    queryKey: sppKeys.invoices(params),
    queryFn: () => sppApi.listInvoices(params),
  })
}

export function useSppPayments(invoiceId: string, enabled: boolean) {
  return useQuery({
    queryKey: sppKeys.paymentsByInvoice(invoiceId),
    queryFn: () => sppApi.listPayments({ invoiceId }),
    enabled,
  })
}

export function useCreateSppPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { invoiceId: string; metode: SppPaymentMethod; nominal: number; catatan?: string }) =>
      sppApi.createPayment(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sppKeys.all })
    },
  })
}

