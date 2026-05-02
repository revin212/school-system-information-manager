import {
  ACADEMIC_YEARS_FIXTURE,
  CLASSES_FIXTURE,
  EMPLOYEES_FIXTURE,
  GRADE_CATEGORIES_FIXTURE,
  GRADE_ENTRIES_FIXTURE,
  MAJORS_FIXTURE,
  PAYROLL_SLIPS_FIXTURE,
  SCHOOL_IDENTITY_FIXTURE,
  SCHEDULES_FIXTURE,
  SPP_INVOICES_FIXTURE,
  SPP_PAYMENTS_FIXTURE,
  STUDENTS_FIXTURE,
  SUBJECTS_FIXTURE,
  TEACHING_SLOTS_FIXTURE,
} from './fixtures'
import { loadDb, saveDb } from './storage'
import type {
  AcademicYear,
  AcademicYearStatus,
  ClassLevel,
  ClassStatus,
  Employee,
  EmployeeStatus,
  EmployeeType,
  GradeCategory,
  GradeEntry,
  GradebookStatus,
  Major,
  MajorStatus,
  PayrollSlip,
  PayrollStatus,
  SchoolClass,
  SchoolIdentity,
  SchoolLevel,
  ScheduleItem,
  SppInvoice,
  SppInvoiceStatus,
  SppPayment,
  SppPaymentMethod,
  Student,
  StudentStatus,
  Subject,
  SubjectStatus,
  TeachingSlot,
  AdministrativeSchedule,
  Weekday,
} from './types'

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

type Db = {
  subjects: Subject[]
  majors: Major[]
  classes: SchoolClass[]
  academicYears: AcademicYear[]
  employees: Employee[]
  students: Student[]
  teachingSlots: TeachingSlot[]
  administrativeSchedules: AdministrativeSchedule[]
  schedules: ScheduleItem[]
  gradeCategories: GradeCategory[]
  gradeEntries: GradeEntry[]
  sppInvoices: SppInvoice[]
  sppPayments: SppPayment[]
  payrollSlips: PayrollSlip[]
  schoolIdentity: SchoolIdentity
}

const db: Db = initDb()

function initDb(): Db {
  const stored = loadDb()
  const subjects = (stored?.subjects?.length ? (stored.subjects as Subject[]) : SUBJECTS_FIXTURE) ?? SUBJECTS_FIXTURE
  const majors = (stored?.majors?.length ? (stored.majors as Major[]) : MAJORS_FIXTURE) ?? MAJORS_FIXTURE
  const classes = (stored?.classes?.length ? (stored.classes as SchoolClass[]) : CLASSES_FIXTURE) ?? CLASSES_FIXTURE
  const academicYears =
    (stored?.academicYears?.length ? (stored.academicYears as AcademicYear[]) : ACADEMIC_YEARS_FIXTURE) ??
    ACADEMIC_YEARS_FIXTURE
  const employees =
    (stored?.employees?.length ? (stored.employees as Employee[]) : EMPLOYEES_FIXTURE) ?? EMPLOYEES_FIXTURE
  const students =
    (stored?.students?.length ? (stored.students as Student[]) : STUDENTS_FIXTURE) ?? STUDENTS_FIXTURE
  const teachingSlots =
    (stored?.teachingSlots?.length ? (stored.teachingSlots as TeachingSlot[]) : TEACHING_SLOTS_FIXTURE) ??
    TEACHING_SLOTS_FIXTURE
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = (() => {
    const d = new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  })()
  const nowClient = new Date().toISOString()
  const defaultAdminSchedules: AdministrativeSchedule[] = [
    { id: 'adm_1', tanggal: todayStr, jam: '08:00', judul: 'Rapat Evaluasi Kurikulum', lokasi: 'Ruang Guru', dibuatPada: nowClient, diubahPada: nowClient },
    { id: 'adm_2', tanggal: todayStr, jam: '10:30', judul: 'Pertemuan Orang Tua Siswa (X MIPA 1)', lokasi: 'Aula Utama', dibuatPada: nowClient, diubahPada: nowClient },
    { id: 'adm_3', tanggal: todayStr, jam: '13:00', judul: 'Pengecekan Fasilitas Laboratorium', lokasi: 'Lab Biologi', dibuatPada: nowClient, diubahPada: nowClient },
  ]
  const administrativeSchedules =
    (stored?.administrativeSchedules?.length
      ? (stored.administrativeSchedules as AdministrativeSchedule[])
      : defaultAdminSchedules) ?? defaultAdminSchedules
  const schedules =
    (stored?.schedules?.length ? (stored.schedules as ScheduleItem[]) : SCHEDULES_FIXTURE) ?? SCHEDULES_FIXTURE
  const gradeCategories =
    (stored?.gradeCategories?.length ? (stored.gradeCategories as GradeCategory[]) : GRADE_CATEGORIES_FIXTURE) ??
    GRADE_CATEGORIES_FIXTURE
  const gradeEntries =
    (stored?.gradeEntries?.length ? (stored.gradeEntries as GradeEntry[]) : GRADE_ENTRIES_FIXTURE) ??
    GRADE_ENTRIES_FIXTURE

  const sppInvoices =
    (stored?.sppInvoices?.length ? (stored.sppInvoices as SppInvoice[]) : SPP_INVOICES_FIXTURE) ?? SPP_INVOICES_FIXTURE
  const sppPayments =
    (stored?.sppPayments?.length ? (stored.sppPayments as SppPayment[]) : SPP_PAYMENTS_FIXTURE) ?? SPP_PAYMENTS_FIXTURE
  const payrollSlips =
    (stored?.payrollSlips?.length ? (stored.payrollSlips as PayrollSlip[]) : PAYROLL_SLIPS_FIXTURE) ??
    PAYROLL_SLIPS_FIXTURE
  const schoolIdentity =
    (stored?.schoolIdentity ? (stored.schoolIdentity as SchoolIdentity) : SCHOOL_IDENTITY_FIXTURE) ?? SCHOOL_IDENTITY_FIXTURE

  const initial = {
    subjects,
    majors,
    classes,
    academicYears,
    employees,
    students,
    teachingSlots,
    administrativeSchedules,
    schedules,
    gradeCategories,
    gradeEntries,
    sppInvoices,
    sppPayments,
    payrollSlips,
    schoolIdentity,
  }
  saveDb(initial)
  return initial
}

