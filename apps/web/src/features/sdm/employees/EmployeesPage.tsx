import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import { confirmDelete } from '../../../lib/confirmDialog'
import { downloadExcel } from '../../../lib/export/excel'
import type { EmployeeStatus, EmployeeType } from '../../../lib/mockApi/types'
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployeesList,
  useUpdateEmployee,
} from './employeesQueries'
import type { Employee } from './employeesQueries'

function StatusBadge({ status }: { status: EmployeeStatus }) {
  if (status === 'aktif') {
    return (
      <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[0.75rem] font-medium">
        Aktif
      </span>
    )
  }
  if (status === 'cuti') {
    return (
      <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-[0.75rem] font-medium">
        Cuti
      </span>
    )
  }
  return (
    <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full text-[0.75rem] font-medium">
      Nonaktif
    </span>
  )
}

function EmployeeForm({
  initial,
  onSubmit,
  onCancel,
  busy,
  error,
}: {
  initial?: Pick<Employee, 'nip' | 'nama' | 'tipe' | 'noHp' | 'email' | 'status'>
  onSubmit: (vals: {
    nip: string
    nama: string
    tipe: EmployeeType
    noHp: string
    email?: string
    status: EmployeeStatus
  }) => void
  onCancel: () => void
  busy: boolean
  error: string | null
}) {
  const [nip, setNip] = useState(initial?.nip ?? '')
  const [nama, setNama] = useState(initial?.nama ?? '')
  const [tipe, setTipe] = useState<EmployeeType>(initial?.tipe ?? 'guru')
  const [noHp, setNoHp] = useState(initial?.noHp ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [status, setStatus] = useState<EmployeeStatus>(initial?.status ?? 'aktif')

  const canSave = useMemo(() => !!nip.trim() && !!nama.trim(), [nip, nama])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-medium text-on-surface-variant">NIP</label>
        <Input value={nip} onChange={(e) => setNip(e.target.value)} placeholder="Masukkan NIP…" />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-on-surface-variant">Nama</label>
        <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama…" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Tipe</label>
          <div className="relative">
            <select
              value={tipe}
              onChange={(e) => setTipe(e.target.value as EmployeeType)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="guru">Guru</option>
              <option value="karyawan">Karyawan</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Status</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="aktif">Aktif</option>
              <option value="cuti">Cuti</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">No. HP</label>
          <Input value={noHp} onChange={(e) => setNoHp(e.target.value)} placeholder="e.g. 0812-3456-7890" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Email (opsional)</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@sekolah.sch.id" />
        </div>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">{error}</div>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
          Batal
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() =>
            onSubmit({
              nip,
              nama,
              tipe,
              noHp,
              email: email.trim() || undefined,
              status,
            })
          }
          disabled={!canSave || busy}
        >
          {busy ? 'Menyimpan…' : 'Simpan Data'}
        </Button>
      </div>
    </div>
  )
}

