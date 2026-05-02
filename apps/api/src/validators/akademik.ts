import { z } from 'zod'

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Format tanggal harus YYYY-MM-DD.' })

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

export const ListAdministrativeSchedulesQuerySchema = z
  .object({
    tanggal: z.string().optional().default(''),
    dari: z.string().optional().default(''),
    sampai: z.string().optional().default(''),
  })
  .superRefine((q, ctx) => {
    const t = q.tanggal.trim()
    const d = q.dari.trim()
    const s = q.sampai.trim()
    if (t) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) {
        ctx.addIssue({ code: 'custom', message: 'Format tanggal harus YYYY-MM-DD.', path: ['tanggal'] })
      }
      return
    }
    if (!d && !s) return
    if (!d || !s) {
      ctx.addIssue({ code: 'custom', message: 'Parameter dari dan sampai harus diisi bersamaan.', path: ['dari'] })
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      ctx.addIssue({ code: 'custom', message: 'dari/sampai harus YYYY-MM-DD.', path: ['dari'] })
    } else if (d > s) {
      ctx.addIssue({ code: 'custom', message: 'Tanggal awal tidak boleh setelah akhir.', path: ['dari'] })
    }
  })

export const CreateAdministrativeScheduleBodySchema = z.object({
  tanggal: isoDate,
  jam: z.string().min(1),
  judul: z.string().min(1),
  lokasi: z.string().min(1),
})

export const PatchAdministrativeScheduleBodySchema = CreateAdministrativeScheduleBodySchema.partial()

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