function persist() {
  saveDb({
    subjects: db.subjects,
    majors: db.majors,
    classes: db.classes,
    academicYears: db.academicYears,
    employees: db.employees,
    students: db.students,
    teachingSlots: db.teachingSlots,
    administrativeSchedules: db.administrativeSchedules,
    schedules: db.schedules,
    gradeCategories: db.gradeCategories,
    gradeEntries: db.gradeEntries,
    sppInvoices: db.sppInvoices,
    sppPayments: db.sppPayments,
    payrollSlips: db.payrollSlips,
    schoolIdentity: db.schoolIdentity,
  })
}

export type ListSubjectsParams = {
  q?: string
  status?: SubjectStatus | ''
}

export async function listSubjects(params: ListSubjectsParams): Promise<Subject[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const q = (params.q ?? '').trim().toLowerCase()
  const status = params.status ?? ''
  return db.subjects
    .filter((s) => (status ? s.status === status : true))
    .filter((s) => (q ? s.kode.toLowerCase().includes(q) || s.nama.toLowerCase().includes(q) : true))
    .sort((a, b) => a.kode.localeCompare(b.kode))
}

export async function createSubject(input: {
  kode: string
  nama: string
  status: SubjectStatus
}): Promise<Subject> {
  await delay(240 + Math.round(Math.random() * 260))
  const kode = input.kode.trim()
  const nama = input.nama.trim()
  if (!kode || !nama) throw new Error('Kode dan nama pelajaran wajib diisi.')

  if (db.subjects.some((s) => s.kode.toLowerCase() === kode.toLowerCase())) {
    throw new Error('Kode mata pelajaran sudah digunakan.')
  }

  const now = new Date().toISOString()
  const subject: Subject = {
    id: uid('subj'),
    kode,
    nama,
    status: input.status,
    dibuatPada: now,
    diubahPada: now,
  }
  db.subjects = [subject, ...db.subjects]
  persist()
  return subject
}

export async function updateSubject(id: string, patch: Partial<Pick<Subject, 'kode' | 'nama' | 'status'>>): Promise<Subject> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.subjects.findIndex((s) => s.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')

  const current = db.subjects[idx]
  const nextKode = (patch.kode ?? current.kode).trim()
  const nextNama = (patch.nama ?? current.nama).trim()
  const nextStatus = patch.status ?? current.status

  if (!nextKode || !nextNama) throw new Error('Kode dan nama pelajaran wajib diisi.')
  if (db.subjects.some((s) => s.id !== id && s.kode.toLowerCase() === nextKode.toLowerCase())) {
    throw new Error('Kode mata pelajaran sudah digunakan.')
  }

  const updated: Subject = {
    ...current,
    kode: nextKode,
    nama: nextNama,
    status: nextStatus,
    diubahPada: new Date().toISOString(),
  }
  db.subjects[idx] = updated
  persist()
  return updated
}

export async function deleteSubject(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  db.subjects = db.subjects.filter((s) => s.id !== id)
  persist()
}

// =========================
// Jurusan
// =========================

export type ListMajorsParams = {
  q?: string
  status?: MajorStatus | ''
}

export async function listMajors(params: ListMajorsParams): Promise<Major[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const q = (params.q ?? '').trim().toLowerCase()
  const status = params.status ?? ''
  return db.majors
    .filter((m) => (status ? m.status === status : true))
    .filter((m) => (q ? m.kode.toLowerCase().includes(q) || m.nama.toLowerCase().includes(q) : true))
    .sort((a, b) => a.kode.localeCompare(b.kode))
}

export async function createMajor(input: { kode: string; nama: string; status: MajorStatus }): Promise<Major> {
  await delay(240 + Math.round(Math.random() * 260))
  const kode = input.kode.trim()
  const nama = input.nama.trim()
  if (!kode || !nama) throw new Error('Kode dan nama jurusan wajib diisi.')
  if (db.majors.some((m) => m.kode.toLowerCase() === kode.toLowerCase())) {
    throw new Error('Kode jurusan sudah digunakan.')
  }
  const now = new Date().toISOString()
  const major: Major = { id: uid('maj'), kode, nama, status: input.status, dibuatPada: now, diubahPada: now }
  db.majors = [major, ...db.majors]
  persist()
  return major
}

export async function updateMajor(
  id: string,
  patch: Partial<Pick<Major, 'kode' | 'nama' | 'status'>>,
): Promise<Major> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.majors.findIndex((m) => m.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')

  const current = db.majors[idx]
  const nextKode = (patch.kode ?? current.kode).trim()
  const nextNama = (patch.nama ?? current.nama).trim()
  const nextStatus = patch.status ?? current.status

  if (!nextKode || !nextNama) throw new Error('Kode dan nama jurusan wajib diisi.')
  if (db.majors.some((m) => m.id !== id && m.kode.toLowerCase() === nextKode.toLowerCase())) {
    throw new Error('Kode jurusan sudah digunakan.')
  }

  const updated: Major = { ...current, kode: nextKode, nama: nextNama, status: nextStatus, diubahPada: new Date().toISOString() }
  db.majors[idx] = updated
  persist()
  return updated
}

