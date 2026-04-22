const STORAGE_KEY = 'simsekolah.mockdb.v1'

export type MockDb = {
  subjects: unknown[]
  majors?: unknown[]
  classes?: unknown[]
  academicYears?: unknown[]
  employees?: unknown[]
  students?: unknown[]
  teachingSlots?: unknown[]
  schedules?: unknown[]
  gradeCategories?: unknown[]
  gradeEntries?: unknown[]
  sppInvoices?: unknown[]
  sppPayments?: unknown[]
  payrollSlips?: unknown[]
  schoolIdentity?: unknown
}

export function loadDb(): MockDb | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MockDb
  } catch {
    return null
  }
}

export function saveDb(db: MockDb) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

