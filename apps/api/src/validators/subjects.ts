import { z } from 'zod'

export const SubjectStatusSchema = z.enum(['aktif', 'nonaktif'])

export const ListSubjectsQuerySchema = z.object({
  q: z.string().optional().default(''),
  status: z.union([SubjectStatusSchema, z.literal('')]).optional().default(''),
})

export const UpsertSubjectBodySchema = z.object({
  kode: z.string().optional(),
  nama: z.string().optional(),
  status: SubjectStatusSchema.optional(),
})

export const CreateSubjectBodySchema = z.object({
  kode: z.string(),
  nama: z.string(),
  status: SubjectStatusSchema,
})

