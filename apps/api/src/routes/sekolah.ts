import { Router } from 'express'
import { ok } from '../http/respond'
import { requireAuth, requireRole } from '../middlewares/auth'
import { PatchSchoolIdentityBodySchema } from '../validators/sekolah'
import * as sekolah from '../services/sekolah'

export const sekolahRouter = Router()

sekolahRouter.get('/api/v1/school-identity', requireAuth, async (_req, res, next) => {
  try {
    res.json(ok(await sekolah.getSchoolIdentity()))
  } catch (e) {
    next(e)
  }
})

sekolahRouter.patch('/api/v1/school-identity', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const body = PatchSchoolIdentityBodySchema.parse(req.body)
    res.json(ok(await sekolah.updateSchoolIdentity(body as any)))
  } catch (e) {
    next(e)
  }
})