export async function deleteMajor(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  // soft guard: if still referenced by classes, block delete
  if (db.classes.some((c) => c.jurusanId === id)) {
    throw new Error('Jurusan masih digunakan oleh data kelas.')
  }
  db.majors = db.majors.filter((m) => m.id !== id)
  persist()
}

// =========================
// Kelas
// =========================

export type ListClassesParams = {
  q?: string
  status?: ClassStatus | ''
  tingkat?: ClassLevel | ''
}

export async function listClasses(params: ListClassesParams): Promise<SchoolClass[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const q = (params.q ?? '').trim().toLowerCase()
  const status = params.status ?? ''
  const tingkat = params.tingkat ?? ''
  return db.classes
    .filter((c) => (status ? c.status === status : true))
    .filter((c) => (tingkat ? c.tingkat === tingkat : true))
    .filter((c) => (q ? c.nama.toLowerCase().includes(q) : true))
    .sort((a, b) => a.nama.localeCompare(b.nama))
}

export async function createClass(input: {
  nama: string
  tingkat: ClassLevel
  jurusanId?: string
  status: ClassStatus
}): Promise<SchoolClass> {
  await delay(240 + Math.round(Math.random() * 260))
  const nama = input.nama.trim()
  if (!nama) throw new Error('Nama kelas wajib diisi.')
  if (db.classes.some((c) => c.nama.toLowerCase() === nama.toLowerCase())) {
    throw new Error('Nama kelas sudah digunakan.')
  }
  const now = new Date().toISOString()
  const schoolClass: SchoolClass = {
    id: uid('cls'),
    nama,
    tingkat: input.tingkat,
    jurusanId: input.jurusanId || undefined,
    status: input.status,
    dibuatPada: now,
    diubahPada: now,
  }
  db.classes = [schoolClass, ...db.classes]
  persist()
  return schoolClass
}

export async function updateClass(
  id: string,
  patch: Partial<Pick<SchoolClass, 'nama' | 'tingkat' | 'jurusanId' | 'status'>>,
): Promise<SchoolClass> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.classes.findIndex((c) => c.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')
  const current = db.classes[idx]
  const nextNama = (patch.nama ?? current.nama).trim()
  if (!nextNama) throw new Error('Nama kelas wajib diisi.')
  if (db.classes.some((c) => c.id !== id && c.nama.toLowerCase() === nextNama.toLowerCase())) {
    throw new Error('Nama kelas sudah digunakan.')
  }
  const updated: SchoolClass = {
    ...current,
    nama: nextNama,
    tingkat: patch.tingkat ?? current.tingkat,
    jurusanId: patch.jurusanId ?? current.jurusanId,
    status: patch.status ?? current.status,
    diubahPada: new Date().toISOString(),
  }
  db.classes[idx] = updated
  persist()
  return updated
}

export async function deleteClass(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  db.classes = db.classes.filter((c) => c.id !== id)
  persist()
}

// =========================
// Tahun Akademik
// =========================

export type ListAcademicYearsParams = {
  q?: string
  status?: AcademicYearStatus | ''
}

export async function listAcademicYears(params: ListAcademicYearsParams): Promise<AcademicYear[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const q = (params.q ?? '').trim().toLowerCase()
  const status = params.status ?? ''
  return db.academicYears
    .filter((y) => (status ? y.status === status : true))
    .filter((y) => (q ? y.nama.toLowerCase().includes(q) : true))
    .sort((a, b) => b.nama.localeCompare(a.nama))
}

export async function createAcademicYear(input: { nama: string; status: AcademicYearStatus }): Promise<AcademicYear> {
  await delay(240 + Math.round(Math.random() * 260))
  const nama = input.nama.trim()
  if (!nama) throw new Error('Nama tahun akademik wajib diisi.')
  if (db.academicYears.some((y) => y.nama.toLowerCase() === nama.toLowerCase())) {
    throw new Error('Tahun akademik sudah ada.')
  }
  const now = new Date().toISOString()
  const year: AcademicYear = { id: uid('ay'), nama, status: input.status, dibuatPada: now, diubahPada: now }
  db.academicYears = [year, ...db.academicYears]
  persist()
  return year
}

export async function updateAcademicYear(
  id: string,
  patch: Partial<Pick<AcademicYear, 'nama' | 'status'>>,
): Promise<AcademicYear> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.academicYears.findIndex((y) => y.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')
  const current = db.academicYears[idx]
  const nextNama = (patch.nama ?? current.nama).trim()
  if (!nextNama) throw new Error('Nama tahun akademik wajib diisi.')
  if (db.academicYears.some((y) => y.id !== id && y.nama.toLowerCase() === nextNama.toLowerCase())) {
    throw new Error('Tahun akademik sudah ada.')
  }
  const updated: AcademicYear = { ...current, nama: nextNama, status: patch.status ?? current.status, diubahPada: new Date().toISOString() }
  db.academicYears[idx] = updated
  persist()
  return updated
}

export async function deleteAcademicYear(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  db.academicYears = db.academicYears.filter((y) => y.id !== id)
  persist()
}

// =========================
// SDM: Guru & Karyawan
// =========================

export type ListEmployeesParams = {
  q?: string
  tipe?: EmployeeType | ''
  status?: EmployeeStatus | ''
}

