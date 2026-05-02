import { Router } from 'express'
import { z } from 'zod'
import { ok } from '../http/respond'
import { requireAuth, requireRole } from '../middlewares/auth'
import {
  CreateAcademicYearBodySchema,
  CreateClassBodySchema,
  CreateMajorBodySchema,
  ListClassesQuerySchema,
  ListWithQStatusSchema,
  PatchAcademicYearBodySchema,
  PatchClassBodySchema,
  PatchMajorBodySchema,
} from '../validators/master'
import * as master from '../services/master'

export const masterRouter = Router()

// Majors
masterRouter.get('/api/v1/majors', requireAuth, async (req, res, next) => {
  try {
    const q = ListWithQStatusSchema.parse(req.query)
    res.json(ok(await master.listMajors(q)))
  } catch (e) {
    next(e)
  }
})

masterRouter.post('/api/v1/majors', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const body = CreateMajorBodySchema.parse(req.body)
    res.json(ok(await master.createMajor(body)))
  } catch (e) {
    next(e)
  }
})

masterRouter.patch('/api/v1/majors/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = PatchMajorBodySchema.parse(req.body)
    res.json(ok(await master.updateMajor(id, body)))
  } catch (e) {
    next(e)
  }
})

masterRouter.delete('/api/v1/majors/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await master.deleteMajor(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

// Classes
masterRouter.get('/api/v1/classes', requireAuth, async (req, res, next) => {
  try {
    const q = ListClassesQuerySchema.parse(req.query)
    res.json(ok(await master.listClasses(q)))
  } catch (e) {
    next(e)
  }
})

masterRouter.post('/api/v1/classes', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const body = CreateClassBodySchema.parse(req.body)
    res.json(ok(await master.createClass(body)))
  } catch (e) {
    next(e)
  }
})

masterRouter.patch('/api/v1/classes/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = PatchClassBodySchema.parse(req.body)
    res.json(ok(await master.updateClass(id, body)))
  } catch (e) {
    next(e)
  }
})

masterRouter.delete('/api/v1/classes/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await master.deleteClass(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

// Academic years
masterRouter.get('/api/v1/academic-years', requireAuth, async (req, res, next) => {
  try {
    const q = ListWithQStatusSchema.parse(req.query)
    res.json(ok(await master.listAcademicYears(q)))
  } catch (e) {
    next(e)
  }
})

masterRouter.post('/api/v1/academic-years', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const body = CreateAcademicYearBodySchema.parse(req.body)
    res.json(ok(await master.createAcademicYear(body)))
  } catch (e) {
    next(e)
  }
})

masterRouter.patch('/api/v1/academic-years/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = PatchAcademicYearBodySchema.parse(req.body)
    res.json(ok(await master.updateAcademicYear(id, body)))
  } catch (e) {
    next(e)
  }
})

masterRouter.delete('/api/v1/academic-years/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await master.deleteAcademicYear(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

