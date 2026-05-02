export type SubjectStatus = 'aktif' | 'nonaktif'

export type Subject = {
  id: string
  kode: string
  nama: string
  status: SubjectStatus
  dibuatPada: string
  diubahPada: string
}

export type MajorStatus = 'aktif' | 'nonaktif'

export type Major = {
  id: string
  kode: string
  nama: string
  status: MajorStatus
  dibuatPada: string
  diubahPada: string
}

export type ClassStatus = 'aktif' | 'nonaktif'
export type ClassLevel = 'X' | 'XI' | 'XII'

export type SchoolClass = {
  id: string
  nama: string // contoh: "XII MIPA 1"
  tingkat: ClassLevel
  jurusanId?: string
  status: ClassStatus
  dibuatPada: string
  diubahPada: string
}

export type AcademicYearStatus = 'aktif' | 'nonaktif'

export type AcademicYear = {
  id: string
  nama: string // contoh: "2023/2024"
  status: AcademicYearStatus
  dibuatPada: string
  diubahPada: string
}

export type EmployeeType = 'guru' | 'karyawan'
export type EmployeeStatus = 'aktif' | 'cuti' | 'nonaktif'

export type Employee = {
  id: string
  nip: string
  nama: string
  tipe: EmployeeType
  noHp: string
  email?: string
  status: EmployeeStatus
  dibuatPada: string
  diubahPada: string
}

export type StudentStatus = 'aktif' | 'cuti' | 'nonaktif'

export type Student = {
  id: string
  nis: string
  nama: string
  kelasId?: string
  jurusanId?: string
  noHp?: string
  status: StudentStatus
  dibuatPada: string
  diubahPada: string
}

export type Weekday = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'

export type TeachingSlot = {
  id: string
  guruId: string
  hari: Weekday
  mulai: string // "07:00"
  selesai: string // "08:30"
  keterangan: string // contoh: "Matematika - X MIPA 1"
  dibuatPada: string
  diubahPada: string
}

/** Kegiatan administratif per tanggal (bukan jadwal jam pelajaran). */
export type AdministrativeSchedule = {
  id: string
  tanggal: string // YYYY-MM-DD
  jam: string
  judul: string
  lokasi: string
  dibuatPada: string
  diubahPada: string
}

export type ScheduleItem = {
  id: string
  tahunAkademikId: string
  kelasId: string
  hari: Weekday
  mulai: string
  selesai: string
  mapelId: string
  guruId: string
  ruang: string
  status: 'aktif' | 'bentrok'
  dibuatPada: string
  diubahPada: string
}

export type GradeCategory = {
  id: string
  tahunAkademikId: string
  kelasId: string
  mapelId: string
  nama: string
  bobot: number // %
  keterangan?: string
  dibuatPada: string
  diubahPada: string
}

export type GradebookStatus = 'draft' | 'published'

export type GradeEntry = {
  id: string
  tahunAkademikId: string
  kelasId: string
  mapelId: string
  siswaId: string
  nilai: Record<string, number | null> // gradeCategoryId -> score
  status: GradebookStatus
  dibuatPada: string
  diubahPada: string
}

// =========================
// Keuangan: Pembayaran SPP
// =========================

export type SppInvoiceStatus = 'lunas' | 'belum_lunas' | 'terlambat'
export type SppPaymentMethod = 'tunai' | 'transfer_bank' | 'e_wallet' | 'qris'

export type SppInvoice = {
  id: string
  siswaId: string
  kelasId?: string
  bulan: string // "2023-09"
  jatuhTempo: string // ISO date
  nominal: number
  dibayar: number // total sudah dibayar
  status: SppInvoiceStatus
  lunasPada?: string // ISO date-time
  dibuatPada: string
  diubahPada: string
}

export type SppPayment = {
  id: string
  invoiceId: string
  siswaId: string
  metode: SppPaymentMethod
  dibayarPada: string // ISO date-time
  nominal: number
  catatan?: string
  dibuatPada: string
}

// =========================
// Keuangan: Penggajian
// =========================

export type PayrollStatus = 'draft' | 'diproses' | 'dibayar'

export type PayrollSlip = {
  id: string
  periode: string // "2023-11"
  pegawaiId: string
  gajiPokok: number
  tunjangan: number
  potongan: number
  total: number
  status: PayrollStatus
  dibayarPada?: string // ISO date-time
  dibuatPada: string
  diubahPada: string
}

// =========================
// Sekolah: Identitas Sekolah
// =========================

export type SchoolLevel = 'sd' | 'smp' | 'sma'

export type SchoolIdentity = {
  id: string
  namaSekolah: string
  npsn: string
  jenjang: SchoolLevel
  alamat: string
  provinsi: string
  kota: string
  email: string
  telepon: string
  logoDataUrl?: string // base64 data URL
  statusAktif: boolean
  terverifikasi: boolean
  dibuatPada: string
  diubahPada: string
}

