import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { db } from './client'
import {
  academicYears,
  classes,
  employees,
  gradeCategories,
  gradeEntries,
  gradeScores,
  majors,
  payrollSlips,
  schedules,
  schoolIdentity,
  sppInvoices,
  sppPayments,
  students,
  subjects,
  teachingSlots,
  user,
} from './schema'
import { auth } from '../auth/auth'

const nowIso = new Date().toISOString()

async function insertIfMissing<T extends { id: string }>(
  table: any,
  row: T,
  mapper: (r: T) => any,
) {
  const exists = await db.select({ id: table.id }).from(table).where(eq(table.id, row.id)).limit(1)
  if (exists.length) return
  await db.insert(table).values(mapper(row))
}

async function seedSubjects() {
  const fixture = [
    { id: 'subj_1', kode: 'MP-001', nama: 'Matematika Dasar', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'subj_2', kode: 'MP-002', nama: 'Bahasa Indonesia', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'subj_3', kode: 'MP-003', nama: 'Pendidikan Agama Islam', status: 'nonaktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'subj_4', kode: 'MP-004', nama: 'Ilmu Pengetahuan Alam', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
  ]

  for (const s of fixture) {
    await insertIfMissing(subjects, s, (r) => ({
      id: r.id,
      kode: r.kode,
      nama: r.nama,
      status: r.status,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }
}

async function seedMasterData() {
  const majorsFixture = [
    { id: 'maj_1', kode: 'MIPA', nama: 'Matematika & Ilmu Pengetahuan Alam', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'maj_2', kode: 'IPS', nama: 'Ilmu Pengetahuan Sosial', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'maj_3', kode: 'BHS', nama: 'Bahasa', status: 'nonaktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
  ]
  for (const m of majorsFixture) {
    await insertIfMissing(majors, m, (r) => ({
      id: r.id,
      kode: r.kode,
      nama: r.nama,
      status: r.status,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }

  const classesFixture = [
    { id: 'cls_1', nama: 'X MIPA 1', tingkat: 'X' as const, jurusanId: 'maj_1', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'cls_2', nama: 'XI IPS 2', tingkat: 'XI' as const, jurusanId: 'maj_2', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'cls_3', nama: 'XII MIPA 1', tingkat: 'XII' as const, jurusanId: 'maj_1', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
  ]
  for (const c of classesFixture) {
    await insertIfMissing(classes, c, (r) => ({
      id: r.id,
      nama: r.nama,
      tingkat: r.tingkat,
      jurusanId: r.jurusanId,
      status: r.status,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }

  const yearsFixture = [
    { id: 'ay_1', nama: '2023/2024', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'ay_2', nama: '2022/2023', status: 'nonaktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
  ]
  for (const y of yearsFixture) {
    await insertIfMissing(academicYears, y, (r) => ({
      id: r.id,
      nama: r.nama,
      status: r.status,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }
}

async function seedSdm() {
  const employeesFixture = [
    {
      id: 'emp_1',
      nip: '198005122005011002',
      nama: 'Siti Aminah, S.Pd',
      tipe: 'guru' as const,
      noHp: '0812-3456-7890',
      email: 'siti.aminah@sekolah.sch.id',
      status: 'aktif' as const,
      dibuatPada: nowIso,
      diubahPada: nowIso,
    },
    {
      id: 'emp_2',
      nip: '197508221998031005',
      nama: 'Ahmad Budiarto, M.Kom',
      tipe: 'guru' as const,
      noHp: '0856-7890-1234',
      email: 'ahmad.budiarto@sekolah.sch.id',
      status: 'aktif' as const,
      dibuatPada: nowIso,
      diubahPada: nowIso,
    },
    {
      id: 'emp_3',
      nip: '199011152015042001',
      nama: 'Budi Santoso',
      tipe: 'karyawan' as const,
      noHp: '0813-4567-8901',
      email: 'budi.santoso@sekolah.sch.id',
      status: 'cuti' as const,
      dibuatPada: nowIso,
      diubahPada: nowIso,
    },
  ]
  for (const e of employeesFixture) {
    await insertIfMissing(employees, e, (r) => ({
      id: r.id,
      nip: r.nip,
      nama: r.nama,
      tipe: r.tipe,
      noHp: r.noHp,
      email: r.email,
      status: r.status,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }

  const studentsFixture = [
    {
      id: 'stu_1',
      nis: '2023001',
      nama: 'Andi Wijaya',
      kelasId: 'cls_2',
      jurusanId: 'maj_1',
      noHp: '0812-3344-5566',
      status: 'aktif' as const,
      dibuatPada: nowIso,
      diubahPada: nowIso,
    },
    {
      id: 'stu_2',
      nis: '2023002',
      nama: 'Budi Santoso',
      kelasId: 'cls_3',
      jurusanId: 'maj_2',
      noHp: '0812-3456-7890',
      status: 'cuti' as const,
      dibuatPada: nowIso,
      diubahPada: nowIso,
    },
    {
      id: 'stu_3',
      nis: '2023003',
      nama: 'Citra Dewi',
      kelasId: 'cls_1',
      jurusanId: 'maj_3',
      noHp: '0811-2222-3333',
      status: 'aktif' as const,
      dibuatPada: nowIso,
      diubahPada: nowIso,
    },
  ]
  for (const s of studentsFixture) {
    await insertIfMissing(students, s, (r) => ({
      id: r.id,
      nis: r.nis,
      nama: r.nama,
      kelasId: r.kelasId,
      jurusanId: r.jurusanId,
      noHp: r.noHp,
      status: r.status,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }
}

async function seedAkademik() {
  const slotsFixture = [
    { id: 'ts_1', guruId: 'emp_2', hari: 'Senin' as const, mulai: '07:00', selesai: '08:30', keterangan: 'Matematika Wajib — X MIPA 1', dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'ts_2', guruId: 'emp_2', hari: 'Kamis' as const, mulai: '09:00', selesai: '10:30', keterangan: 'Matematika — XII MIPA 1', dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'ts_3', guruId: 'emp_1', hari: 'Selasa' as const, mulai: '07:00', selesai: '08:30', keterangan: 'Fisika Dasar — XI IPS 2', dibuatPada: nowIso, diubahPada: nowIso },
  ]
  for (const s of slotsFixture) {
    await insertIfMissing(teachingSlots, s, (r) => ({
      ...r,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }

  const schedulesFixture = [
    { id: 'sch_1', tahunAkademikId: 'ay_1', kelasId: 'cls_1', hari: 'Senin' as const, mulai: '07:00', selesai: '08:30', mapelId: 'subj_1', guruId: 'emp_2', ruang: 'R.101', status: 'aktif' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'sch_2', tahunAkademikId: 'ay_1', kelasId: 'cls_1', hari: 'Rabu' as const, mulai: '07:00', selesai: '08:30', mapelId: 'subj_4', guruId: 'emp_1', ruang: 'R.101', status: 'bentrok' as const, dibuatPada: nowIso, diubahPada: nowIso },
  ]
  for (const s of schedulesFixture) {
    await insertIfMissing(schedules, s, (r) => ({
      ...r,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }

  const categoriesFixture = [
    { id: 'gc_1', tahunAkademikId: 'ay_1', kelasId: 'cls_1', mapelId: 'subj_1', nama: 'Tugas Harian', bobot: 30, keterangan: 'Rata-rata 5 tugas', dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'gc_2', tahunAkademikId: 'ay_1', kelasId: 'cls_1', mapelId: 'subj_1', nama: 'Ujian Tengah Semester', bobot: 30, keterangan: 'Teori tertulis', dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'gc_3', tahunAkademikId: 'ay_1', kelasId: 'cls_1', mapelId: 'subj_1', nama: 'Ujian Akhir Semester', bobot: 40, keterangan: undefined as any, dibuatPada: nowIso, diubahPada: nowIso },
  ]
  for (const c of categoriesFixture) {
    await insertIfMissing(gradeCategories, c as any, (r: any) => ({
      ...r,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }

  const entriesFixture = [
    { id: 'ge_1', tahunAkademikId: 'ay_1', kelasId: 'cls_1', mapelId: 'subj_1', siswaId: 'stu_1', nilai: { gc_1: 85, gc_2: 88, gc_3: 90 }, status: 'draft' as const, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'ge_2', tahunAkademikId: 'ay_1', kelasId: 'cls_1', mapelId: 'subj_1', siswaId: 'stu_2', nilai: { gc_1: 78, gc_2: 75, gc_3: 82 }, status: 'draft' as const, dibuatPada: nowIso, diubahPada: nowIso },
  ]

  for (const e of entriesFixture) {
    await insertIfMissing(gradeEntries, e as any, (r: any) => ({
      id: r.id,
      tahunAkademikId: r.tahunAkademikId,
      kelasId: r.kelasId,
      mapelId: r.mapelId,
      siswaId: r.siswaId,
      status: r.status,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
    // seed scores (normalized)
    for (const [categoryId, score] of Object.entries(e.nilai)) {
      const scoreId = `${e.id}_${categoryId}`
      await insertIfMissing(gradeScores, { id: scoreId } as any, () => ({
        id: scoreId,
        gradeEntryId: e.id,
        categoryId,
        score: score === null ? null : Math.floor(score),
      }))
    }
  }
}

async function seedKeuangan() {
  const invoicesFixture = [
    { id: 'sppinv_1', siswaId: 'stu_1', kelasId: 'cls_2', bulan: '2023-09', jatuhTempo: '2023-09-10', nominal: 250_000, dibayar: 250_000, status: 'lunas' as const, lunasPada: '2023-09-05T09:15:00.000Z', dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'sppinv_2', siswaId: 'stu_1', kelasId: 'cls_2', bulan: '2023-10', jatuhTempo: '2023-10-10', nominal: 250_000, dibayar: 0, status: 'belum_lunas' as const, lunasPada: undefined as any, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'sppinv_3', siswaId: 'stu_2', kelasId: 'cls_3', bulan: '2023-09', jatuhTempo: '2023-09-10', nominal: 300_000, dibayar: 0, status: 'terlambat' as const, lunasPada: undefined as any, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'sppinv_4', siswaId: 'stu_3', kelasId: 'cls_1', bulan: '2023-11', jatuhTempo: '2023-11-10', nominal: 250_000, dibayar: 0, status: 'belum_lunas' as const, lunasPada: undefined as any, dibuatPada: nowIso, diubahPada: nowIso },
  ]
  for (const inv of invoicesFixture) {
    await insertIfMissing(sppInvoices, inv as any, (r: any) => ({
      ...r,
      lunasPada: r.lunasPada ? new Date(r.lunasPada) : null,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }

  const paymentsFixture = [
    { id: 'spppay_1', invoiceId: 'sppinv_1', siswaId: 'stu_1', metode: 'tunai' as const, dibayarPada: '2023-09-05T09:15:00.000Z', nominal: 250_000, catatan: 'Pembayaran tepat waktu', dibuatPada: '2023-09-05T09:15:00.000Z' },
  ]
  for (const p of paymentsFixture) {
    await insertIfMissing(sppPayments, p as any, (r: any) => ({
      ...r,
      dibayarPada: new Date(r.dibayarPada),
      dibuatPada: new Date(r.dibuatPada),
    }))
  }

  const slipsFixture = [
    { id: 'pay_1', periode: '2023-11', pegawaiId: 'emp_1', gajiPokok: 4_000_000, tunjangan: 1_500_000, potongan: 200_000, total: 5_300_000, status: 'dibayar' as const, dibayarPada: '2023-11-28T10:00:00.000Z', dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'pay_2', periode: '2023-11', pegawaiId: 'emp_2', gajiPokok: 4_500_000, tunjangan: 2_000_000, potongan: 0, total: 6_500_000, status: 'diproses' as const, dibayarPada: undefined as any, dibuatPada: nowIso, diubahPada: nowIso },
    { id: 'pay_3', periode: '2023-11', pegawaiId: 'emp_3', gajiPokok: 3_800_000, tunjangan: 1_000_000, potongan: 200_000, total: 4_600_000, status: 'draft' as const, dibayarPada: undefined as any, dibuatPada: nowIso, diubahPada: nowIso },
  ]
  for (const s of slipsFixture) {
    await insertIfMissing(payrollSlips, s as any, (r: any) => ({
      ...r,
      dibayarPada: r.dibayarPada ? new Date(r.dibayarPada) : null,
      dibuatPada: new Date(r.dibuatPada),
      diubahPada: new Date(r.diubahPada),
    }))
  }
}

async function seedSekolah() {
  const fixture = {
    id: 'school_1',
    namaSekolah: 'SMA Negeri 1 Nusantara',
    npsn: '20234567',
    jenjang: 'sma' as const,
    alamat: 'Jl. Pendidikan No. 123, Kel. Suka Maju, Kec. Cerdas Bangsa',
    provinsi: 'DKI Jakarta',
    kota: 'Jakarta Selatan',
    email: 'info@sman1nusantara.sch.id',
    telepon: '(021) 555-0198',
    logoDataUrl: null as any,
    statusAktif: true,
    terverifikasi: true,
    dibuatPada: nowIso,
    diubahPada: nowIso,
  }
  await insertIfMissing(schoolIdentity, fixture as any, (r: any) => ({
    ...r,
    dibuatPada: new Date(r.dibuatPada),
    diubahPada: new Date(r.diubahPada),
  }))
}

async function seedUsers() {
  // Demo users (password sama)
  const password = 'password1234'
  const demo = [
    { email: 'admin@sim.local', name: 'Admin Utama', role: 'ADMIN' as const },
    { email: 'tu@sim.local', name: 'Admin TU', role: 'TU' as const },
    { email: 'guru@sim.local', name: 'Ibu Sari', role: 'GURU' as const },
    { email: 'kepsek@sim.local', name: 'Bapak Andi', role: 'KEPSEK' as const },
  ]

  for (const u of demo) {
    const exists = await db.select({ id: user.id }).from(user).where(eq(user.email, u.email)).limit(1)
    if (exists.length) continue
    await auth.api.signUpEmail({
      body: {
        email: u.email,
        password,
        name: u.name,
      },
    })
    // Force role to match frontend (additionalFields persisted as column `role` in our schema)
    await db.update(user).set({ role: u.role }).where(eq(user.email, u.email))
  }
}

async function main() {
  await seedSubjects()
  await seedMasterData()
  await seedSdm()
  await seedAkademik()
  await seedKeuangan()
  await seedSekolah()
  await seedUsers()
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seed selesai.')
    process.exit(0)
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })

