import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import { downloadExcel } from '../../../lib/export/excel'
import type { SppInvoice, SppInvoiceStatus, SppPaymentMethod } from '../../../lib/mockApi/types'
import { useClassesList } from '../../master/classes/classesQueries'
import { useStudentsList } from '../../sdm/students/studentsQueries'
import { useCreateSppPayment, useSppInvoicesList, useSppPayments } from './sppQueries'

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function formatBulan(bulan: string) {
  // "2023-09" -> "September 2023"
  const [y, m] = bulan.split('-').map((x) => Number(x))
  if (!y || !m) return bulan
  const d = new Date(Date.UTC(y, m - 1, 1))
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

function StatusBadge({ status }: { status: SppInvoiceStatus }) {
  if (status === 'lunas') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.75rem] font-medium bg-tertiary-container/20 text-on-tertiary-fixed-variant">
        Lunas
      </span>
    )
  }
  if (status === 'terlambat') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.75rem] font-medium bg-error-container/40 text-on-error-container">
        Terlambat
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.75rem] font-medium bg-surface-variant text-on-surface-variant">
      Belum Lunas
    </span>
  )
}

export function PembayaranSppPage() {
  const [q, setQ] = useState('')
  const [kelasId, setKelasId] = useState('')
  const [status, setStatus] = useState<'' | SppInvoiceStatus>('')
  const [bulan, setBulan] = useState('')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<SppInvoice | null>(null)
  const [metode, setMetode] = useState<SppPaymentMethod>('tunai')
  const [catatan, setCatatan] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const classes = useClassesList({ q: '', status: '', tingkat: '' })
  const students = useStudentsList({ q: '', kelasId: '', jurusanId: '', status: '' })
  const list = useSppInvoicesList({ q, kelasId, status, bulan })
  const payments = useSppPayments(selected?.id ?? '', detailOpen && !!selected?.id)
  const createPayment = useCreateSppPayment()

  const bulanOptions = useMemo(() => {
    const set = new Set((list.data ?? []).map((i) => i.bulan))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [list.data])

  const studentsMap = useMemo(() => new Map((students.data ?? []).map((s) => [s.id, s])), [students.data])
  const classesMap = useMemo(() => new Map((classes.data ?? []).map((c) => [c.id, c])), [classes.data])

  const busy = createPayment.isPending

  function openPay(inv: SppInvoice) {
    setSelected(inv)
    setMetode('tunai')
    setCatatan('')
    setFormError(null)
    setDrawerOpen(true)
  }

  function openDetail(inv: SppInvoice) {
    setSelected(inv)
    setFormError(null)
    setDetailOpen(true)
  }

  async function onSubmitPayment() {
    if (!selected) return
    setFormError(null)
    try {
      await createPayment.mutateAsync({
        invoiceId: selected.id,
        metode,
        nominal: Math.max(0, selected.nominal - selected.dibayar),
        catatan: catatan.trim() || undefined,
      })
      setDrawerOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal mencatat pembayaran.')
    }
  }

  function onDownloadExcel() {
    const rows = (list.data ?? []).map((inv) => {
      const s = studentsMap.get(inv.siswaId)
      const k = inv.kelasId ? classesMap.get(inv.kelasId) : undefined
      return {
        Bulan: formatBulan(inv.bulan),
        NIS: s?.nis ?? '-',
        Nama: s?.nama ?? '-',
        Kelas: k?.nama ?? '-',
        Nominal: inv.nominal,
        Dibayar: inv.dibayar,
        Sisa: Math.max(0, inv.nominal - inv.dibayar),
        Status: inv.status === 'lunas' ? 'Lunas' : inv.status === 'terlambat' ? 'Terlambat' : 'Belum Lunas',
        'Jatuh Tempo': inv.jatuhTempo,
      }
    })
    downloadExcel({
      filename: `laporan_spp_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'SPP',
      rows,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-editorial text-on-surface leading-tight">
            Pembayaran SPP
          </h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Kelola transaksi dan riwayat pembayaran Sumbangan Pembinaan Pendidikan.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onDownloadExcel} disabled={list.isLoading}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh Laporan (Excel)
          </Button>
        </div>
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

          <div className="relative w-full sm:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as '' | SppInvoiceStatus)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="lunas">Lunas</option>
              <option value="belum_lunas">Belum Lunas</option>
              <option value="terlambat">Terlambat</option>
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
        </div>
      </Card>

      <Card className="rounded-xl overflow-hidden pt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead>
              <tr className="text-on-surface-variant text-[0.75rem] font-medium tracking-wider">
                <th className="px-6 py-4 font-medium">SISWA</th>
                <th className="px-6 py-4 font-medium">KELAS</th>
                <th className="px-6 py-4 font-medium">BULAN</th>
                <th className="px-6 py-4 font-medium">NOMINAL</th>
                <th className="px-6 py-4 font-medium">STATUS</th>
                <th className="px-6 py-4 font-medium text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-[0.875rem]">
              {list.isLoading ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={6}>
                    Memuat data…
                  </td>
                </tr>
              ) : list.isError ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={6}>
                    Gagal memuat data. Silakan coba lagi.
                  </td>
                </tr>
              ) : (list.data?.length ?? 0) === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-on-surface-variant" colSpan={6}>
                    Tidak ada tagihan yang sesuai filter. Coba ubah pencarian atau filter.
                  </td>
                </tr>
              ) : (
                list.data!.map((inv, idx) => {
                  const s = studentsMap.get(inv.siswaId)
                  const k = inv.kelasId ? classesMap.get(inv.kelasId) : undefined
                  const sisa = Math.max(0, inv.nominal - inv.dibayar)
                  return (
                    <tr
                      key={inv.id}
                      className={`hover:bg-surface-container-highest transition-colors cursor-pointer group ${
                        idx % 3 === 2 ? 'bg-surface-container' : ''
                      }`}
                      onClick={() => openDetail(inv)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-on-surface">{s?.nama ?? 'Siswa'}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">NIS: {s?.nis ?? '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{k?.nama ?? '-'}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{formatBulan(inv.bulan)}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-on-surface">Rp {formatRupiah(inv.nominal)}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">Sisa: Rp {formatRupiah(sisa)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="px-3 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 transition-colors disabled:opacity-50"
                            disabled={inv.status === 'lunas'}
                            onClick={() => openPay(inv)}
                            title="Catat Pembayaran"
                          >
                            Catat Pembayaran
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
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

      <Drawer open={drawerOpen} title="Catat Pembayaran" onClose={() => setDrawerOpen(false)} widthClassName="max-w-lg">
        {selected ? (
          <div className="space-y-6">
            <div className="bg-surface-container-low rounded-xl p-4">
              <div className="text-[0.75rem] font-medium text-on-surface-variant uppercase tracking-wider">
                Ringkasan Tagihan
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-on-surface">{studentsMap.get(selected.siswaId)?.nama ?? 'Siswa'}</div>
                  <div className="text-sm text-on-surface-variant">
                    {classesMap.get(selected.kelasId ?? '')?.nama ?? '-'} • {formatBulan(selected.bulan)}
                  </div>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-surface-container-lowest rounded-xl p-3">
                  <div className="text-xs text-on-surface-variant">Nominal</div>
                  <div className="font-semibold text-on-surface">Rp {formatRupiah(selected.nominal)}</div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-3">
                  <div className="text-xs text-on-surface-variant">Sisa</div>
                  <div className="font-semibold text-on-surface">
                    Rp {formatRupiah(Math.max(0, selected.nominal - selected.dibayar))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-on-surface-variant">Metode Pembayaran</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="metode"
                    checked={metode === 'tunai'}
                    onChange={() => setMetode('tunai')}
                  />
                  <div className="px-4 py-3 text-center rounded-lg border border-outline-variant/30 peer-checked:border-primary peer-checked:bg-primary-fixed peer-checked:text-on-primary-fixed transition-all text-[0.875rem] font-medium bg-surface text-on-surface">
                    Tunai
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="metode"
                    checked={metode === 'transfer_bank'}
                    onChange={() => setMetode('transfer_bank')}
                  />
                  <div className="px-4 py-3 text-center rounded-lg border border-outline-variant/30 peer-checked:border-primary peer-checked:bg-primary-fixed peer-checked:text-on-primary-fixed transition-all text-[0.875rem] font-medium bg-surface text-on-surface">
                    Transfer
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="metode"
                    checked={metode === 'e_wallet'}
                    onChange={() => setMetode('e_wallet')}
                  />
                  <div className="px-4 py-3 text-center rounded-lg border border-outline-variant/30 peer-checked:border-primary peer-checked:bg-primary-fixed peer-checked:text-on-primary-fixed transition-all text-[0.875rem] font-medium bg-surface text-on-surface">
                    E-Wallet
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="metode"
                    checked={metode === 'qris'}
                    onChange={() => setMetode('qris')}
                  />
                  <div className="px-4 py-3 text-center rounded-lg border border-outline-variant/30 peer-checked:border-primary peer-checked:bg-primary-fixed peer-checked:text-on-primary-fixed transition-all text-[0.875rem] font-medium bg-surface text-on-surface">
                    QRIS
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-on-surface-variant">Nominal Pembayaran</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[0.875rem] font-medium">
                  Rp
                </span>
                <Input
                  readOnly
                  value={formatRupiah(Math.max(0, selected.nominal - selected.dibayar))}
                  className="pl-10 font-medium bg-surface-container-lowest"
                />
              </div>
              <p className="text-[11px] text-outline">Untuk demo, nominal otomatis = sisa tagihan.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-on-surface-variant">Catatan (opsional)</label>
              <Input value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Mis. dibayar via TU" />
            </div>

            {formError ? (
              <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">{formError}</div>
            ) : null}

            <div className="flex items-center justify-between pt-4 ghost-border border-x-0 border-b-0">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">info</span>
                <span className="text-[0.75rem]">Pastikan data benar sebelum memproses.</span>
              </div>
              <Button variant="primary" onClick={onSubmitPayment} disabled={busy || selected.status === 'lunas'}>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {busy ? 'Memproses…' : 'Proses Pembayaran'}
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Drawer open={detailOpen} title="Detail Tagihan SPP" onClose={() => setDetailOpen(false)} widthClassName="max-w-lg">
        {selected ? (
          <div className="space-y-6">
            <div className="bg-surface-container-low rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[0.75rem] font-medium text-on-surface-variant uppercase tracking-wider">
                    Informasi
                  </div>
                  <div className="mt-2 text-[1.125rem] font-semibold text-on-surface tracking-tight">
                    {studentsMap.get(selected.siswaId)?.nama ?? 'Siswa'}
                  </div>
                  <div className="text-sm text-on-surface-variant mt-1">
                    {classesMap.get(selected.kelasId ?? '')?.nama ?? '-'} • {formatBulan(selected.bulan)}
                  </div>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-surface-container-lowest rounded-xl p-3">
                  <div className="text-xs text-on-surface-variant">Nominal</div>
                  <div className="font-semibold text-on-surface">Rp {formatRupiah(selected.nominal)}</div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-3">
                  <div className="text-xs text-on-surface-variant">Dibayar</div>
                  <div className="font-semibold text-on-surface">Rp {formatRupiah(selected.dibayar)}</div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-3">
                  <div className="text-xs text-on-surface-variant">Sisa</div>
                  <div className="font-semibold text-on-surface">
                    Rp {formatRupiah(Math.max(0, selected.nominal - selected.dibayar))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[0.875rem] font-semibold text-on-surface">Riwayat Pembayaran</h4>
                <button
                  className="text-sm font-medium text-primary hover:text-primary-container transition-colors"
                  onClick={() => openPay(selected)}
                  disabled={selected.status === 'lunas'}
                >
                  Catat Pembayaran
                </button>
              </div>
              <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="text-on-surface-variant text-[0.75rem] font-medium tracking-wider bg-surface-container-low/50">
                        <th className="px-5 py-3 font-medium">Tanggal</th>
                        <th className="px-5 py-3 font-medium">Metode</th>
                        <th className="px-5 py-3 font-medium text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.isLoading ? (
                        <tr>
                          <td className="px-5 py-5 text-on-surface-variant" colSpan={3}>
                            Memuat riwayat…
                          </td>
                        </tr>
                      ) : payments.isError ? (
                        <tr>
                          <td className="px-5 py-5 text-on-surface-variant" colSpan={3}>
                            Gagal memuat riwayat pembayaran.
                          </td>
                        </tr>
                      ) : (payments.data?.length ?? 0) === 0 ? (
                        <tr>
                          <td className="px-5 py-5 text-on-surface-variant" colSpan={3}>
                            Belum ada pembayaran pada tagihan ini.
                          </td>
                        </tr>
                      ) : (
                        payments.data!.map((p) => (
                          <tr key={p.id} className="hover:bg-surface-container-highest transition-colors">
                            <td className="px-5 py-4 text-on-surface-variant">
                              {new Date(p.dibayarPada).toLocaleString('id-ID')}
                            </td>
                            <td className="px-5 py-4 text-on-surface-variant">
                              {p.metode === 'tunai'
                                ? 'Tunai'
                                : p.metode === 'transfer_bank'
                                  ? 'Transfer'
                                  : p.metode === 'e_wallet'
                                    ? 'E-Wallet'
                                    : 'QRIS'}
                            </td>
                            <td className="px-5 py-4 text-right font-semibold text-on-surface">
                              Rp {formatRupiah(p.nominal)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}

