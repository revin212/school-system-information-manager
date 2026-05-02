import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import { localDateString, monthRangeFromYearMonth } from '../../../lib/dateLocal'
import type { AdministrativeSchedule } from './administrativeSchedulesQueries'
import {
  useAdministrativeSchedulesList,
  useCreateAdministrativeSchedule,
  useDeleteAdministrativeSchedule,
  useUpdateAdministrativeSchedule,
} from './administrativeSchedulesQueries'

function formatIdTanggal(iso: string) {
  const p = iso.split('-').map(Number)
  if (p.length !== 3) return iso
  const [y, m, d] = p
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function AdminForm({
  initial,
  onSubmit,
  onCancel,
  busy,
  error,
}: {
  initial?: Pick<AdministrativeSchedule, 'tanggal' | 'jam' | 'judul' | 'lokasi'>
  onSubmit: (vals: { tanggal: string; jam: string; judul: string; lokasi: string }) => void
  onCancel: () => void
  busy: boolean
  error: string | null
}) {
  const [tanggal, setTanggal] = useState(initial?.tanggal ?? localDateString())
  const [jam, setJam] = useState(initial?.jam ?? '08:00')
  const [judul, setJudul] = useState(initial?.judul ?? '')
  const [lokasi, setLokasi] = useState(initial?.lokasi ?? '')
  const canSave = useMemo(() => !!tanggal && !!judul.trim() && !!lokasi.trim(), [tanggal, judul, lokasi])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Tanggal</label>
        <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Jam</label>
        <Input type="time" value={jam} onChange={(e) => setJam(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Judul kegiatan</label>
        <Input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Contoh: Rapat evaluasi kurikulum" />
      </div>
      <div className="space-y-2">
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Lokasi</label>
        <Input value={lokasi} onChange={(e) => setLokasi(e.target.value)} placeholder="Contoh: Aula Utama" />
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
          onClick={() => onSubmit({ tanggal, jam, judul, lokasi })}
          disabled={!canSave || busy}
        >
          {busy ? 'Menyimpan…' : 'Simpan'}
        </Button>
      </div>
    </div>
  )
}

export function AdministrativeSchedulesPage() {
  const [monthYm, setMonthYm] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const range = useMemo(() => monthRangeFromYearMonth(monthYm), [monthYm])

  const list = useAdministrativeSchedulesList({ dari: range.dari, sampai: range.sampai })
  const createMut = useCreateAdministrativeSchedule()
  const updateMut = useUpdateAdministrativeSchedule()
  const deleteMut = useDeleteAdministrativeSchedule()
  const busy = createMut.isPending || updateMut.isPending

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<AdministrativeSchedule | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  function openCreate() {
    setMode('create')
    setEditing(null)
    setFormError(null)
    setDrawerOpen(true)
  }

  function openEdit(row: AdministrativeSchedule) {
    setMode('edit')
    setEditing(row)
    setFormError(null)
    setDrawerOpen(true)
  }

  async function onSave(vals: { tanggal: string; jam: string; judul: string; lokasi: string }) {
    setFormError(null)
    try {
      if (mode === 'create') await createMut.mutateAsync(vals)
      else if (editing) await updateMut.mutateAsync({ id: editing.id, patch: vals })
      setDrawerOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan data.')
    }
  }

  async function onDelete(row: AdministrativeSchedule) {
    const ok = window.confirm(`Hapus jadwal "${row.judul}"?`)
    if (!ok) return
    try {
      await deleteMut.mutateAsync(row.id)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Gagal menghapus data.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold tracking-editorial text-on-surface">Jadwal Administratif</h1>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Kegiatan administratif per tanggal — tampil di kartu &quot;Jadwal Hari Ini&quot; pada dashboard untuk tanggal yang sama.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <span className="material-symbols-outlined text-[1.25rem]">add</span>
          Tambah Kegiatan
        </Button>
      </div>

      <Card className="p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Periode</label>
          <Input type="month" value={monthYm} onChange={(e) => setMonthYm(e.target.value)} />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {list.isLoading ? (
          <div className="p-6 text-on-surface-variant">Memuat jadwal…</div>
        ) : list.isError ? (
          <div className="p-6 text-on-surface-variant">Gagal memuat jadwal.</div>
        ) : (list.data?.length ?? 0) === 0 ? (
          <div className="p-6 text-on-surface-variant">Belum ada kegiatan pada bulan ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="font-label text-xs font-medium text-on-surface-variant py-3 px-6">Tanggal</th>
                  <th className="font-label text-xs font-medium text-on-surface-variant py-3 px-4">Jam</th>
                  <th className="font-label text-xs font-medium text-on-surface-variant py-3 px-4">Judul</th>
                  <th className="font-label text-xs font-medium text-on-surface-variant py-3 px-4">Lokasi</th>
                  <th className="font-label text-xs font-medium text-on-surface-variant py-3 pl-4 pr-6 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.data!.map((row) => (
                  <tr key={row.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 group">
                    <td className="py-3 px-6 font-body text-sm text-on-surface">{formatIdTanggal(row.tanggal)}</td>
                    <td className="py-3 px-4 font-body text-sm text-on-surface-variant">{row.jam}</td>
                    <td className="py-3 px-4 font-body text-sm text-on-surface">{row.judul}</td>
                    <td className="py-3 px-4 font-body text-sm text-on-surface-variant">{row.lokasi}</td>
                    <td className="py-3 pl-4 pr-6 text-right">
                      <button
                        type="button"
                        className="text-on-surface-variant hover:text-primary transition-colors inline-flex p-1 mr-1"
                        onClick={() => openEdit(row)}
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[1.25rem]">edit</span>
                      </button>
                      <button
                        type="button"
                        className="text-on-surface-variant hover:text-error transition-colors inline-flex p-1"
                        onClick={() => onDelete(row)}
                        title="Hapus"
                      >
                        <span className="material-symbols-outlined text-[1.25rem]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Drawer
        open={drawerOpen}
        title={mode === 'create' ? 'Tambah Jadwal Administratif' : 'Edit Jadwal Administratif'}
        onClose={() => setDrawerOpen(false)}
        footer={null}
      >
        <AdminForm
          key={`${mode}-${editing?.id ?? 'new'}`}
          initial={
            editing
              ? { tanggal: editing.tanggal, jam: editing.jam, judul: editing.judul, lokasi: editing.lokasi }
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
