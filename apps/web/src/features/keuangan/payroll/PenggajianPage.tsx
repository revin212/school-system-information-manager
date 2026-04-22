import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import { downloadExcel } from '../../../lib/export/excel'
import type { Employee, PayrollSlip, PayrollStatus } from '../../../lib/mockApi/types'
import { useEmployeesList } from '../../sdm/employees/employeesQueries'
import { useMarkPayrollPaid, usePayrollList, useUpsertPayroll } from './payrollQueries'

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function formatPeriode(periode: string) {
  const [y, m] = periode.split('-').map((x) => Number(x))
  if (!y || !m) return periode
  const d = new Date(Date.UTC(y, m - 1, 1))
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

function StatusBadge({ status }: { status: PayrollStatus }) {
  if (status === 'dibayar') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium bg-tertiary-container/20 text-on-tertiary-fixed-variant">
        Dibayar
      </span>
    )
  }
  if (status === 'diproses') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium bg-secondary-container/60 text-on-secondary-fixed-variant">
        Diproses
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.75rem] font-medium bg-surface-variant text-on-surface-variant">
      Draft
    </span>
  )
}

export function PenggajianPage() {
  const [q, setQ] = useState('')
  const [periode, setPeriode] = useState('2023-11')
  const [status, setStatus] = useState<'' | PayrollStatus>('')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<PayrollSlip | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const employees = useEmployeesList({ q: '', tipe: '', status: '' })
  const list = usePayrollList({ q, periode, status })
  const upsert = useUpsertPayroll()
  const markPaid = useMarkPayrollPaid()

  const empMap = useMemo(() => new Map((employees.data ?? []).map((e) => [e.id, e])), [employees.data])

  const kpi = useMemo(() => {
    const data = list.data ?? []
    const dibayar = data.filter((s) => s.status === 'dibayar').length
    const pending = data.filter((s) => s.status !== 'dibayar').length
    return { dibayar, pending, total: data.length }
  }, [list.data])

  const busy = upsert.isPending || markPaid.isPending

  function openCreate() {
    setMode('create')
    setEditing(null)
    setFormError(null)
    setDrawerOpen(true)
  }

  function openEdit(slip: PayrollSlip) {
    setMode('edit')
    setEditing(slip)
    setFormError(null)
    setDrawerOpen(true)
  }

  async function onMarkPaid(slip: PayrollSlip) {
    if (slip.status === 'dibayar') return
    try {
      await markPaid.mutateAsync(slip.id)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Gagal menandai dibayar.')
    }
  }

  function onDownloadExcel() {
    const rows = (list.data ?? []).map((s) => {
      const e = empMap.get(s.pegawaiId)
      return {
        Periode: formatPeriode(s.periode),
        NIP: e?.nip ?? '-',
        Nama: e?.nama ?? '-',
        'Gaji Pokok': s.gajiPokok,
        Tunjangan: s.tunjangan,
        Potongan: s.potongan,
        Total: s.total,
        Status: s.status === 'draft' ? 'Draft' : s.status === 'diproses' ? 'Diproses' : 'Dibayar',
      }
    })
    downloadExcel({
      filename: `laporan_penggajian_${periode}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Penggajian',
      rows,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-tight text-on-surface leading-tight">Penggajian</h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">Periode: {formatPeriode(periode)}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onDownloadExcel} disabled={list.isLoading}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh Laporan (Excel)
          </Button>
          <Button variant="primary" onClick={openCreate}>
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            Buat Slip Gaji
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[1.125rem] font-semibold text-on-surface tracking-tight">Ringkasan</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="bg-surface-container-low rounded-xl p-4">
              <div className="text-[0.75rem] font-medium text-on-surface-variant uppercase tracking-wider">Total</div>
              <div className="text-[1.5rem] font-bold tracking-tight text-on-surface mt-1">{kpi.total}</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4">
              <div className="text-[0.75rem] font-medium text-on-surface-variant uppercase tracking-wider">Dibayar</div>
              <div className="text-[1.5rem] font-bold tracking-tight text-on-surface mt-1">{kpi.dibayar}</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4">
              <div className="text-[0.75rem] font-medium text-on-surface-variant uppercase tracking-wider">Pending</div>
              <div className="text-[1.5rem] font-bold tracking-tight text-on-surface mt-1">{kpi.pending}</div>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2 p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" placeholder="Cari nama / NIP…" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-56">
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="2023-11">November 2023</option>
                <option value="2023-10">Oktober 2023</option>
                <option value="2023-09">September 2023</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                expand_more
              </span>
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as '' | PayrollStatus)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="diproses">Diproses</option>
                <option value="dibayar">Dibayar</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-xl overflow-hidden pt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-on-surface-variant text-[0.75rem] font-medium tracking-wider">
                <th className="px-6 py-4 font-medium">Pegawai</th>
                <th className="px-6 py-4 font-medium">Periode</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
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
                    Belum ada slip gaji pada periode ini. Klik “Buat Slip Gaji” untuk membuat data.
                  </td>
                </tr>
              ) : (
                list.data!.map((s, idx) => {
                  const e = empMap.get(s.pegawaiId)
                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-surface-container-highest transition-colors cursor-pointer group ${
                        idx % 3 === 2 ? 'bg-surface-container' : ''
                      }`}
                      onClick={() => openEdit(s)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-on-surface">{e?.nama ?? 'Pegawai'}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">NIP: {e?.nip ?? '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{formatPeriode(s.periode)}</td>
                      <td className="px-6 py-4 font-semibold text-on-surface">Rp {formatRupiah(s.total)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(ev) => ev.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors"
                            title="Edit"
                            onClick={() => openEdit(s)}
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            className="px-3 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 transition-colors disabled:opacity-50"
                            disabled={busy || s.status === 'dibayar'}
                            title="Tandai Dibayar"
                            onClick={() => onMarkPaid(s)}
                          >
                            Tandai Dibayar
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

      <Drawer
        open={drawerOpen}
        title={mode === 'create' ? 'Buat Slip Gaji' : 'Edit Slip Gaji'}
        onClose={() => setDrawerOpen(false)}
        widthClassName="max-w-lg"
      >
        <PayrollForm
          employees={employees.data ?? []}
          periode={periode}
          initial={editing ?? undefined}
          busy={busy}
          error={formError}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={async (vals) => {
            setFormError(null)
            try {
              await upsert.mutateAsync(vals)
              setDrawerOpen(false)
            } catch (e) {
              setFormError(e instanceof Error ? e.message : 'Gagal menyimpan slip gaji.')
            }
          }}
        />
      </Drawer>
    </div>
  )
}

function PayrollForm({
  employees,
  periode,
  initial,
  onSubmit,
  onCancel,
  busy,
  error,
}: {
  employees: Employee[]
  periode: string
  initial?: PayrollSlip
  onSubmit: (vals: {
    id?: string
    periode: string
    pegawaiId: string
    gajiPokok: number
    tunjangan: number
    potongan: number
    status: PayrollStatus
  }) => void
  onCancel: () => void
  busy: boolean
  error: string | null
}) {
  const [pegawaiId, setPegawaiId] = useState(initial?.pegawaiId ?? '')
  const [gajiPokok, setGajiPokok] = useState(String(initial?.gajiPokok ?? 0))
  const [tunjangan, setTunjangan] = useState(String(initial?.tunjangan ?? 0))
  const [potongan, setPotongan] = useState(String(initial?.potongan ?? 0))
  const [status, setStatus] = useState<PayrollStatus>(initial?.status ?? 'draft')

  const totals = useMemo(() => {
    const gp = Math.max(0, Math.floor(Number(gajiPokok) || 0))
    const tj = Math.max(0, Math.floor(Number(tunjangan) || 0))
    const pt = Math.max(0, Math.floor(Number(potongan) || 0))
    return { gp, tj, pt, total: Math.max(0, gp + tj - pt) }
  }, [gajiPokok, tunjangan, potongan])

  const canSave = !!pegawaiId && !busy

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Periode</label>
          <Input readOnly value={formatPeriode(periode)} className="bg-surface-container-lowest" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Pegawai</label>
          <div className="relative">
            <select
              value={pegawaiId}
              onChange={(e) => setPegawaiId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
              disabled={!!initial}
              title={initial ? 'Pegawai tidak dapat diubah pada mode edit.' : undefined}
            >
              <option value="">Pilih pegawai…</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nama} ({e.nip})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Gaji Pokok</label>
          <Input value={gajiPokok} onChange={(e) => setGajiPokok(e.target.value)} inputMode="numeric" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Tunjangan</label>
          <Input value={tunjangan} onChange={(e) => setTunjangan(e.target.value)} inputMode="numeric" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Potongan</label>
          <Input value={potongan} onChange={(e) => setPotongan(e.target.value)} inputMode="numeric" />
        </div>
      </div>

      <Card className="p-4 rounded-xl bg-surface-container-low">
        <div className="flex items-center justify-between">
          <div className="text-sm text-on-surface-variant">Total (auto hitung)</div>
          <div className="text-[1.125rem] font-semibold text-on-surface">Rp {formatRupiah(totals.total)}</div>
        </div>
      </Card>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-on-surface-variant">Status</label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PayrollStatus)}
            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="draft">Draft</option>
            <option value="diproses">Diproses</option>
            <option value="dibayar">Dibayar</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {error ? <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">{error}</div> : null}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
          Batal
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() =>
            onSubmit({
              id: initial?.id,
              periode,
              pegawaiId,
              gajiPokok: totals.gp,
              tunjangan: totals.tj,
              potongan: totals.pt,
              status,
            })
          }
          disabled={!canSave}
        >
          {busy ? 'Menyimpan…' : 'Simpan Slip'}
        </Button>
      </div>
    </div>
  )
}