export function EmployeesPage() {
  const [q, setQ] = useState('')
  const [tipe, setTipe] = useState<'' | EmployeeType>('')
  const [status, setStatus] = useState<'' | EmployeeStatus>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<Employee | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const list = useEmployeesList({ q, tipe, status })
  const createMut = useCreateEmployee()
  const updateMut = useUpdateEmployee()
  const deleteMut = useDeleteEmployee()
  const busy = createMut.isPending || updateMut.isPending

  const kpi = useMemo(() => {
    const data = list.data ?? []
    const totalGuru = data.filter((e) => e.tipe === 'guru').length
    const totalKaryawan = data.filter((e) => e.tipe === 'karyawan').length
    const aktif = data.filter((e) => e.status === 'aktif').length
    return { totalGuru, totalKaryawan, aktif }
  }, [list.data])

  function openCreate() {
    setMode('create')
    setEditing(null)
    setFormError(null)
    setDrawerOpen(true)
  }

  function openEdit(item: Employee) {
    setMode('edit')
    setEditing(item)
    setFormError(null)
    setDrawerOpen(true)
  }

  async function onSave(vals: {
    nip: string
    nama: string
    tipe: EmployeeType
    noHp: string
    email?: string
    status: EmployeeStatus
  }) {
    setFormError(null)
    try {
      if (mode === 'create') await createMut.mutateAsync(vals)
      else if (editing) await updateMut.mutateAsync({ id: editing.id, patch: vals })
      setDrawerOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan data.')
    }
  }

  async function onDelete(item: Employee) {
    const ok = await confirmDelete(`Data "${item.nama}" akan dihapus permanen.`)
    if (!ok) return
    try {
      await deleteMut.mutateAsync(item.id)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Gagal menghapus data.')
    }
  }

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
      filename: `laporan_guru_karyawan_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Guru & Karyawan',
      rows,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold text-on-surface tracking-editorial mb-2">
            Data Guru & Karyawan
          </h2>
          <p className="text-[0.875rem] text-on-surface-variant">
            Manajemen sumber daya manusia dan staf pendidik.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onDownloadExcel} disabled={list.isLoading}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh Laporan (Excel)
          </Button>
          <Button variant="primary" onClick={openCreate}>
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Guru/Karyawan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              person_apron
            </span>
          </div>
          <span className="text-[0.75rem] font-medium text-on-surface-variant block mb-1">Total Guru</span>
          <span className="text-[2.75rem] font-bold text-on-surface leading-tight tracking-editorial">
            {kpi.totalGuru}
          </span>
        </Card>
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              engineering
            </span>
          </div>
          <span className="text-[0.75rem] font-medium text-on-surface-variant block mb-1">Total Karyawan</span>
          <span className="text-[2.75rem] font-bold text-on-surface leading-tight tracking-editorial">
            {kpi.totalKaryawan}
          </span>
        </Card>
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <span className="text-[0.75rem] font-medium text-on-surface-variant block mb-1">Status Aktif</span>
          <span className="text-[2.75rem] font-bold text-on-surface leading-tight tracking-editorial">
            {kpi.aktif}
          </span>
        </Card>
      </div>

      <Card className="p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" placeholder="Cari NIP atau nama…" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={tipe}
              onChange={(e) => setTipe(e.target.value as '' | EmployeeType)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Tipe</option>
              <option value="guru">Guru</option>
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
                <th className="px-6 py-4 font-medium">NAMA</th>
                <th className="px-6 py-4 font-medium">TIPE</th>
                <th className="px-6 py-4 font-medium">NO HP</th>
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
                    Belum ada data. Klik “Tambah Guru/Karyawan” untuk membuat data.
                  </td>
                </tr>
              ) : (
                list.data!.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-surface-container-highest transition-colors cursor-pointer group ${
                      idx % 3 === 2 ? 'bg-surface-container' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-on-surface-variant">{e.nip}</td>
                    <td className="px-6 py-4 font-medium text-on-surface">{e.nama}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.tipe === 'guru' ? 'Guru' : 'Karyawan'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.noHp}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          title="Edit"
                          onClick={() => openEdit(e)}
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error/10 transition-colors"
                          title="Hapus"
                          onClick={() => onDelete(e)}
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
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

      <Drawer
        open={drawerOpen}
        title={mode === 'create' ? 'Tambah Guru/Karyawan' : 'Edit Guru/Karyawan'}
        onClose={() => setDrawerOpen(false)}
        footer={null}
      >
        <EmployeeForm
          initial={
            editing
              ? {
                  nip: editing.nip,
                  nama: editing.nama,
                  tipe: editing.tipe,
                  noHp: editing.noHp,
                  email: editing.email,
                  status: editing.status,
                }
              : undefined
          }
          onSubmit={onSave}
          onCancel={() => setDrawerOpen(false)}
          busy={busy}
          error={formError}
        />
      </Drawer>
    </div>
  )
}

