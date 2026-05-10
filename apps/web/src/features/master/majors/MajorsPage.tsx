import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import { confirmDelete } from '../../../lib/confirmDialog'
import type { MajorStatus } from '../../../lib/mockApi/types'
import {
  useCreateMajor,
  useDeleteMajor,
  useMajorsList,
  useUpdateMajor,
} from './majorsQueries'
import type { Major } from './majorsQueries'

function StatusBadge({ status }: { status: MajorStatus }) {
  if (status === 'aktif') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-tertiary-container/20 text-tertiary-container">
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
        Aktif
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-variant text-on-surface-variant">
      <span className="w-1.5 h-1.5 rounded-full bg-outline" />
      Nonaktif
    </span>
  )
}

function MajorForm({
  initial,
  onSubmit,
  onCancel,
  busy,
  error,
}: {
  initial?: Pick<Major, 'kode' | 'nama' | 'status'>
  onSubmit: (vals: { kode: string; nama: string; status: MajorStatus }) => void
  onCancel: () => void
  busy: boolean
  error: string | null
}) {
  const [kode, setKode] = useState(initial?.kode ?? '')
  const [nama, setNama] = useState(initial?.nama ?? '')
  const [status, setStatus] = useState<MajorStatus>(initial?.status ?? 'aktif')

  const canSave = useMemo(() => !!kode.trim() && !!nama.trim(), [kode, nama])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-medium text-on-surface-variant">Kode Jurusan</label>
        <Input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="e.g. MIPA" />
        <p className="text-[11px] text-outline">Gunakan kode singkat (contoh: MIPA, IPS).</p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-on-surface-variant">Nama Jurusan</label>
        <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama jurusan…" />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-on-surface-variant">Status</label>
        <div className="flex items-center gap-4 mt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-on-surface">
            <input
              className="text-primary focus:ring-primary"
              name="status"
              type="radio"
              value="aktif"
              checked={status === 'aktif'}
              onChange={() => setStatus('aktif')}
            />
            Aktif
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-on-surface">
            <input
              className="text-primary focus:ring-primary"
              name="status"
              type="radio"
              value="nonaktif"
              checked={status === 'nonaktif'}
              onChange={() => setStatus('nonaktif')}
            />
            Nonaktif
          </label>
        </div>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">{error}</div>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
          Batal
        </Button>
        <Button type="button" variant="primary" onClick={() => onSubmit({ kode, nama, status })} disabled={!canSave || busy}>
          {busy ? 'Menyimpan…' : 'Simpan Data'}
        </Button>
      </div>
    </div>
  )
}

export function MajorsPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'' | MajorStatus>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<Major | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const list = useMajorsList({ q, status })
  const createMut = useCreateMajor()
  const updateMut = useUpdateMajor()
  const deleteMut = useDeleteMajor()

  const busy = createMut.isPending || updateMut.isPending

  function openCreate() {
    setMode('create')
    setEditing(null)
    setFormError(null)
    setDrawerOpen(true)
  }

  function openEdit(major: Major) {
    setMode('edit')
    setEditing(major)
    setFormError(null)
    setDrawerOpen(true)
  }

  async function onSave(vals: { kode: string; nama: string; status: MajorStatus }) {
    setFormError(null)
    try {
      if (mode === 'create') await createMut.mutateAsync(vals)
      else if (editing) await updateMut.mutateAsync({ id: editing.id, patch: vals })
      setDrawerOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan data.')
    }
  }

  async function onDelete(major: Major) {
    const ok = await confirmDelete(`Jurusan "${major.nama}" akan dihapus permanen.`)
    if (!ok) return
    try {
      await deleteMut.mutateAsync(major.id)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Gagal menghapus data.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-on-surface tracking-editorial mb-1">Data Jurusan</h2>
          <p className="text-sm text-on-surface-variant">Kelola daftar jurusan di sekolah.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Jurusan
        </Button>
      </div>

      <Card className="p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" placeholder="Cari Kode atau Nama Jurusan…" />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as '' | MajorStatus)}
            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            expand_more
          </span>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                <th className="p-4 pl-6 w-32">Kode</th>
                <th className="p-4">Nama Jurusan</th>
                <th className="p-4 w-40">Status</th>
                <th className="p-4 pr-6 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {list.isLoading ? (
                <tr>
                  <td className="p-6 text-on-surface-variant" colSpan={4}>Memuat data…</td>
                </tr>
              ) : list.isError ? (
                <tr>
                  <td className="p-6 text-on-surface-variant" colSpan={4}>Gagal memuat data. Silakan coba lagi.</td>
                </tr>
              ) : (list.data?.length ?? 0) === 0 ? (
                <tr>
                  <td className="p-6 text-on-surface-variant" colSpan={4}>
                    Belum ada jurusan. Klik “Tambah Jurusan” untuk membuat data.
                  </td>
                </tr>
              ) : (
                list.data!.map((m) => (
                  <tr key={m.id} className="hover:bg-surface-container-highest/30 transition-colors group">
                    <td className="p-4 pl-6 font-medium text-on-surface">{m.kode}</td>
                    <td className="p-4 text-on-surface-variant group-hover:text-primary transition-colors">{m.nama}</td>
                    <td className="p-4"><StatusBadge status={m.status} /></td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit"
                          onClick={() => openEdit(m)}
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error/10 transition-colors"
                          title="Hapus"
                          onClick={() => onDelete(m)}
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between ghost-border border-x-0 border-b-0">
          <span className="text-xs text-on-surface-variant">Menampilkan {list.data?.length ?? 0} data</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm font-medium text-outline hover:text-on-surface transition-colors disabled:opacity-50" disabled>
              Sebelumnya
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-md">1</button>
            <button className="px-3 py-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors rounded-md hover:bg-surface-container">2</button>
            <span className="px-2 text-outline">…</span>
            <button className="px-3 py-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Selanjutnya</button>
          </div>
        </div>
      </Card>

      <Drawer
        open={drawerOpen}
        title={mode === 'create' ? 'Tambah Jurusan' : 'Edit Jurusan'}
        onClose={() => setDrawerOpen(false)}
        footer={null}
      >
        <MajorForm
          initial={editing ? { kode: editing.kode, nama: editing.nama, status: editing.status } : undefined}
          onSubmit={onSave}
          onCancel={() => setDrawerOpen(false)}
          busy={busy}
          error={formError}
        />
      </Drawer>
    </div>
  )
}

