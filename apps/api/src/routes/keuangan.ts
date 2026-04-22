import { Router } from 'express'
import { z } from 'zod'
import { ok } from '../http/respond'
import { requireAuth, requireRole } from '../middlewares/auth'
import {
  CreateSppPaymentBodySchema,
  ListPayrollSlipsQuerySchema,
  ListSppInvoicesQuerySchema,
  ListSppPaymentsQuerySchema,
  UpsertPayrollSlipBodySchema,
} from '../validators/keuangan'
import * as keu from '../services/keuangan'

export const keuanganRouter = Router()

// SPP
keuanganRouter.get('/api/v1/spp/invoices', requireAuth, async (req, res, next) => {
  try {
    const q = ListSppInvoicesQuerySchema.parse(req.query)
    res.json(ok(await keu.listSppInvoices(q)))
  } catch (e) {
    next(e)
  }
})

keuanganRouter.post('/api/v1/spp/payments', requireAuth, requireRole(['ADMIN', 'TU']), async (req, res, next) => {
  try {
    const body = CreateSppPaymentBodySchema.parse(req.body)
    res.json(ok(await keu.createSppPayment(body as any)))
  } catch (e) {
    next(e)
  }
})

keuanganRouter.get('/api/v1/spp/payments', requireAuth, async (req, res, next) => {
  try {
    const q = ListSppPaymentsQuerySchema.parse(req.query)
    res.json(ok(await keu.listSppPayments(q)))
  } catch (e) {
    next(e)
  }
})

// Payroll
keuanganRouter.get('/api/v1/payroll/slips', requireAuth, async (req, res, next) => {
  try {
    const q = ListPayrollSlipsQuerySchema.parse(req.query)
    res.json(ok(await keu.listPayrollSlips(q)))
  } catch (e) {
    next(e)
  }
})

keuanganRouter.post('/api/v1/payroll/slips', requireAuth, requireRole(['ADMIN', 'TU']), async (req, res, next) => {
  try {
    const body = UpsertPayrollSlipBodySchema.parse(req.body)
    res.json(ok(await keu.upsertPayrollSlip(body as any)))
  } catch (e) {
    next(e)
  }
})

keuanganRouter.post('/api/v1/payroll/slips/:id/mark-paid', requireAuth, requireRole(['ADMIN', 'TU']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    res.json(ok(await keu.markPayrollPaid(id)))
  } catch (e) {
    next(e)
  }
})

