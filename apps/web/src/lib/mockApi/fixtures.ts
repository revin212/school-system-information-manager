import type {
  AcademicYear,
  Employee,
  GradeCategory,
  GradeEntry,
  Major,
  PayrollSlip,
  SchoolClass,
  SchoolIdentity,
  ScheduleItem,
  SppInvoice,
  SppPayment,
  Student,
  Subject,
  TeachingSlot,
} from './types'

const now = new Date().toISOString()

export const SUBJECTS_FIXTURE: Subject[] = [
  { id: 'subj_1', kode: 'MP-001', nama: 'Matematika Dasar', status: 'aktif', dibuatPada: now, diubahPada: now },
  { id: 'subj_2', kode: 'MP-002', nama: 'Bahasa Indonesia', status: 'aktif', dibuatPada: now, diubahPada: now },
  { id: 'subj_3', kode: 'MP-003', nama: 'Pendidikan Agama Islam', status: 'nonaktif', dibuatPada: now, diubahPada: now },
  { id: 'subj_4', kode: 'MP-004', nama: 'Ilmu Pengetahuan Alam', status: 'aktif', dibuatPada: now, diubahPada: now },
]

export const MAJORS_FIXTURE: Major[] = [
  { id: 'maj_1', kode: 'MIPA', nama: 'Matematika & Ilmu Pengetahuan Alam', status: 'aktif', dibuatPada: now, diubahPada: now },
  { id: 'maj_2', kode: 'IPS', nama: 'Ilmu Pengetahuan Sosial', status: 'aktif', dibuatPada: now, diubahPada: now },
  { id: 'maj_3', kode: 'BHS', nama: 'Bahasa', status: 'nonaktif', dibuatPada: now, diubahPada: now },
]

export const CLASSES_FIXTURE: SchoolClass[] = [
  { id: 'cls_1', nama: 'X MIPA 1', tingkat: 'X', jurusanId: 'maj_1', status: 'aktif', dibuatPada: now, diubahPada: now },
  { id: 'cls_2', nama: 'XI IPS 2', tingkat: 'XI', jurusanId: 'maj_2', status: 'aktif', dibuatPada: now, diubahPada: now },
  { id: 'cls_3', nama: 'XII MIPA 1', tingkat: 'XII', jurusanId: 'maj_1', status: 'aktif', dibuatPada: now, diubahPada: now },
]

export const ACADEMIC_YEARS_FIXTURE: AcademicYear[] = [
  { id: 'ay_1', nama: '2023/2024', status: 'aktif', dibuatPada: now, diubahPada: now },
  { id: 'ay_2', nama: '2022/2023', status: 'nonaktif', dibuatPada: now, diubahPada: now },
]

export const EMPLOYEES_FIXTURE: Employee[] = [
  {
    id: 'emp_1',
    nip: '198005122005011002',
    nama: 'Siti Aminah, S.Pd',
    tipe: 'guru',
    noHp: '0812-3456-7890',
    email: 'siti.aminah@sekolah.sch.id',
    status: 'aktif',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'emp_2',
    nip: '197508221998031005',
    nama: 'Ahmad Budiarto, M.Kom',
    tipe: 'guru',
    noHp: '0856-7890-1234',
    email: 'ahmad.budiarto@sekolah.sch.id',
    status: 'aktif',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'emp_3',
    nip: '199011152015042001',
    nama: 'Budi Santoso',
    tipe: 'karyawan',
    noHp: '0813-4567-8901',
    email: 'budi.santoso@sekolah.sch.id',
    status: 'cuti',
    dibuatPada: now,
    diubahPada: now,
  },
]

export const STUDENTS_FIXTURE: Student[] = [
  {
    id: 'stu_1',
    nis: '2023001',
    nama: 'Andi Wijaya',
    kelasId: 'cls_2',
    jurusanId: 'maj_1',
    noHp: '0812-3344-5566',
    status: 'aktif',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'stu_2',
    nis: '2023002',
    nama: 'Budi Santoso',
    kelasId: 'cls_3',
    jurusanId: 'maj_2',
    noHp: '0812-3456-7890',
    status: 'cuti',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'stu_3',
    nis: '2023003',
    nama: 'Citra Dewi',
    kelasId: 'cls_1',
    jurusanId: 'maj_3',
    noHp: '0811-2222-3333',
    status: 'aktif',
    dibuatPada: now,
    diubahPada: now,
  },
]

export const TEACHING_SLOTS_FIXTURE: TeachingSlot[] = [
  {
    id: 'ts_1',
    guruId: 'emp_2',
    hari: 'Senin',
    mulai: '07:00',
    selesai: '08:30',
    keterangan: 'Matematika Wajib — X MIPA 1',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'ts_2',
    guruId: 'emp_2',
    hari: 'Kamis',
    mulai: '09:00',
    selesai: '10:30',
    keterangan: 'Matematika — XII MIPA 1',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'ts_3',
    guruId: 'emp_1',
    hari: 'Selasa',
    mulai: '07:00',
    selesai: '08:30',
    keterangan: 'Fisika Dasar — XI IPS 2',
    dibuatPada: now,
    diubahPada: now,
  },
]

export const SCHEDULES_FIXTURE: ScheduleItem[] = [
  {
    id: 'sch_1',
    tahunAkademikId: 'ay_1',
    kelasId: 'cls_1',
    hari: 'Senin',
    mulai: '07:00',
    selesai: '08:30',
    mapelId: 'subj_1',
    guruId: 'emp_2',
    ruang: 'R.101',
    status: 'aktif',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'sch_2',
    tahunAkademikId: 'ay_1',
    kelasId: 'cls_1',
    hari: 'Rabu',
    mulai: '07:00',
    selesai: '08:30',
    mapelId: 'subj_4',
    guruId: 'emp_1',
    ruang: 'R.101',
    status: 'bentrok',
    dibuatPada: now,
    diubahPada: now,
  },
]

