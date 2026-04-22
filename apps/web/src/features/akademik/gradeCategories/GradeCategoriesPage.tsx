import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import { useAcademicYearsList } from '../../master/academicYears/academicYearsQueries'
import { useClassesList } from '../../master/classes/classesQueries'
import { useSubjectsList } from '../../master/subjects/subjectsQueries'
import {
  useCreateGradeCategory,
  useDeleteGradeCategory,
  useGradeCategoriesList,
  useUpdateGradeCategory,
} from './gradeCategoriesQueries'
import type { GradeCategory } from './gradeCategoriesQueries'

function CategoryForm({
  initial,
  onSubmit,
  onCancel,
  busy,
  error,
}: {
  initial?: Pick<GradeCategory, 'nama' | 'bobot' | 'keterangan'>
  onSubmit: (vals: { nama: string; bobot: number; keterangan?: string }) => void
  onCancel: () => void
  busy: boolean
  error: string | null
}) {
  const [nama, setNama] = useState(initial?.nama ?? '')
  const [bobot, setBobot] = useState<number>(initial?.bobot ?? 30)
  const [keterangan, setKeterangan] = useState(initial?.keterangan ?? '')
  const canSave = useMemo(() => !!nama.trim() && bobot > 0, [nama, bobot])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[0.75rem] font-medium text-on-surface-variant block mb-1.5">Nama Kategori</label>
        <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Tugas Harian" />
      </div>
      <div className="space-y-2">
        <label className="text-[0.75rem] font-medium text-on-surface-variant block mb-1.5">Bobot (%)</label>
        <Input
          type="number"
          value={String(bobot)}
          onChange={(e) => setBobot(Number(e.target.value))}
          placeholder="30"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[0.75rem] font-medium text-on-surface-variant block mb-1.5">Keterangan (opsional)</label>
        <Input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Keterangan tambahan…" />
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">{error}</div>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={busy}>
          Batal
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={() => onSubmit({ nama, bobot, keterangan: keterangan.trim() || undefined })}
          disabled={!canSave || busy}
        >
          {busy ? 'Menyimpan…' : 'Simpan Data'}
        </Button>
      </div>
    </div>
  )
}

export function GradeCategoriesPage() {
  const years = useAcademicYearsList({ q: '', status: '' })
  const classes = useClassesList({ q: '', status: '', tingkat: '' })
  const subjects = useSubjectsList({ q: '', status: '' })

  const [tahunAkademikId, setTahunAkademikId] = useState('ay_1')
  const [kelasId, setKelasId] = useState('cls_1')
  const [mapelId, setMapelId] = useState('subj_1')

  const list = useGradeCategoriesList({ tahunAkademikId, kelasId, mapelId })
  const createMut = useCreateGradeCategory()
  const updateMut = useUpdateGradeCategory()
  const deleteMut = useDeleteGradeCategory()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<GradeCategory | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const busy = createMut.isPending || updateMut.isPending

  const totalBobot = useMemo(() => (list.data ?? []).reduce((acc, c) => acc + (c.bobot ?? 0), 0), [list.data])

  function openCreate() {
    setMode('create')
    setEditing(null)
    setFormError(null)
    setDrawerOpen(true)
  }
  function openEdit(cat: GradeCategory) {
    setMode('edit')
    setEditing(cat)
    setFormError(null)
    setDrawerOpen(true)
  }

  async function onSave(vals: { nama: string; bobot: number; keterangan?: string }) {
    setFormError(null)
    try {
      if (mode === 'create') {
        await createMut.mutateAsync({ tahunAkademikId, kelasId, mapelId, ...vals })
      } else if (editing) {
        await updateMut.mutateAsync({ id: editing.id, patch: vals })
      }
      setDrawerOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan data.')
    }
  }

  async function onDelete(cat: GradeCategory) {
    const ok = window.confirm(`Hapus kategori "${cat.nama}"?`)
    if (!ok) return
    try {
      await deleteMut.mutateAsync(cat.id)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Gagal menghapus data.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold text-on-surface tracking-editorial">Kategori Nilai</h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Kelola kategori penilaian per kelas dan mata pelajaran.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Kategori
        </Button>
      </div>

      <Card className="p-4 rounded-xl flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Tahun Akademik</label>
          <div className="relative">
            <select
              value={tahunAkademikId}
              onChange={(e) => setTahunAkademikId(e.target.value)}
              className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
            >
              {(years.data ?? []).map((y) => (
                <option key={y.id} value={y.id}>
                  {y.nama}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-[220px]">
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Kelas</label>
          <div className="relative">
            <select
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
            >
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
        </div>

        <div className="flex-1 min-w-[220px]">
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Mata Pelajaran</label>
          <div className="relative">
            <select
              value={mapelId}
              onChange={(e) => setMapelId(e.target.value)}
              className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
            >
              {(subjects.data ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[1.125rem] font-semibold text-on-surface tracking-editorial">Daftar Kategori</h3>
          <span className="text-sm font-bold text-tertiary">{totalBobot}%</span>
        </div>

        <div className="space-y-3">
          {list.isLoading ? (
            <div className="text-on-surface-variant">Memuat data…</div>
          ) : list.isError ? (
            <div className="text-on-surface-variant">Gagal memuat data.</div>
          ) : (list.data?.length ?? 0) === 0 ? (
            <div className="text-on-surface-variant">Belum ada kategori nilai.</div>
          ) : (
            list.data!.map((cat) => (
              <div key={cat.id} className="bg-surface-container-low rounded-lg p-3 group relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-on-surface">{cat.nama}</div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-on-surface-variant hover:text-primary" onClick={() => openEdit(cat)} title="Edit">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button className="text-on-surface-variant hover:text-error" onClick={() => onDelete(cat)} title="Hapus">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[0.75rem] text-on-surface-variant">
                  <span>Bobot:</span>
                  <span className="font-bold text-on-surface">{cat.bobot}%</span>
                </div>
                {cat.keterangan ? (
                  <div className="mt-2 text-[0.75rem] text-on-surface-variant">{cat.keterangan}</div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </Card>

      <Drawer
        open={drawerOpen}
        title={mode === 'create' ? 'Tambah Kategori Nilai' : 'Edit Kategori Nilai'}
        onClose={() => setDrawerOpen(false)}
        footer={null}
      >
        <CategoryForm
          initial={editing ? { nama: editing.nama, bobot: editing.bobot, keterangan: editing.keterangan } : undefined}
          onSubmit={onSave}
          onCancel={() => setDrawerOpen(false)}
          busy={busy}
          error={formError}
        />
      </Drawer>
    </div>
  )
}

