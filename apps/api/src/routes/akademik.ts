import { Router } from 'express'
import { z } from 'zod'
import { ok } from '../http/respond'
import { requireAuth, requireRole } from '../middlewares/auth'
import {
  CreateGradeCategoryBodySchema,
  CreateScheduleBodySchema,
  CreateTeachingSlotBodySchema,
  GetGradebookQuerySchema,
  ListGradeCategoriesQuerySchema,
  ListSchedulesQuerySchema,
  ListTeachingSlotsQuerySchema,
  PatchGradeCategoryBodySchema,
  PatchScheduleBodySchema,
  PatchTeachingSlotBodySchema,
  SetGradebookStatusBodySchema,
  UpsertGradeScoreBodySchema,
} from '../validators/akademik'
import * as akademik from '../services/akademik'

export const akademikRouter = Router()

// Teaching slots
akademikRouter.get('/api/v1/teaching-slots', requireAuth, async (req, res, next) => {
  try {
    const q = ListTeachingSlotsQuerySchema.parse(req.query)
    res.json(ok(await akademik.listTeachingSlots(q)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.post('/api/v1/teaching-slots', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const body = CreateTeachingSlotBodySchema.parse(req.body)
    res.json(ok(await akademik.createTeachingSlot(body)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.patch('/api/v1/teaching-slots/:id', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = PatchTeachingSlotBodySchema.parse(req.body)
    res.json(ok(await akademik.updateTeachingSlot(id, body)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.delete('/api/v1/teaching-slots/:id', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await akademik.deleteTeachingSlot(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

// Schedules
akademikRouter.get('/api/v1/schedules', requireAuth, async (req, res, next) => {
  try {
    const q = ListSchedulesQuerySchema.parse(req.query)
    res.json(ok(await akademik.listSchedules(q)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.post('/api/v1/schedules', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const body = CreateScheduleBodySchema.parse(req.body)
    res.json(ok(await akademik.createSchedule(body as any)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.patch('/api/v1/schedules/:id', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = PatchScheduleBodySchema.parse(req.body)
    res.json(ok(await akademik.updateSchedule(id, body as any)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.delete('/api/v1/schedules/:id', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await akademik.deleteSchedule(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

// Grade categories
akademikRouter.get('/api/v1/grade-categories', requireAuth, async (req, res, next) => {
  try {
    const q = ListGradeCategoriesQuerySchema.parse(req.query)
    res.json(ok(await akademik.listGradeCategories(q)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.post('/api/v1/grade-categories', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const body = CreateGradeCategoryBodySchema.parse(req.body)
    res.json(ok(await akademik.createGradeCategory(body)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.patch('/api/v1/grade-categories/:id', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = PatchGradeCategoryBodySchema.parse(req.body)
    res.json(ok(await akademik.updateGradeCategory(id, body)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.delete('/api/v1/grade-categories/:id', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await akademik.deleteGradeCategory(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

// Gradebook
akademikRouter.get('/api/v1/gradebook', requireAuth, async (req, res, next) => {
  try {
    const q = GetGradebookQuerySchema.parse(req.query)
    res.json(ok(await akademik.getGradebook(q)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.post('/api/v1/gradebook/score', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const body = UpsertGradeScoreBodySchema.parse(req.body)
    res.json(ok(await akademik.upsertGradeScore(body)))
  } catch (e) {
    next(e)
  }
})

akademikRouter.post('/api/v1/gradebook/status', requireAuth, requireRole(['ADMIN', 'TU', 'GURU']), async (req, res, next) => {
  try {
    const body = SetGradebookStatusBodySchema.parse(req.body)
    await akademik.setGradebookStatus(body)
    res.json(ok(true))
  } catch (e) {
    next(e)
  }
})

