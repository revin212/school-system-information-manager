import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { downloadExcel } from '../../lib/export/excel'
import type { EmployeeStatus, EmployeeType } from '../../lib/mockApi/types'
import { useEmployeesList } from '../sdm/employees/employeesQueries'

export function LaporanDataGuruPage() {
  const [q, setQ] = useState('')
  const [tipe, setTipe] = useState<'' | EmployeeType>('guru')
  const [status, setStatus] = useState<'' | EmployeeStatus>('')

  const list = useEmployeesList({ q, tipe, status })

  const kpi = useMemo(() => {
    const data = list.data ?? []
    const total = data.length
    const aktif = data.filter((e) => e.status === 'aktif').length
    const cuti = data.filter((e) => e.status === 'cuti').length
    return { total, aktif, cuti }
  }, [list.data])

  function onDownloadExcel() {
    const rows = (list.data ?? []).map((e) => ({
      NIP: e.nip,
      Nama: e.nama,
      Tipe: e.tipe === 'guru' ? 'Guru' : 'Karyawan',
      'No. HP': e.noHp,
      Email: e.email ?? '',
      Status: e.status === 'aktif' ? 'Aktif' : e.status === 'cuti' ? 'Cuti' : 'Nonaktif',
    }))
    downloadExcel({
      filename: `laporan_data_guru_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Data Guru',
      rows,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold text-on-surface tracking-tight leading-tight">Laporan Data Guru</h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Filter dan unduh laporan data guru dalam format Excel.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onDownloadExcel} disabled={list.isLoading}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh Laporan (Excel)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <span className="text-[0.75rem] font-medium text-on-surface-variant block mb-1">Total Data</span>
          <span className="text-[2.75rem] font-bold text-on-surface leading-tight tracking-tight">{kpi.total}</span>
        </Card>
        <Card className="p-6">
          <span className="text-[0.75rem] font-medium text-on-surface-variant block mb-1">Status Aktif</span>
          <span className="text-[2.75rem] font-bold text-on-surface leading-tight tracking-tight">{kpi.aktif}</span>
        </Card>
        <Card className="p-6">
          <span className="text-[0.75rem] font-medium text-on-surface-variant block mb-1">Sedang Cuti</span>
          <span className="text-[2.75rem] font-bold text-on-surface leading-tight tracking-tight">{kpi.cuti}</span>
        </Card>
      </div>

      <Card className="p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" placeholder="Cari NIP atau nama…" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-44">
            <select
              value={tipe}
              onChange={(e) => setTipe(e.target.value as '' | EmployeeType)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="guru">Guru</option>
              <option value="">Semua Tipe</option>
              <option value="karyawan">Karyawan</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
          <div className="relative w-full sm:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as '' | EmployeeStatus)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="cuti">Cuti</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </Card>

      <Card className="rounded-xl overflow-hidden pt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead>
              <tr className="text-on-surface-variant text-[0.75rem] font-medium tracking-wider">
                <th className="px-6 py-4 font-medium">NIP</th>
                <th className="px-6 py-4 font-medium">Nama</th>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium">No. HP</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-[0.875rem]">
              {list.isLoading ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={5}>
                    Memuat data…
                  </td>
                </tr>
              ) : list.isError ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={5}>
                    Gagal memuat data. Silakan coba lagi.
                  </td>
                </tr>
              ) : (list.data?.length ?? 0) === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={5}>
                    Tidak ada data yang sesuai filter.
                  </td>
                </tr>
              ) : (
                (list.data ?? []).map((e, idx) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-surface-container-highest transition-colors ${idx % 3 === 2 ? 'bg-surface-container' : ''}`}
                  >
                    <td className="px-6 py-4 text-on-surface-variant">{e.nip}</td>
                    <td className="px-6 py-4 font-medium text-on-surface">{e.nama}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.tipe === 'guru' ? 'Guru' : 'Karyawan'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.noHp}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {e.status === 'aktif' ? 'Aktif' : e.status === 'cuti' ? 'Cuti' : 'Nonaktif'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex items-center justify-between text-sm text-on-surface-variant">
          <span>Menampilkan {list.data?.length ?? 0} data</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 hover:text-primary transition-colors disabled:opacity-50" disabled>
              Sebelumnya
            </button>
            <button className="px-4 py-2 hover:text-primary transition-colors">Selanjutnya</button>
          </div>
        </div>
      </Card>
    </div>
  )
}

