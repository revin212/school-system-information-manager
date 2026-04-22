import { z } from 'zod'

export const SchoolLevelSchema = z.enum(['sd', 'smp', 'sma'])

export const PatchSchoolIdentityBodySchema = z
  .object({
    namaSekolah: z.string().optional(),
    npsn: z.string().optional(),
    jenjang: SchoolLevelSchema.optional(),
    alamat: z.string().optional(),
    provinsi: z.string().optional(),
    kota: z.string().optional(),
    email: z.string().optional(),
    telepon: z.string().optional(),
    logoDataUrl: z.string().optional().nullable(),
    statusAktif: z.boolean().optional(),
    terverifikasi: z.boolean().optional(),
  })
  .partial()

