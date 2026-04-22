import { z } from 'zod'

export const WeekdaySchema = z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'])
export const ScheduleStatusSchema = z.enum(['aktif', 'bentrok'])
export const GradebookStatusSchema = z.enum(['draft', 'published'])

export const ListTeachingSlotsQuerySchema = z.object({
  guruId: z.string().optional().default(''),
  hari: z.union([WeekdaySchema, z.literal('')]).optional().default(''),
})

export const CreateTeachingSlotBodySchema = z.object({
  guruId: z.string(),
  hari: WeekdaySchema,
  mulai: z.string(),
  selesai: z.string(),
  keterangan: z.string(),
})

export const PatchTeachingSlotBodySchema = z.object({
  guruId: z.string().optional(),
  hari: WeekdaySchema.optional(),
  mulai: z.string().optional(),
  selesai: z.string().optional(),
  keterangan: z.string().optional(),
})

export const ListSchedulesQuerySchema = z.object({
  tahunAkademikId: z.string().optional().default(''),
  kelasId: z.string().optional().default(''),
})

export const CreateScheduleBodySchema = z.object({
  tahunAkademikId: z.string(),
  kelasId: z.string(),
  hari: WeekdaySchema,
  mulai: z.string(),
  selesai: z.string(),
  mapelId: z.string(),
  guruId: z.string(),
  ruang: z.string(),
  status: ScheduleStatusSchema,
})

export const PatchScheduleBodySchema = CreateScheduleBodySchema.partial()

export const ListGradeCategoriesQuerySchema = z.object({
  tahunAkademikId: z.string(),
  kelasId: z.string(),
  mapelId: z.string(),
})

export const CreateGradeCategoryBodySchema = z.object({
  tahunAkademikId: z.string(),
  kelasId: z.string(),
  mapelId: z.string(),
  nama: z.string(),
  bobot: z.number(),
  keterangan: z.string().optional(),
})

export const PatchGradeCategoryBodySchema = CreateGradeCategoryBodySchema.partial()

export const GetGradebookQuerySchema = ListGradeCategoriesQuerySchema

export const UpsertGradeScoreBodySchema = z.object({
  tahunAkademikId: z.string(),
  kelasId: z.string(),
  mapelId: z.string(),
  siswaId: z.string(),
  categoryId: z.string(),
  score: z.number().nullable(),
})

export const SetGradebookStatusBodySchema = z.object({
  tahunAkademikId: z.string(),
  kelasId: z.string(),
  mapelId: z.string(),
  status: GradebookStatusSchema,
})

