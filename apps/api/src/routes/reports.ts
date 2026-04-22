import { Router } from 'express'
import { ok } from '../http/respond'
import { requireAuth } from '../middlewares/auth'
import * as sdm from '../services/sdm'
import * as akademik from '../services/akademik'
import * as keu from '../services/keuangan'
import { z } from 'zod'

export const reportsRouter = Router()

reportsRouter.get('/api/v1/reports/data-guru', requireAuth, async (_req, res, next) => {
  try {
    // frontend laporan butuh dataset guru; ambil dari employees tipe guru
    const data = await sdm.listEmployees({ tipe: 'guru', q: '', status: '' })
    res.json(ok(data))
  } catch (e) {
    next(e)
  }
})

reportsRouter.get('/api/v1/reports/data-siswa', requireAuth, async (_req, res, next) => {
  try {
    const data = await sdm.listStudents({ q: '', kelasId: '', jurusanId: '', status: '' })
    res.json(ok(data))
  } catch (e) {
    next(e)
  }
})

reportsRouter.get('/api/v1/reports/ledger-nilai', requireAuth, async (req, res, next) => {
  try {
    const q = z
      .object({ tahunAkademikId: z.string(), kelasId: z.string(), mapelId: z.string() })
      .parse(req.query)
    res.json(ok(await akademik.getGradebook(q)))
  } catch (e) {
    next(e)
  }
})

reportsRouter.get('/api/v1/reports/kekurangan-spp', requireAuth, async (req, res, next) => {
  try {
    const q = z.object({ kelasId: z.string().optional().default(''), bulan: z.string().optional().default('') }).parse(req.query)
    // Return invoice yang belum lunas/terlambat
    const invoices = await keu.listSppInvoices({ q: '', kelasId: q.kelasId, bulan: q.bulan, status: '' })
    const data = invoices.filter((i) => i.status !== 'lunas')
    res.json(ok(data))
  } catch (e) {
    next(e)
  }
})

