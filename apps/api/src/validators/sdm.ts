import { z } from 'zod'

export const EmployeeTypeSchema = z.enum(['guru', 'karyawan'])
export const SdmStatusSchema = z.enum(['aktif', 'cuti', 'nonaktif'])

export const ListEmployeesQuerySchema = z.object({
  q: z.string().optional().default(''),
  tipe: z.union([EmployeeTypeSchema, z.literal('')]).optional().default(''),
  status: z.union([SdmStatusSchema, z.literal('')]).optional().default(''),
})

export const CreateEmployeeBodySchema = z.object({
  nip: z.string(),
  nama: z.string(),
  tipe: EmployeeTypeSchema,
  noHp: z.string(),
  email: z.string().optional(),
  status: SdmStatusSchema,
})

export const PatchEmployeeBodySchema = z.object({
  nip: z.string().optional(),
  nama: z.string().optional(),
  tipe: EmployeeTypeSchema.optional(),
  noHp: z.string().optional(),
  email: z.string().optional(),
  status: SdmStatusSchema.optional(),
})

export const ListStudentsQuerySchema = z.object({
  q: z.string().optional().default(''),
  kelasId: z.string().optional().default(''),
  jurusanId: z.string().optional().default(''),
  status: z.union([SdmStatusSchema, z.literal('')]).optional().default(''),
})

export const CreateStudentBodySchema = z.object({
  nis: z.string(),
  nama: z.string(),
  kelasId: z.string().optional(),
  jurusanId: z.string().optional(),
  noHp: z.string().optional(),
  status: SdmStatusSchema,
})

export const PatchStudentBodySchema = z.object({
  nis: z.string().optional(),
  nama: z.string().optional(),
  kelasId: z.string().optional(),
  jurusanId: z.string().optional(),
  noHp: z.string().optional(),
  status: SdmStatusSchema.optional(),
})

