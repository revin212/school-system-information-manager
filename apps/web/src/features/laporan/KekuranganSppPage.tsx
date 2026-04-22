import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { downloadExcel } from '../../lib/export/excel'
import type { SppInvoiceStatus } from '../../lib/mockApi/types'
import { useClassesList } from '../master/classes/classesQueries'
import { useStudentsList } from '../sdm/students/studentsQueries'
import { useSppInvoicesList } from '../keuangan/spp/sppQueries'

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function formatBulan(bulan: string) {
  const [y, m] = bulan.split('-').map((x) => Number(x))
  if (!y || !m) return bulan
  const d = new Date(Date.UTC(y, m - 1, 1))
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

export function KekuranganSppPage() {
  const [q, setQ] = useState('')
  const [kelasId, setKelasId] = useState('')
  const [bulan, setBulan] = useState('')
  const [status, setStatus] = useState<'' | SppInvoiceStatus>('') // default: semua kekurangan (belum + terlambat)

  const classes = useClassesList({ q: '', status: '', tingkat: '' })
  const students = useStudentsList({ q: '', kelasId: '', jurusanId: '', status: '' })
  const invoices = useSppInvoicesList({ q, kelasId, status, bulan })

  const studentsMap = useMemo(() => new Map((students.data ?? []).map((s) => [s.id, s])), [students.data])
  const classesMap = useMemo(() => new Map((classes.data ?? []).map((c) => [c.id, c])), [classes.data])

  const rows = useMemo(() => {
    return (invoices.data ?? [])
      .filter((inv) => inv.status !== 'lunas')
      .map((inv) => {
        const s = studentsMap.get(inv.siswaId)
        const k = inv.kelasId ? classesMap.get(inv.kelasId) : undefined
        const sisa = Math.max(0, inv.nominal - inv.dibayar)
        return { inv, s, k, sisa }
      })
      .sort((a, b) => b.sisa - a.sisa)
  }, [invoices.data, studentsMap, classesMap])

  const bulanOptions = useMemo(() => {
    const set = new Set((invoices.data ?? []).map((i) => i.bulan))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [invoices.data])

  const totalSisa = useMemo(() => rows.reduce((acc, r) => acc + r.sisa, 0), [rows])

  function onDownloadExcel() {
    const excelRows = rows.map((r) => ({
      Bulan: formatBulan(r.inv.bulan),
      NIS: r.s?.nis ?? '-',
      Nama: r.s?.nama ?? '-',
      Kelas: r.k?.nama ?? '-',
      Nominal: r.inv.nominal,
      Dibayar: r.inv.dibayar,
      Sisa: r.sisa,
      Status: r.inv.status === 'terlambat' ? 'Terlambat' : 'Belum Lunas',
      'Jatuh Tempo': r.inv.jatuhTempo,
    }))
    downloadExcel({
      filename: `laporan_kekurangan_spp_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Kekurangan SPP',
      rows: excelRows,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold text-on-surface tracking-tight leading-tight">Kekurangan SPP</h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Laporan tagihan SPP yang belum lunas / terlambat, sesuai filter.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onDownloadExcel} disabled={invoices.isLoading}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh Laporan (Excel)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <span className="text-[0.75rem] font-medium text-on-surface-variant block mb-1">Total Data</span>
          <span className="text-[2.75rem] font-bold text-on-surface leading-tight tracking-tight">{rows.length}</span>
        </Card>
        <Card className="p-6 md:col-span-2">
          <span className="text-[0.75rem] font-medium text-on-surface-variant block mb-1">Total Kekurangan</span>
          <span className="text-[2.75rem] font-bold text-on-surface leading-tight tracking-tight">
            Rp {formatRupiah(totalSisa)}
          </span>
        </Card>
      </div>

      <Card className="p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" placeholder="Cari NIS / nama siswa…" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-52">
            <select
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Kelas</option>
              {(classes.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative w-full sm:w-56">
            <select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Bulan</option>
              {bulanOptions.map((b) => (
                <option key={b} value={b}>
                  {formatBulan(b)}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as '' | SppInvoiceStatus)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Kekurangan</option>
              <option value="belum_lunas">Belum Lunas</option>
              <option value="terlambat">Terlambat</option>
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
                <th className="px-6 py-4 font-medium">Siswa</th>
                <th className="px-6 py-4 font-medium">Kelas</th>
                <th className="px-6 py-4 font-medium">Bulan</th>
                <th className="px-6 py-4 font-medium">Sisa</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-[0.875rem]">
              {invoices.isLoading ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={5}>
                    Memuat data…
                  </td>
                </tr>
              ) : invoices.isError ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={5}>
                    Gagal memuat data. Silakan coba lagi.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={5}>
                    Tidak ada data kekurangan SPP yang sesuai filter.
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <tr
                    key={r.inv.id}
                    className={`hover:bg-surface-container-highest transition-colors ${idx % 3 === 2 ? 'bg-surface-container' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-on-surface">{r.s?.nama ?? 'Siswa'}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">NIS: {r.s?.nis ?? '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{r.k?.nama ?? '-'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatBulan(r.inv.bulan)}</td>
                    <td className="px-6 py-4 font-semibold text-on-surface">Rp {formatRupiah(r.sisa)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {r.inv.status === 'terlambat' ? 'Terlambat' : 'Belum Lunas'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex items-center justify-between text-sm text-on-surface-variant">
          <span>Menampilkan {rows.length} data</span>
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

