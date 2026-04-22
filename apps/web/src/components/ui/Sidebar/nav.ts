export type NavItem = {
  key: string
  label: string
  to: string
  icon?: string
}

export type NavGroup = {
  key: string
  label: string
  icon?: string
  items: NavItem[]
}

export const NAV: Array<NavItem | NavGroup> = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  {
    key: 'master',
    label: 'Master Data',
    icon: 'database',
    items: [
      { key: 'subjects', label: 'Mata Pelajaran', to: '/master/mata-pelajaran' },
      { key: 'majors', label: 'Jurusan', to: '/master/jurusan' },
      { key: 'classes', label: 'Kelas', to: '/master/kelas' },
      { key: 'years', label: 'Tahun Akademik', to: '/master/tahun-akademik' },
    ],
  },
  {
    key: 'sdm',
    label: 'SDM',
    icon: 'group',
    items: [
      { key: 'employees', label: 'Data Guru & Karyawan', to: '/sdm/guru-karyawan' },
      { key: 'students', label: 'Data Siswa', to: '/sdm/siswa' },
    ],
  },
  {
    key: 'akademik',
    label: 'Akademik',
    icon: 'school',
    items: [
      { key: 'time', label: 'Waktu Mengajar', to: '/akademik/waktu-mengajar' },
      { key: 'schedule', label: 'Jadwal Pelajaran', to: '/akademik/jadwal-pelajaran' },
      { key: 'gradeCats', label: 'Kategori Nilai', to: '/akademik/kategori-nilai' },
      { key: 'grades', label: 'Penilaian', to: '/akademik/penilaian' },
    ],
  },
  {
    key: 'keuangan',
    label: 'Keuangan',
    icon: 'payments',
    items: [
      { key: 'spp', label: 'Pembayaran SPP', to: '/keuangan/pembayaran-spp' },
      { key: 'payroll', label: 'Penggajian', to: '/keuangan/penggajian' },
    ],
  },
  {
    key: 'sekolah',
    label: 'Sekolah',
    icon: 'account_balance',
    items: [{ key: 'identitas', label: 'Identitas Sekolah', to: '/sekolah/identitas' }],
  },
  {
    key: 'laporan',
    label: 'Laporan',
    icon: 'description',
    items: [
      { key: 'lap_guru', label: 'Data Guru', to: '/laporan/data-guru' },
      { key: 'lap_siswa', label: 'Data Siswa', to: '/laporan/data-siswa' },
      { key: 'ledger_nilai', label: 'Ledger Nilai', to: '/laporan/ledger-nilai' },
      { key: 'kekurangan_spp', label: 'Kekurangan SPP', to: '/laporan/kekurangan-spp' },
    ],
  },
]

