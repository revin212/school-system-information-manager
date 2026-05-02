import { Router } from 'express'
import { z } from 'zod'
import { ok } from '../http/respond'
import { AppError } from '../http/errors'
import { requireAuth, requireRole } from '../middlewares/auth'
import { CreateSubjectBodySchema, ListSubjectsQuerySchema, UpsertSubjectBodySchema } from '../validators/subjects'
import * as subjectService from '../services/subjects'

export const subjectsRouter = Router()

subjectsRouter.get('/api/v1/subjects', requireAuth, async (req, res, next) => {
  try {
    const q = ListSubjectsQuerySchema.parse(req.query)
    const data = await subjectService.listSubjects(q)
    res.json(ok(data))
  } catch (e) {
    next(e)
  }
})

subjectsRouter.post('/api/v1/subjects', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const body = CreateSubjectBodySchema.parse(req.body)
    const data = await subjectService.createSubject(body)
    res.json(ok(data))
  } catch (e) {
    next(e)
  }
})

subjectsRouter.patch('/api/v1/subjects/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = UpsertSubjectBodySchema.parse(req.body)
    const data = await subjectService.updateSubject(id, body)
    res.json(ok(data))
  } catch (e) {
    next(e)
  }
})

subjectsRouter.delete('/api/v1/subjects/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await subjectService.deleteSubject(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