export async function listEmployees(params: ListEmployeesParams): Promise<Employee[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const q = (params.q ?? '').trim().toLowerCase()
  const tipe = params.tipe ?? ''
  const status = params.status ?? ''
  return db.employees
    .filter((e) => (tipe ? e.tipe === tipe : true))
    .filter((e) => (status ? e.status === status : true))
    .filter((e) => (q ? e.nip.includes(q) || e.nama.toLowerCase().includes(q) : true))
    .sort((a, b) => a.nama.localeCompare(b.nama))
}

export async function createEmployee(input: {
  nip: string
  nama: string
  tipe: EmployeeType
  noHp: string
  email?: string
  status: EmployeeStatus
}): Promise<Employee> {
  await delay(240 + Math.round(Math.random() * 260))
  const nip = input.nip.trim()
  const nama = input.nama.trim()
  const noHp = input.noHp.trim()
  if (!nip || !nama) throw new Error('NIP dan nama wajib diisi.')
  if (db.employees.some((e) => e.nip === nip)) throw new Error('NIP sudah digunakan.')
  const now = new Date().toISOString()
  const employee: Employee = {
    id: uid('emp'),
    nip,
    nama,
    tipe: input.tipe,
    noHp,
    email: input.email?.trim() || undefined,
    status: input.status,
    dibuatPada: now,
    diubahPada: now,
  }
  db.employees = [employee, ...db.employees]
  persist()
  return employee
}

export async function updateEmployee(
  id: string,
  patch: Partial<Pick<Employee, 'nip' | 'nama' | 'tipe' | 'noHp' | 'email' | 'status'>>,
): Promise<Employee> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.employees.findIndex((e) => e.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')
  const current = db.employees[idx]
  const nextNip = (patch.nip ?? current.nip).trim()
  const nextNama = (patch.nama ?? current.nama).trim()
  const nextNoHp = (patch.noHp ?? current.noHp).trim()
  if (!nextNip || !nextNama) throw new Error('NIP dan nama wajib diisi.')
  if (db.employees.some((e) => e.id !== id && e.nip === nextNip)) throw new Error('NIP sudah digunakan.')
  const updated: Employee = {
    ...current,
    nip: nextNip,
    nama: nextNama,
    tipe: patch.tipe ?? current.tipe,
    noHp: nextNoHp,
    email: (patch.email ?? current.email)?.trim() || undefined,
    status: patch.status ?? current.status,
    diubahPada: new Date().toISOString(),
  }
  db.employees[idx] = updated
  persist()
  return updated
}

export async function deleteEmployee(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  db.employees = db.employees.filter((e) => e.id !== id)
  persist()
}

// =========================
// SDM: Data Siswa
// =========================

export type ListStudentsParams = {
  q?: string
  kelasId?: string | ''
  jurusanId?: string | ''
  status?: StudentStatus | ''
}

export async function listStudents(params: ListStudentsParams): Promise<Student[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const q = (params.q ?? '').trim().toLowerCase()
  const kelasId = params.kelasId ?? ''
  const jurusanId = params.jurusanId ?? ''
  const status = params.status ?? ''
  return db.students
    .filter((s) => (kelasId ? s.kelasId === kelasId : true))
    .filter((s) => (jurusanId ? s.jurusanId === jurusanId : true))
    .filter((s) => (status ? s.status === status : true))
    .filter((s) => (q ? s.nis.includes(q) || s.nama.toLowerCase().includes(q) : true))
    .sort((a, b) => a.nama.localeCompare(b.nama))
}

export async function createStudent(input: {
  nis: string
  nama: string
  kelasId?: string
  jurusanId?: string
  noHp?: string
  status: StudentStatus
}): Promise<Student> {
  await delay(240 + Math.round(Math.random() * 260))
  const nis = input.nis.trim()
  const nama = input.nama.trim()
  if (!nis || !nama) throw new Error('NIS dan nama siswa wajib diisi.')
  if (db.students.some((s) => s.nis === nis)) throw new Error('NIS sudah digunakan.')
  const now = new Date().toISOString()
  const student: Student = {
    id: uid('stu'),
    nis,
    nama,
    kelasId: input.kelasId || undefined,
    jurusanId: input.jurusanId || undefined,
    noHp: input.noHp?.trim() || undefined,
    status: input.status,
    dibuatPada: now,
    diubahPada: now,
  }
  db.students = [student, ...db.students]
  persist()
  return student
}

export async function updateStudent(
  id: string,
  patch: Partial<Pick<Student, 'nis' | 'nama' | 'kelasId' | 'jurusanId' | 'noHp' | 'status'>>,
): Promise<Student> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.students.findIndex((s) => s.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')
  const current = db.students[idx]
  const nextNis = (patch.nis ?? current.nis).trim()
  const nextNama = (patch.nama ?? current.nama).trim()
  if (!nextNis || !nextNama) throw new Error('NIS dan nama siswa wajib diisi.')
  if (db.students.some((s) => s.id !== id && s.nis === nextNis)) throw new Error('NIS sudah digunakan.')
  const updated: Student = {
    ...current,
    nis: nextNis,
    nama: nextNama,
    kelasId: patch.kelasId ?? current.kelasId,
    jurusanId: patch.jurusanId ?? current.jurusanId,
    noHp: (patch.noHp ?? current.noHp)?.trim() || undefined,
    status: patch.status ?? current.status,
    diubahPada: new Date().toISOString(),
  }
  db.students[idx] = updated
  persist()
  return updated
}

export async function deleteStudent(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  db.students = db.students.filter((s) => s.id !== id)
  persist()
}

