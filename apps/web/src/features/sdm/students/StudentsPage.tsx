import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import { confirmDelete } from '../../../lib/confirmDialog'
import { downloadExcel } from '../../../lib/export/excel'
import type { ClassLevel, ClassStatus, MajorStatus, StudentStatus } from '../../../lib/mockApi/types'
import { useClassesList } from '../../master/classes/classesQueries'
import { useMajorsList } from '../../master/majors/majorsQueries'
import {
  useCreateStudent,
  useDeleteStudent,
  useStudentsList,
  useUpdateStudent,
} from './studentsQueries'
import type { Student } from './studentsQueries'

function StatusBadge({ status }: { status: StudentStatus }) {
  if (status === 'aktif') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-medium bg-tertiary-container text-on-tertiary-container">
        Aktif
      </span>
    )
  }
  if (status === 'cuti') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-medium bg-error-container text-on-error-container">
        Cuti
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-medium bg-surface-variant text-on-surface-variant">
      Nonaktif
    </span>
  )
}

function StudentForm({
  initial,
  classes,
  majors,
  onSubmit,
  onCancel,
  busy,
  error,
}: {
  initial?: Pick<Student, 'nis' | 'nama' | 'kelasId' | 'jurusanId' | 'noHp' | 'status'>
  classes: Array<{ id: string; nama: string }>
  majors: Array<{ id: string; kode: string; nama: string }>
  onSubmit: (vals: {
    nis: string
    nama: string
    kelasId?: string
    jurusanId?: string
    noHp?: string
    status: StudentStatus
  }) => void
  onCancel: () => void
  busy: boolean
  error: string | null
}) {
  const [nis, setNis] = useState(initial?.nis ?? '')
  const [nama, setNama] = useState(initial?.nama ?? '')
  const [kelasId, setKelasId] = useState(initial?.kelasId ?? '')
  const [jurusanId, setJurusanId] = useState(initial?.jurusanId ?? '')
  const [noHp, setNoHp] = useState(initial?.noHp ?? '')
  const [status, setStatus] = useState<StudentStatus>(initial?.status ?? 'aktif')

  const canSave = useMemo(() => !!nis.trim() && !!nama.trim(), [nis, nama])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">NIS</label>
          <Input value={nis} onChange={(e) => setNis(e.target.value)} placeholder="Masukkan NIS…" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Status</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StudentStatus)}
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

      <div className="space-y-2">
        <label className="block text-xs font-medium text-on-surface-variant">Nama Siswa</label>
        <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama siswa…" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Kelas</label>
          <div className="relative">
            <select
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Pilih kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-on-surface-variant">Jurusan</label>
          <div className="relative">
            <select
              value={jurusanId}
              onChange={(e) => setJurusanId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Pilih jurusan</option>
              {majors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.kode} — {m.nama}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-on-surface-variant">No. HP (opsional)</label>
        <Input value={noHp} onChange={(e) => setNoHp(e.target.value)} placeholder="e.g. 0812-3456-7890" />
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
              nis,
              nama,
              kelasId: kelasId || undefined,
              jurusanId: jurusanId || undefined,
              noHp: noHp.trim() || undefined,
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

export function StudentsPage() {
  const [q, setQ] = useState('')
  const [kelasId, setKelasId] = useState('')
  const [jurusanId, setJurusanId] = useState('')
  const [status, setStatus] = useState<'' | StudentStatus>('aktif')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<Student | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const list = useStudentsList({ q, kelasId, jurusanId, status })
  const classes = useClassesList({ q: '', status: '' as '' | ClassStatus, tingkat: '' as '' | ClassLevel })
  const majors = useMajorsList({ q: '', status: '' as '' | MajorStatus })
  const createMut = useCreateStudent()
  const updateMut = useUpdateStudent()
  const deleteMut = useDeleteStudent()
  const busy = createMut.isPending || updateMut.isPending

  const classesMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of classes.data ?? []) map.set(c.id, c.nama)
    return map
  }, [classes.data])
  const majorsMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of majors.data ?? []) map.set(m.id, m.kode)
    return map
  }, [majors.data])

  function openCreate() {
    setMode('create')
    setEditing(null)
    setFormError(null)
    setDrawerOpen(true)
  }

  function openEdit(item: Student) {
    setMode('edit')
    setEditing(item)
    setFormError(null)
    setDrawerOpen(true)
  }

  async function onSave(vals: { nis: string; nama: string; kelasId?: string; jurusanId?: string; noHp?: string; status: StudentStatus }) {
    setFormError(null)
    try {
      if (mode === 'create') await createMut.mutateAsync(vals)
      else if (editing) await updateMut.mutateAsync({ id: editing.id, patch: vals })
      setDrawerOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan data.')
    }
  }

  async function onDelete(item: Student) {
    const ok = await confirmDelete(`Data siswa "${item.nama}" akan dihapus permanen.`)
    if (!ok) return
    try {
      await deleteMut.mutateAsync(item.id)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Gagal menghapus data.')
    }
  }

  function onDownloadExcel() {
    const rows = (list.data ?? []).map((s) => ({
      NIS: s.nis,
      Nama: s.nama,
      Kelas: s.kelasId ? classesMap.get(s.kelasId) ?? '' : '',
      Jurusan: s.jurusanId ? majorsMap.get(s.jurusanId) ?? '' : '',
      'No. HP': s.noHp ?? '',
      Status: s.status === 'aktif' ? 'Aktif' : s.status === 'cuti' ? 'Cuti' : 'Nonaktif',
    }))
    downloadExcel({
      filename: `laporan_siswa_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Data Siswa',
      rows,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold text-on-surface tracking-editorial font-headline">
            Data Siswa
          </h2>
          <p className="text-[0.875rem] text-on-surface-variant font-body mt-1">
            Kelola data induk siswa aktif dan riwayat akademik.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onDownloadExcel} disabled={list.isLoading}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh Laporan (Excel)
          </Button>
          <Button variant="primary" onClick={openCreate}>
            <span className="material-symbols-outlined text-[1.25rem]">add</span>
            Tambah Siswa
          </Button>
        </div>
      </div>

      <Card className="p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" placeholder="Cari NIS atau Nama Siswa…" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Kelas</option>
              {(classes.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={jurusanId}
              onChange={(e) => setJurusanId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Jurusan</option>
              {(majors.data ?? []).map((m) => (
                <option key={m.id} value={m.id}>{m.kode}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as '' | StudentStatus)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Status: Aktif</option>
              <option value="cuti">Status: Cuti</option>
              <option value="nonaktif">Status: Nonaktif</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="text-[0.75rem] font-medium text-on-surface-variant font-label">
              <th className="pb-4 font-medium pl-2">NIS</th>
              <th className="pb-4 font-medium">Nama Siswa</th>
              <th className="pb-4 font-medium">Kelas</th>
              <th className="pb-4 font-medium">Jurusan</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium text-right pr-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[0.875rem] font-body text-on-surface">
            {list.isLoading ? (
              <tr><td className="py-6 pl-2 text-on-surface-variant" colSpan={6}>Memuat data…</td></tr>
            ) : list.isError ? (
              <tr><td className="py-6 pl-2 text-on-surface-variant" colSpan={6}>Gagal memuat data. Silakan coba lagi.</td></tr>
            ) : (list.data?.length ?? 0) === 0 ? (
              <tr><td className="py-6 pl-2 text-on-surface-variant" colSpan={6}>Belum ada data siswa. Klik “Tambah Siswa” untuk membuat data.</td></tr>
            ) : (
              list.data!.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-highest transition-colors group cursor-pointer">
                  <td className="py-4 pl-2 text-secondary font-medium">{s.nis}</td>
                  <td className="py-4 font-medium">{s.nama}</td>
                  <td className="py-4 text-on-surface-variant">{s.kelasId ? classesMap.get(s.kelasId) ?? '—' : '—'}</td>
                  <td className="py-4 text-on-surface-variant">{s.jurusanId ? majorsMap.get(s.jurusanId) ?? '—' : '—'}</td>
                  <td className="py-4"><StatusBadge status={s.status} /></td>
                  <td className="py-4 text-right pr-2">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors"
                        title="Edit"
                        onClick={() => openEdit(s)}
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error/10 transition-colors"
                        title="Hapus"
                        onClick={() => onDelete(s)}
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

        <div className="flex justify-between items-center mt-6 pt-4 ghost-border border-x-0 border-b-0">
          <span className="text-[0.75rem] text-on-surface-variant font-label">
            Menampilkan {list.data?.length ?? 0} siswa
          </span>
          <div className="flex gap-2">
            <button className="text-[0.75rem] font-medium text-on-surface-variant hover:text-primary px-3 py-1.5 transition-colors" disabled>
              Sebelumnya
            </button>
            <button className="text-[0.75rem] font-medium text-primary px-3 py-1.5 bg-surface-container-highest rounded-md">
              1
            </button>
            <button className="text-[0.75rem] font-medium text-on-surface-variant hover:text-primary px-3 py-1.5 transition-colors">
              2
            </button>
            <button className="text-[0.75rem] font-medium text-on-surface-variant hover:text-primary px-3 py-1.5 transition-colors">
              Selanjutnya
            </button>
          </div>
        </div>
      </Card>

      <Drawer
        open={drawerOpen}
        title={mode === 'create' ? 'Tambah Siswa' : 'Edit Siswa'}
        onClose={() => setDrawerOpen(false)}
        footer={null}
      >
        <StudentForm
          initial={
            editing
              ? { nis: editing.nis, nama: editing.nama, kelasId: editing.kelasId, jurusanId: editing.jurusanId, noHp: editing.noHp, status: editing.status }
              : undefined
          }
          classes={(classes.data ?? []).map((c) => ({ id: c.id, nama: c.nama }))}
          majors={(majors.data ?? []).map((m) => ({ id: m.id, kode: m.kode, nama: m.nama }))}
          onSubmit={onSave}
          onCancel={() => setDrawerOpen(false)}
          busy={busy}
          error={formError}
        />
      </Drawer>
    </div>
  )
}

