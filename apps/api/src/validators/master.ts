import { z } from 'zod'

export const ActiveStatusSchema = z.enum(['aktif', 'nonaktif'])
export const ClassLevelSchema = z.enum(['X', 'XI', 'XII'])

export const ListWithQStatusSchema = z.object({
  q: z.string().optional().default(''),
  status: z.union([ActiveStatusSchema, z.literal('')]).optional().default(''),
})

export const CreateMajorBodySchema = z.object({
  kode: z.string(),
  nama: z.string(),
  status: ActiveStatusSchema,
})
export const PatchMajorBodySchema = z.object({
  kode: z.string().optional(),
  nama: z.string().optional(),
  status: ActiveStatusSchema.optional(),
})

export const ListClassesQuerySchema = z.object({
  q: z.string().optional().default(''),
  status: z.union([ActiveStatusSchema, z.literal('')]).optional().default(''),
  tingkat: z.union([ClassLevelSchema, z.literal('')]).optional().default(''),
})

export const CreateClassBodySchema = z.object({
  nama: z.string(),
  tingkat: ClassLevelSchema,
  jurusanId: z.string().optional(),
  status: ActiveStatusSchema,
})
export const PatchClassBodySchema = z.object({
  nama: z.string().optional(),
  tingkat: ClassLevelSchema.optional(),
  jurusanId: z.string().optional(),
  status: ActiveStatusSchema.optional(),
})

export const CreateAcademicYearBodySchema = z.object({
  nama: z.string(),
  status: ActiveStatusSchema,
})
export const PatchAcademicYearBodySchema = z.object({
  nama: z.string().optional(),
  status: ActiveStatusSchema.optional(),
})

