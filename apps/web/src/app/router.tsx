import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { AppShell } from '../layouts/AppShell'
import { LoginPage } from '../features/auth/LoginPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { SubjectsPage } from '../features/master/subjects/SubjectsPage'
import { MajorsPage } from '../features/master/majors/MajorsPage'
import { ClassesPage } from '../features/master/classes/ClassesPage'
import { AcademicYearsPage } from '../features/master/academicYears/AcademicYearsPage'
import { EmployeesPage } from '../features/sdm/employees/EmployeesPage'
import { StudentsPage } from '../features/sdm/students/StudentsPage'
import { TimeSlotsPage } from '../features/akademik/timeSlots/TimeSlotsPage'
import { AdministrativeSchedulesPage } from '../features/akademik/adminSchedules/AdministrativeSchedulesPage'
import { SchedulesPage } from '../features/akademik/schedules/SchedulesPage'
import { GradeCategoriesPage } from '../features/akademik/gradeCategories/GradeCategoriesPage'
import { GradesPage } from '../features/akademik/grades/GradesPage'
import { RequireAuth } from '../features/auth/RequireAuth'
import { PembayaranSppPage } from '../features/keuangan/spp/PembayaranSppPage'
import { PenggajianPage } from '../features/keuangan/payroll/PenggajianPage'
import { IdentitasSekolahPage } from '../features/sekolah/identitas/IdentitasSekolahPage'
import { LaporanDataGuruPage } from '../features/laporan/LaporanDataGuruPage'
import { LaporanDataSiswaPage } from '../features/laporan/LaporanDataSiswaPage'
import { LedgerNilaiPage } from '../features/laporan/LedgerNilaiPage'
import { KekuranganSppPage } from '../features/laporan/KekuranganSppPage'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/master/mata-pelajaran', element: <SubjectsPage /> },

      // Placeholder routes
      { path: '/master/jurusan', element: <MajorsPage /> },
      { path: '/master/kelas', element: <ClassesPage /> },
      { path: '/master/tahun-akademik', element: <AcademicYearsPage /> },
      { path: '/sdm/guru-karyawan', element: <EmployeesPage /> },
      { path: '/sdm/siswa', element: <StudentsPage /> },
      { path: '/akademik/waktu-mengajar', element: <TimeSlotsPage /> },
      { path: '/akademik/jadwal-administratif', element: <AdministrativeSchedulesPage /> },
      { path: '/akademik/jadwal-pelajaran', element: <SchedulesPage /> },
      { path: '/akademik/kategori-nilai', element: <GradeCategoriesPage /> },
      { path: '/akademik/penilaian', element: <GradesPage /> },
      { path: '/keuangan/pembayaran-spp', element: <PembayaranSppPage /> },
      { path: '/keuangan/penggajian', element: <PenggajianPage /> },
      { path: '/sekolah/identitas', element: <IdentitasSekolahPage /> },
      { path: '/laporan/data-guru', element: <LaporanDataGuruPage /> },
      { path: '/laporan/data-siswa', element: <LaporanDataSiswaPage /> },
      { path: '/laporan/ledger-nilai', element: <LedgerNilaiPage /> },
      { path: '/laporan/kekurangan-spp', element: <KekuranganSppPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

