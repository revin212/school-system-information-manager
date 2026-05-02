import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { useTodayAdministrativeSchedules } from '../akademik/adminSchedules/administrativeSchedulesQueries'

function KpiCard({
  label,
  value,
  icon,
  tone = 'secondary',
  meta,
}: {
  label: string
  value: string
  icon: string
  tone?: 'secondary' | 'primary'
  meta: string
}) {
  return (
    <Card className="p-6 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <p className="font-label text-sm font-medium text-on-surface-variant">{label}</p>
        <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
      </div>
      <h3 className="font-headline text-[2.75rem] font-bold text-on-surface leading-none mb-2 tracking-editorial">
        {value}
      </h3>
      <div className={tone === 'primary' ? 'text-primary' : 'text-tertiary'}>
        <span className="font-label text-xs font-medium">{meta}</span>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-outline-variant/10 rounded-full blur-2xl group-hover:bg-primary/5 transition-colors" />
    </Card>
  )
}

export function DashboardPage() {
  const adminToday = useTodayAdministrativeSchedules()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-[1.5rem] font-semibold text-on-surface tracking-editorial">
            Ringkasan Hari Ini
          </h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Pantauan cepat kondisi operasional sekolah.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Jumlah Siswa" value="1.248" icon="school" meta="Aktif terdaftar" />
        <KpiCard label="Jumlah Guru" value="84" icon="group" meta="Hadir 100% hari ini" />
        <KpiCard
          label="Tagihan SPP Bulan Ini"
          value="Rp 450 jt"
          icon="receipt_long"
          meta="Terkumpul 65%"
          tone="primary"
        />
        <KpiCard
          label="Pembayaran Hari Ini"
          value="Rp 12,5 jt"
          icon="payments"
          meta="Dari 28 transaksi"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-[1.125rem] font-semibold text-on-surface tracking-editorial">
              SPP Tertunggak Teratas
            </h3>
            <button className="font-label text-sm text-primary font-medium hover:underline">
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="font-label text-xs font-medium text-on-surface-variant pb-3 pr-4">
                    Nama Siswa
                  </th>
                  <th className="font-label text-xs font-medium text-on-surface-variant pb-3 px-4">
                    Kelas
                  </th>
                  <th className="font-label text-xs font-medium text-on-surface-variant pb-3 px-4">
                    Bulan Tertunggak
                  </th>
                  <th className="font-label text-xs font-medium text-on-surface-variant pb-3 px-4 text-right">
                    Total Tagihan
                  </th>
                  <th className="font-label text-xs font-medium text-on-surface-variant pb-3 pl-4">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    nama: 'Ahmad Wijaya',
                    nis: '102938',
                    kelas: 'XII MIPA 1',
                    bulan: '3 Bulan',
                    total: 'Rp 1.500.000',
                    inisial: 'AW',
                  },
                  {
                    nama: 'Budi Santoso',
                    nis: '102945',
                    kelas: 'XI IPS 2',
                    bulan: '2 Bulan',
                    total: 'Rp 1.000.000',
                    inisial: 'BS',
                  },
                  {
                    nama: 'Citra Putri',
                    nis: '103012',
                    kelas: 'X MIPA 3',
                    bulan: '2 Bulan',
                    total: 'Rp 1.000.000',
                    inisial: 'CP',
                  },
                ].map((row) => (
                  <tr key={row.nis} className="hover:bg-surface-container-highest transition-colors group">
                    <td className="py-4 pr-4 border-none">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary font-bold text-xs">
                          {row.inisial}
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-on-surface">{row.nama}</p>
                          <p className="font-body text-xs text-on-surface-variant">NIS: {row.nis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-none font-body text-sm text-on-surface-variant">
                      {row.kelas}
                    </td>
                    <td className="py-4 px-4 border-none">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-error-container text-on-error-container">
                        {row.bulan}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-none font-body text-sm font-medium text-on-surface text-right">
                      {row.total}
                    </td>
                    <td className="py-4 pl-4 border-none">
                      <button className="text-primary hover:text-primary-container p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-sm">mail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-1 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl">event</span>
          </div>
          <div className="flex items-start justify-between gap-2 relative z-10 mb-6">
            <h3 className="font-headline text-[1.125rem] font-semibold text-on-surface tracking-editorial">Jadwal Hari Ini</h3>
            <Link
              to="/akademik/jadwal-administratif"
              className="font-label text-xs text-primary font-medium hover:underline shrink-0"
            >
              Kelola
            </Link>
          </div>
          <div className="space-y-4 relative z-10 flex-1">
            {adminToday.isLoading ? (
              <p className="font-body text-sm text-on-surface-variant">Memuat jadwal…</p>
            ) : adminToday.isError ? (
              <p className="font-body text-sm text-on-surface-variant">Gagal memuat jadwal.</p>
            ) : (adminToday.data?.length ?? 0) === 0 ? (
              <p className="font-body text-sm text-on-surface-variant">Tidak ada jadwal hari ini.</p>
            ) : (
              adminToday.data!.map((ev, idx, arr) => (
                <div key={ev.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <span
                      className={cx('font-label text-xs font-bold', idx === 0 ? 'text-primary' : 'text-on-surface-variant')}
                    >
                      {ev.jam}
                    </span>
                    {idx !== arr.length - 1 ? <div className="w-0.5 h-full bg-outline-variant/30 my-1" /> : null}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="bg-surface p-3 rounded-lg border border-outline-variant/10">
                      <p className="font-label text-sm font-medium text-on-surface">{ev.judul}</p>
                      <p className="font-body text-xs text-on-surface-variant mt-1 flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
                        {ev.lokasi}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

