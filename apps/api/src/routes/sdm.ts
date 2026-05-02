import { Router } from 'express'
import { z } from 'zod'
import { ok } from '../http/respond'
import { requireAuth, requireRole } from '../middlewares/auth'
import {
  CreateEmployeeBodySchema,
  CreateStudentBodySchema,
  ListEmployeesQuerySchema,
  ListStudentsQuerySchema,
  PatchEmployeeBodySchema,
  PatchStudentBodySchema,
} from '../validators/sdm'
import * as sdm from '../services/sdm'

export const sdmRouter = Router()

// Employees
sdmRouter.get('/api/v1/employees', requireAuth, async (req, res, next) => {
  try {
    const q = ListEmployeesQuerySchema.parse(req.query)
    res.json(ok(await sdm.listEmployees(q)))
  } catch (e) {
    next(e)
  }
})

sdmRouter.post('/api/v1/employees', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const body = CreateEmployeeBodySchema.parse(req.body)
    res.json(ok(await sdm.createEmployee(body)))
  } catch (e) {
    next(e)
  }
})

sdmRouter.patch('/api/v1/employees/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = PatchEmployeeBodySchema.parse(req.body)
    res.json(ok(await sdm.updateEmployee(id, body)))
  } catch (e) {
    next(e)
  }
})

sdmRouter.delete('/api/v1/employees/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await sdm.deleteEmployee(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

// Students
sdmRouter.get('/api/v1/students', requireAuth, async (req, res, next) => {
  try {
    const q = ListStudentsQuerySchema.parse(req.query)
    res.json(ok(await sdm.listStudents(q)))
  } catch (e) {
    next(e)
  }
})

sdmRouter.post('/api/v1/students', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const body = CreateStudentBodySchema.parse(req.body)
    res.json(ok(await sdm.createStudent(body)))
  } catch (e) {
    next(e)
  }
})

sdmRouter.patch('/api/v1/students/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    const body = PatchStudentBodySchema.parse(req.body)
    res.json(ok(await sdm.updateStudent(id, body)))
  } catch (e) {
    next(e)
  }
})

sdmRouter.delete('/api/v1/students/:id', requireAuth, requireRole(['ADMIN', 'TU', 'KEPSEK']), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id)
    await sdm.deleteStudent(id)
    res.json(ok(null))
  } catch (e) {
    next(e)
  }
})