// =========================
// Akademik: Waktu Mengajar
// =========================

export type ListTeachingSlotsParams = {
  guruId?: string | ''
  hari?: Weekday | ''
}

export async function listTeachingSlots(params: ListTeachingSlotsParams): Promise<TeachingSlot[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const guruId = params.guruId ?? ''
  const hari = params.hari ?? ''
  return db.teachingSlots
    .filter((s) => (guruId ? s.guruId === guruId : true))
    .filter((s) => (hari ? s.hari === hari : true))
    .sort((a, b) => `${a.hari} ${a.mulai}`.localeCompare(`${b.hari} ${b.mulai}`))
}

export async function createTeachingSlot(input: {
  guruId: string
  hari: Weekday
  mulai: string
  selesai: string
  keterangan: string
}): Promise<TeachingSlot> {
  await delay(240 + Math.round(Math.random() * 260))
  if (!input.guruId) throw new Error('Guru wajib dipilih.')
  const keterangan = input.keterangan.trim()
  if (!keterangan) throw new Error('Keterangan wajib diisi.')
  const now = new Date().toISOString()
  const slot: TeachingSlot = {
    id: uid('ts'),
    guruId: input.guruId,
    hari: input.hari,
    mulai: input.mulai,
    selesai: input.selesai,
    keterangan,
    dibuatPada: now,
    diubahPada: now,
  }
  db.teachingSlots = [slot, ...db.teachingSlots]
  persist()
  return slot
}

export async function updateTeachingSlot(
  id: string,
  patch: Partial<Pick<TeachingSlot, 'guruId' | 'hari' | 'mulai' | 'selesai' | 'keterangan'>>,
): Promise<TeachingSlot> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.teachingSlots.findIndex((s) => s.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')
  const current = db.teachingSlots[idx]
  const updated: TeachingSlot = {
    ...current,
    guruId: patch.guruId ?? current.guruId,
    hari: patch.hari ?? current.hari,
    mulai: patch.mulai ?? current.mulai,
    selesai: patch.selesai ?? current.selesai,
    keterangan: (patch.keterangan ?? current.keterangan).trim(),
    diubahPada: new Date().toISOString(),
  }
  if (!updated.keterangan) throw new Error('Keterangan wajib diisi.')
  db.teachingSlots[idx] = updated
  persist()
  return updated
}

export async function deleteTeachingSlot(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  db.teachingSlots = db.teachingSlots.filter((s) => s.id !== id)
  persist()
}

// =========================
// Akademik: Jadwal Administratif
// =========================

export type ListAdministrativeSchedulesParams = {
  tanggal?: string
  dari?: string
  sampai?: string
}

export async function listAdministrativeSchedules(
  params: ListAdministrativeSchedulesParams,
): Promise<AdministrativeSchedule[]> {
  await delay(200 + Math.round(Math.random() * 200))
  const t = (params.tanggal ?? '').trim()
  if (t) {
    return db.administrativeSchedules
      .filter((x) => x.tanggal === t)
      .sort((a, b) => a.jam.localeCompare(b.jam))
  }
  const dari = (params.dari ?? '').trim()
  const sampai = (params.sampai ?? '').trim()
  if (dari && sampai) {
    return db.administrativeSchedules
      .filter((x) => x.tanggal >= dari && x.tanggal <= sampai)
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.jam.localeCompare(b.jam))
  }
  return []
}

export async function createAdministrativeSchedule(input: {
  tanggal: string
  jam: string
  judul: string
  lokasi: string
}): Promise<AdministrativeSchedule> {
  await delay(220 + Math.round(Math.random() * 220))
  const judul = input.judul.trim()
  const lokasi = input.lokasi.trim()
  if (!judul) throw new Error('Judul kegiatan wajib diisi.')
  if (!lokasi) throw new Error('Lokasi wajib diisi.')
  const now = new Date().toISOString()
  const row: AdministrativeSchedule = {
    id: uid('adm'),
    tanggal: input.tanggal,
    jam: input.jam,
    judul,
    lokasi,
    dibuatPada: now,
    diubahPada: now,
  }
  db.administrativeSchedules = [row, ...db.administrativeSchedules]
  persist()
  return row
}

