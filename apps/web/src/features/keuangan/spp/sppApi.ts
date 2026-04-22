import { USE_MOCK } from '../../../lib/api/config'
import * as backend from '../../../lib/api/spp'
import * as mock from '../../../lib/mockApi/client'
import type { ListSppInvoicesParams } from '../../../lib/mockApi/client'
import type { SppPaymentMethod } from '../../../lib/mockApi/types'

export const sppApi = {
  listInvoices: (params: ListSppInvoicesParams) => (USE_MOCK ? mock.listSppInvoices(params) : backend.listSppInvoices(params)),
  listPayments: (params: { invoiceId?: string; siswaId?: string }) =>
    USE_MOCK ? mock.listSppPayments(params) : backend.listSppPayments(params),
  createPayment: (input: { invoiceId: string; metode: SppPaymentMethod; nominal: number; catatan?: string }) =>
    USE_MOCK ? mock.createSppPayment(input) : backend.createSppPayment(input),
}