export const GRADE_CATEGORIES_FIXTURE: GradeCategory[] = [
  {
    id: 'gc_1',
    tahunAkademikId: 'ay_1',
    kelasId: 'cls_1',
    mapelId: 'subj_1',
    nama: 'Tugas Harian',
    bobot: 30,
    keterangan: 'Rata-rata 5 tugas',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'gc_2',
    tahunAkademikId: 'ay_1',
    kelasId: 'cls_1',
    mapelId: 'subj_1',
    nama: 'Ujian Tengah Semester',
    bobot: 30,
    keterangan: 'Teori tertulis',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'gc_3',
    tahunAkademikId: 'ay_1',
    kelasId: 'cls_1',
    mapelId: 'subj_1',
    nama: 'Ujian Akhir Semester',
    bobot: 40,
    dibuatPada: now,
    diubahPada: now,
  },
]

export const GRADE_ENTRIES_FIXTURE: GradeEntry[] = [
  {
    id: 'ge_1',
    tahunAkademikId: 'ay_1',
    kelasId: 'cls_1',
    mapelId: 'subj_1',
    siswaId: 'stu_1',
    nilai: { gc_1: 85, gc_2: 88, gc_3: 90 },
    status: 'draft',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'ge_2',
    tahunAkademikId: 'ay_1',
    kelasId: 'cls_1',
    mapelId: 'subj_1',
    siswaId: 'stu_2',
    nilai: { gc_1: 78, gc_2: 75, gc_3: 82 },
    status: 'draft',
    dibuatPada: now,
    diubahPada: now,
  },
]

// =========================
// Keuangan: Pembayaran SPP (Fixtures)
// =========================

export const SPP_INVOICES_FIXTURE: SppInvoice[] = [
  {
    id: 'sppinv_1',
    siswaId: 'stu_1',
    kelasId: 'cls_2',
    bulan: '2023-09',
    jatuhTempo: '2023-09-10',
    nominal: 250_000,
    dibayar: 250_000,
    status: 'lunas',
    lunasPada: '2023-09-05T09:15:00.000Z',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'sppinv_2',
    siswaId: 'stu_1',
    kelasId: 'cls_2',
    bulan: '2023-10',
    jatuhTempo: '2023-10-10',
    nominal: 250_000,
    dibayar: 0,
    status: 'belum_lunas',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'sppinv_3',
    siswaId: 'stu_2',
    kelasId: 'cls_3',
    bulan: '2023-09',
    jatuhTempo: '2023-09-10',
    nominal: 300_000,
    dibayar: 0,
    status: 'terlambat',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'sppinv_4',
    siswaId: 'stu_3',
    kelasId: 'cls_1',
    bulan: '2023-11',
    jatuhTempo: '2023-11-10',
    nominal: 250_000,
    dibayar: 0,
    status: 'belum_lunas',
    dibuatPada: now,
    diubahPada: now,
  },
]

export const SPP_PAYMENTS_FIXTURE: SppPayment[] = [
  {
    id: 'spppay_1',
    invoiceId: 'sppinv_1',
    siswaId: 'stu_1',
    metode: 'tunai',
    dibayarPada: '2023-09-05T09:15:00.000Z',
    nominal: 250_000,
    catatan: 'Pembayaran tepat waktu',
    dibuatPada: '2023-09-05T09:15:00.000Z',
  },
]

// =========================
// Keuangan: Penggajian (Fixtures)
// =========================

export const PAYROLL_SLIPS_FIXTURE: PayrollSlip[] = [
  {
    id: 'pay_1',
    periode: '2023-11',
    pegawaiId: 'emp_1',
    gajiPokok: 4_000_000,
    tunjangan: 1_500_000,
    potongan: 200_000,
    total: 5_300_000,
    status: 'dibayar',
    dibayarPada: '2023-11-28T10:00:00.000Z',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'pay_2',
    periode: '2023-11',
    pegawaiId: 'emp_2',
    gajiPokok: 4_500_000,
    tunjangan: 2_000_000,
    potongan: 0,
    total: 6_500_000,
    status: 'diproses',
    dibuatPada: now,
    diubahPada: now,
  },
  {
    id: 'pay_3',
    periode: '2023-11',
    pegawaiId: 'emp_3',
    gajiPokok: 3_800_000,
    tunjangan: 1_000_000,
    potongan: 200_000,
    total: 4_600_000,
    status: 'draft',
    dibuatPada: now,
    diubahPada: now,
  },
]

// =========================
// Sekolah: Identitas Sekolah (Fixture)
// =========================

export const SCHOOL_IDENTITY_FIXTURE: SchoolIdentity = {
  id: 'school_1',
  namaSekolah: 'SMA Negeri 1 Nusantara',
  npsn: '20234567',
  jenjang: 'sma',
  alamat: 'Jl. Pendidikan No. 123, Kel. Suka Maju, Kec. Cerdas Bangsa',
  provinsi: 'DKI Jakarta',
  kota: 'Jakarta Selatan',
  email: 'info@sman1nusantara.sch.id',
  telepon: '(021) 555-0198',
  logoDataUrl: undefined,
  statusAktif: true,
  terverifikasi: true,
  dibuatPada: now,
  diubahPada: now,
}