export async function updateAdministrativeSchedule(
  id: string,
  patch: Partial<Pick<AdministrativeSchedule, 'tanggal' | 'jam' | 'judul' | 'lokasi'>>,
): Promise<AdministrativeSchedule> {
  await delay(200 + Math.round(Math.random() * 220))
  const idx = db.administrativeSchedules.findIndex((s) => s.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')
  const cur = db.administrativeSchedules[idx]
  const judul = (patch.judul ?? cur.judul).trim()
  const lokasi = (patch.lokasi ?? cur.lokasi).trim()
  if (!judul) throw new Error('Judul kegiatan wajib diisi.')
  if (!lokasi) throw new Error('Lokasi wajib diisi.')
  const updated: AdministrativeSchedule = {
    ...cur,
    tanggal: patch.tanggal ?? cur.tanggal,
    jam: patch.jam ?? cur.jam,
    judul,
    lokasi,
    diubahPada: new Date().toISOString(),
  }
  db.administrativeSchedules[idx] = updated
  persist()
  return updated
}

export async function deleteAdministrativeSchedule(id: string): Promise<void> {
  await delay(180 + Math.round(Math.random() * 200))
  db.administrativeSchedules = db.administrativeSchedules.filter((s) => s.id !== id)
  persist()
}

// =========================
// Akademik: Jadwal Pelajaran
// =========================

export type ListSchedulesParams = {
  tahunAkademikId?: string | ''
  kelasId?: string | ''
}

export async function listSchedules(params: ListSchedulesParams): Promise<ScheduleItem[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const tahun = params.tahunAkademikId ?? ''
  const kelas = params.kelasId ?? ''
  return db.schedules
    .filter((s) => (tahun ? s.tahunAkademikId === tahun : true))
    .filter((s) => (kelas ? s.kelasId === kelas : true))
    .sort((a, b) => `${a.hari} ${a.mulai}`.localeCompare(`${b.hari} ${b.mulai}`))
}

export async function createSchedule(input: Omit<ScheduleItem, 'id' | 'dibuatPada' | 'diubahPada'>): Promise<ScheduleItem> {
  await delay(240 + Math.round(Math.random() * 260))
  const now = new Date().toISOString()
  const item: ScheduleItem = { ...input, id: uid('sch'), dibuatPada: now, diubahPada: now }
  db.schedules = [item, ...db.schedules]
  persist()
  return item
}

export async function updateSchedule(
  id: string,
  patch: Partial<Omit<ScheduleItem, 'id' | 'dibuatPada' | 'diubahPada'>>,
): Promise<ScheduleItem> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.schedules.findIndex((s) => s.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')
  const current = db.schedules[idx]
  const updated: ScheduleItem = { ...current, ...patch, diubahPada: new Date().toISOString() }
  db.schedules[idx] = updated
  persist()
  return updated
}

export async function deleteSchedule(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  db.schedules = db.schedules.filter((s) => s.id !== id)
  persist()
}

// =========================
// Akademik: Kategori Nilai
// =========================

export type ListGradeCategoriesParams = {
  tahunAkademikId: string
  kelasId: string
  mapelId: string
}

export async function listGradeCategories(params: ListGradeCategoriesParams): Promise<GradeCategory[]> {
  await delay(220 + Math.round(Math.random() * 240))
  return db.gradeCategories
    .filter((c) => c.tahunAkademikId === params.tahunAkademikId)
    .filter((c) => c.kelasId === params.kelasId)
    .filter((c) => c.mapelId === params.mapelId)
    .sort((a, b) => a.nama.localeCompare(b.nama))
}

export async function createGradeCategory(input: Omit<GradeCategory, 'id' | 'dibuatPada' | 'diubahPada'>): Promise<GradeCategory> {
  await delay(240 + Math.round(Math.random() * 260))
  const nama = input.nama.trim()
  if (!nama) throw new Error('Nama kategori wajib diisi.')
  if (input.bobot <= 0) throw new Error('Bobot harus lebih dari 0%.')
  const now = new Date().toISOString()
  const cat: GradeCategory = { ...input, nama, id: uid('gc'), dibuatPada: now, diubahPada: now }
  db.gradeCategories = [cat, ...db.gradeCategories]
  persist()
  return cat
}

export async function updateGradeCategory(
  id: string,
  patch: Partial<Omit<GradeCategory, 'id' | 'dibuatPada' | 'diubahPada'>>,
): Promise<GradeCategory> {
  await delay(220 + Math.round(Math.random() * 260))
  const idx = db.gradeCategories.findIndex((c) => c.id === id)
  if (idx < 0) throw new Error('Data tidak ditemukan.')
  const current = db.gradeCategories[idx]
  const updated: GradeCategory = {
    ...current,
    ...patch,
    nama: (patch.nama ?? current.nama).trim(),
    diubahPada: new Date().toISOString(),
  }
  if (!updated.nama) throw new Error('Nama kategori wajib diisi.')
  db.gradeCategories[idx] = updated
  persist()
  return updated
}

export async function deleteGradeCategory(id: string): Promise<void> {
  await delay(200 + Math.round(Math.random() * 240))
  // remove scores referencing this category
  db.gradeEntries = db.gradeEntries.map((ge) => {
    const next = { ...ge, nilai: { ...ge.nilai } }
    delete next.nilai[id]
    return next
  })
  db.gradeCategories = db.gradeCategories.filter((c) => c.id !== id)
  persist()
}

// =========================
// Akademik: Penilaian
// =========================

export type GetGradebookParams = {
  tahunAkademikId: string
  kelasId: string
  mapelId: string
}

export async function getGradebook(params: GetGradebookParams): Promise<{
  categories: GradeCategory[]
  entries: GradeEntry[]
}> {
  await delay(220 + Math.round(Math.random() * 240))
  const categories = await listGradeCategories(params)
  const entries = db.gradeEntries
    .filter((e) => e.tahunAkademikId === params.tahunAkademikId)
    .filter((e) => e.kelasId === params.kelasId)
    .filter((e) => e.mapelId === params.mapelId)
  return { categories, entries }
}

export async function upsertGradeScore(input: {
  tahunAkademikId: string
  kelasId: string
  mapelId: string
  siswaId: string
  categoryId: string
  score: number | null
}): Promise<GradeEntry> {
  await delay(180 + Math.round(Math.random() * 220))
  const idx = db.gradeEntries.findIndex(
    (e) =>
      e.tahunAkademikId === input.tahunAkademikId &&
      e.kelasId === input.kelasId &&
      e.mapelId === input.mapelId &&
      e.siswaId === input.siswaId,
  )
  const now = new Date().toISOString()
  if (idx < 0) {
    const entry: GradeEntry = {
      id: uid('ge'),
      tahunAkademikId: input.tahunAkademikId,
      kelasId: input.kelasId,
      mapelId: input.mapelId,
      siswaId: input.siswaId,
      nilai: { [input.categoryId]: input.score },
      status: 'draft',
      dibuatPada: now,
      diubahPada: now,
    }
    db.gradeEntries = [entry, ...db.gradeEntries]
    persist()
    return entry
  }
  const current = db.gradeEntries[idx]
  const updated: GradeEntry = {
    ...current,
    nilai: { ...current.nilai, [input.categoryId]: input.score },
    diubahPada: now,
  }
  db.gradeEntries[idx] = updated
  persist()
  return updated
}

export async function setGradebookStatus(params: GetGradebookParams & { status: GradebookStatus }): Promise<void> {
  await delay(240 + Math.round(Math.random() * 260))
  db.gradeEntries = db.gradeEntries.map((e) => {
    if (
      e.tahunAkademikId === params.tahunAkademikId &&
      e.kelasId === params.kelasId &&
      e.mapelId === params.mapelId
    ) {
      return { ...e, status: params.status, diubahPada: new Date().toISOString() }
    }
    return e
  })
  persist()
}

// =========================
// Keuangan: Pembayaran SPP
// =========================

export type ListSppInvoicesParams = {
  q?: string
  kelasId?: string | ''
  status?: SppInvoiceStatus | ''
  bulan?: string | '' // "2023-09"
}

function computeSppStatus(inv: SppInvoice): SppInvoiceStatus {
  if (inv.dibayar >= inv.nominal) return 'lunas'
  const due = new Date(inv.jatuhTempo).getTime()
  const now = Date.now()
  if (now > due) return 'terlambat'
  return 'belum_lunas'
}

export async function listSppInvoices(params: ListSppInvoicesParams): Promise<SppInvoice[]> {
  await delay(240 + Math.round(Math.random() * 260))
  const q = (params.q ?? '').trim().toLowerCase()
  const kelasId = params.kelasId ?? ''
  const status = params.status ?? ''
  const bulan = params.bulan ?? ''

  return db.sppInvoices
    .map((inv) => {
      const statusNow = computeSppStatus(inv)
      return statusNow === inv.status ? inv : { ...inv, status: statusNow }
    })
    .filter((inv) => (kelasId ? inv.kelasId === kelasId : true))
    .filter((inv) => (bulan ? inv.bulan === bulan : true))
    .filter((inv) => (status ? inv.status === status : true))
    .filter((inv) => {
      if (!q) return true
      const stu = db.students.find((s) => s.id === inv.siswaId)
      const name = stu?.nama?.toLowerCase() ?? ''
      const nis = stu?.nis?.toLowerCase() ?? ''
      return name.includes(q) || nis.includes(q) || inv.bulan.includes(q)
    })
    .sort((a, b) => `${b.bulan} ${a.jatuhTempo}`.localeCompare(`${a.bulan} ${b.jatuhTempo}`))
}

export async function createSppPayment(input: {
  invoiceId: string
  metode: SppPaymentMethod
  nominal: number
  dibayarPada?: string
  catatan?: string
}): Promise<{ invoice: SppInvoice; payment: SppPayment }> {
  await delay(240 + Math.round(Math.random() * 260))
  const idx = db.sppInvoices.findIndex((i) => i.id === input.invoiceId)
  if (idx < 0) throw new Error('Tagihan tidak ditemukan.')
  const inv = db.sppInvoices[idx]

  const nominal = Math.max(0, Math.floor(input.nominal))
  if (nominal <= 0) throw new Error('Nominal pembayaran harus lebih dari 0.')

  const nowIso = input.dibayarPada ?? new Date().toISOString()

  const payment: SppPayment = {
    id: uid('spppay'),
    invoiceId: inv.id,
    siswaId: inv.siswaId,
    metode: input.metode,
    dibayarPada: nowIso,
    nominal,
    catatan: input.catatan?.trim() || undefined,
    dibuatPada: nowIso,
  }

  const nextDibayar = inv.dibayar + nominal
  const next: SppInvoice = {
    ...inv,
    dibayar: nextDibayar,
    status: nextDibayar >= inv.nominal ? 'lunas' : computeSppStatus({ ...inv, dibayar: nextDibayar }),
    lunasPada: nextDibayar >= inv.nominal ? nowIso : inv.lunasPada,
    diubahPada: new Date().toISOString(),
  }

  db.sppPayments = [payment, ...db.sppPayments]
  db.sppInvoices[idx] = next
  persist()
  return { invoice: next, payment }
}

export async function listSppPayments(params: { invoiceId?: string; siswaId?: string }): Promise<SppPayment[]> {
  await delay(220 + Math.round(Math.random() * 240))
  const invoiceId = params.invoiceId ?? ''
  const siswaId = params.siswaId ?? ''
  return db.sppPayments
    .filter((p) => (invoiceId ? p.invoiceId === invoiceId : true))
    .filter((p) => (siswaId ? p.siswaId === siswaId : true))
    .sort((a, b) => b.dibayarPada.localeCompare(a.dibayarPada))
}

// =========================
// Keuangan: Penggajian
// =========================

export type ListPayrollSlipsParams = {
  q?: string
  periode?: string | '' // "2023-11"
  status?: PayrollStatus | ''
}

export async function listPayrollSlips(params: ListPayrollSlipsParams): Promise<PayrollSlip[]> {
  await delay(240 + Math.round(Math.random() * 260))
  const q = (params.q ?? '').trim().toLowerCase()
  const periode = params.periode ?? ''
  const status = params.status ?? ''
  return db.payrollSlips
    .filter((s) => (periode ? s.periode === periode : true))
    .filter((s) => (status ? s.status === status : true))
    .filter((s) => {
      if (!q) return true
      const emp = db.employees.find((e) => e.id === s.pegawaiId)
      const name = emp?.nama?.toLowerCase() ?? ''
      const nip = emp?.nip?.toLowerCase() ?? ''
      return name.includes(q) || nip.includes(q)
    })
    .sort((a, b) => `${b.periode} ${a.status}`.localeCompare(`${a.periode} ${b.status}`))
}

export async function upsertPayrollSlip(input: {
  id?: string
  periode: string
  pegawaiId: string
  gajiPokok: number
  tunjangan: number
  potongan: number
  status: PayrollStatus
}): Promise<PayrollSlip> {
  await delay(240 + Math.round(Math.random() * 260))
  if (!input.periode) throw new Error('Periode wajib dipilih.')
  if (!input.pegawaiId) throw new Error('Pegawai wajib dipilih.')
  const gajiPokok = Math.max(0, Math.floor(input.gajiPokok))
  const tunjangan = Math.max(0, Math.floor(input.tunjangan))
  const potongan = Math.max(0, Math.floor(input.potongan))
  const total = Math.max(0, gajiPokok + tunjangan - potongan)
  const now = new Date().toISOString()

  if (input.id) {
    const idx = db.payrollSlips.findIndex((p) => p.id === input.id)
    if (idx < 0) throw new Error('Slip gaji tidak ditemukan.')
    const current = db.payrollSlips[idx]
    const updated: PayrollSlip = {
      ...current,
      periode: input.periode,
      pegawaiId: input.pegawaiId,
      gajiPokok,
      tunjangan,
      potongan,
      total,
      status: input.status,
      diubahPada: now,
    }
    db.payrollSlips[idx] = updated
    persist()
    return updated
  }

  // guard: prevent duplicate slip per employee+period
  if (db.payrollSlips.some((p) => p.periode === input.periode && p.pegawaiId === input.pegawaiId)) {
    throw new Error('Slip gaji untuk pegawai & periode ini sudah ada.')
  }

  const slip: PayrollSlip = {
    id: uid('pay'),
    periode: input.periode,
    pegawaiId: input.pegawaiId,
    gajiPokok,
    tunjangan,
    potongan,
    total,
    status: input.status,
    dibuatPada: now,
    diubahPada: now,
  }
  db.payrollSlips = [slip, ...db.payrollSlips]
  persist()
  return slip
}

export async function markPayrollPaid(id: string): Promise<PayrollSlip> {
  await delay(220 + Math.round(Math.random() * 240))
  const idx = db.payrollSlips.findIndex((p) => p.id === id)
  if (idx < 0) throw new Error('Slip gaji tidak ditemukan.')
  const current = db.payrollSlips[idx]
  const now = new Date().toISOString()
  const updated: PayrollSlip = { ...current, status: 'dibayar', dibayarPada: now, diubahPada: now }
  db.payrollSlips[idx] = updated
  persist()
  return updated
}

// =========================
// Sekolah: Identitas Sekolah
// =========================

export async function getSchoolIdentity(): Promise<SchoolIdentity> {
  await delay(180 + Math.round(Math.random() * 220))
  return db.schoolIdentity
}

export async function updateSchoolIdentity(
  patch: Partial<
    Pick<
      SchoolIdentity,
      | 'namaSekolah'
      | 'npsn'
      | 'jenjang'
      | 'alamat'
      | 'provinsi'
      | 'kota'
      | 'email'
      | 'telepon'
      | 'logoDataUrl'
      | 'statusAktif'
      | 'terverifikasi'
    >
  >,
): Promise<SchoolIdentity> {
  await delay(220 + Math.round(Math.random() * 260))
  const nextNama = (patch.namaSekolah ?? db.schoolIdentity.namaSekolah).trim()
  const nextNpsn = (patch.npsn ?? db.schoolIdentity.npsn).trim()
  const nextJenjang = (patch.jenjang ?? db.schoolIdentity.jenjang) as SchoolLevel
  const nextAlamat = (patch.alamat ?? db.schoolIdentity.alamat).trim()
  const nextProv = (patch.provinsi ?? db.schoolIdentity.provinsi).trim()
  const nextKota = (patch.kota ?? db.schoolIdentity.kota).trim()
  const nextEmail = (patch.email ?? db.schoolIdentity.email).trim()
  const nextTelp = (patch.telepon ?? db.schoolIdentity.telepon).trim()

  if (!nextNama) throw new Error('Nama sekolah wajib diisi.')
  if (!nextNpsn) throw new Error('NPSN wajib diisi.')
  if (!nextAlamat) throw new Error('Alamat wajib diisi.')
  if (!nextProv) throw new Error('Provinsi wajib diisi.')
  if (!nextKota) throw new Error('Kota/Kabupaten wajib diisi.')
  if (!nextEmail) throw new Error('Email wajib diisi.')
  if (!nextTelp) throw new Error('Nomor telepon wajib diisi.')

  const updated: SchoolIdentity = {
    ...db.schoolIdentity,
    namaSekolah: nextNama,
    npsn: nextNpsn,
    jenjang: nextJenjang,
    alamat: nextAlamat,
    provinsi: nextProv,
    kota: nextKota,
    email: nextEmail,
    telepon: nextTelp,
    logoDataUrl: patch.logoDataUrl ?? db.schoolIdentity.logoDataUrl,
    statusAktif: patch.statusAktif ?? db.schoolIdentity.statusAktif,
    terverifikasi: patch.terverifikasi ?? db.schoolIdentity.terverifikasi,
    diubahPada: new Date().toISOString(),
  }
  db.schoolIdentity = updated
  persist()
  return updated
}

