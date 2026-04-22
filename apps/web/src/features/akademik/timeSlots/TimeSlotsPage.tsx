import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import type { EmployeeType, Weekday } from '../../../lib/mockApi/types'
import { useEmployeesList } from '../../sdm/employees/employeesQueries'
import { useCreateTimeSlot, useDeleteTimeSlot, useTimeSlotsList, useUpdateTimeSlot } from './timeSlotsQueries'
import type { TeachingSlot } from './timeSlotsQueries'

const DAYS: Weekday[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

function SlotForm({
  initial,
  teachers,
  onSubmit,
  onCancel,
  busy,
  error,
}: {
  initial?: Pick<TeachingSlot, 'guruId' | 'hari' | 'mulai' | 'selesai' | 'keterangan'>
  teachers: Array<{ id: string; nama: string }>
  onSubmit: (vals: { guruId: string; hari: Weekday; mulai: string; selesai: string; keterangan: string }) => void
  onCancel: () => void
  busy: boolean
  error: string | null
}) {
  const [guruId, setGuruId] = useState(initial?.guruId ?? '')
  const [hari, setHari] = useState<Weekday>(initial?.hari ?? 'Senin')
  const [mulai, setMulai] = useState(initial?.mulai ?? '07:00')
  const [selesai, setSelesai] = useState(initial?.selesai ?? '08:30')
  const [keterangan, setKeterangan] = useState(initial?.keterangan ?? '')
  const canSave = useMemo(() => !!guruId && !!keterangan.trim(), [guruId, keterangan])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Guru</label>
        <div className="relative">
          <select
            value={guruId}
            onChange={(e) => setGuruId(e.target.value)}
            className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih guru</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nama}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Hari</label>
        <div className="relative">
          <select
            value={hari}
            onChange={(e) => setHari(e.target.value as Weekday)}
            className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Mulai</label>
          <Input type="time" value={mulai} onChange={(e) => setMulai(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Selesai</label>
          <Input type="time" value={selesai} onChange={(e) => setSelesai(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">
          Keterangan / Mata Pelajaran
        </label>
        <Input
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder="Contoh: Matematika — X MIPA 1"
        />
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
          onClick={() => onSubmit({ guruId, hari, mulai, selesai, keterangan })}
          disabled={!canSave || busy}
        >
          {busy ? 'Menyimpan…' : 'Simpan Data'}
        </Button>
      </div>
    </div>
  )
}

export function TimeSlotsPage() {
  const [guruId, setGuruId] = useState('')
  const [hari, setHari] = useState<'' | Weekday>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<TeachingSlot | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const teachers = useEmployeesList({ q: '', tipe: 'guru' as EmployeeType, status: '' })
  const list = useTimeSlotsList({ guruId, hari })
  const createMut = useCreateTimeSlot()
  const updateMut = useUpdateTimeSlot()
  const deleteMut = useDeleteTimeSlot()
  const busy = createMut.isPending || updateMut.isPending

  const teacherOptions = useMemo(
    () => (teachers.data ?? []).map((t) => ({ id: t.id, nama: t.nama })),
    [teachers.data],
  )

  function openCreate() {
    setMode('create')
    setEditing(null)
    setFormError(null)
    setDrawerOpen(true)
  }

  function openEdit(slot: TeachingSlot) {
    setMode('edit')
    setEditing(slot)
    setFormError(null)
    setDrawerOpen(true)
  }

  async function onSave(vals: { guruId: string; hari: Weekday; mulai: string; selesai: string; keterangan: string }) {
    setFormError(null)
    try {
      if (mode === 'create') await createMut.mutateAsync(vals)
      else if (editing) await updateMut.mutateAsync({ id: editing.id, patch: vals })
      setDrawerOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan data.')
    }
  }

  async function onDelete(slot: TeachingSlot) {
    const ok = window.confirm(`Hapus slot "${slot.hari} ${slot.mulai} - ${slot.selesai}"?`)
    if (!ok) return
    try {
      await deleteMut.mutateAsync(slot.id)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Gagal menghapus data.')
    }
  }

  const teacherNameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const t of teachers.data ?? []) m.set(t.id, t.nama)
    return m
  }, [teachers.data])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold tracking-editorial text-on-surface">Waktu Mengajar</h1>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Kelola slot waktu mengajar guru.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <span className="material-symbols-outlined text-[1.25rem]">add</span>
          Tambah Slot
        </Button>
      </div>

      <Card className="p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Guru</label>
          <div className="relative">
            <select
              value={guruId}
              onChange={(e) => setGuruId(e.target.value)}
              className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Guru</option>
              {teacherOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="relative w-full lg:w-56">
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1">Hari</label>
          <div className="relative">
            <select
              value={hari}
              onChange={(e) => setHari(e.target.value as '' | Weekday)}
              className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Hari</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {list.isLoading ? (
            <Card className="p-6 text-on-surface-variant">Memuat data…</Card>
          ) : list.isError ? (
            <Card className="p-6 text-on-surface-variant">Gagal memuat data.</Card>
          ) : (list.data?.length ?? 0) === 0 ? (
            <Card className="p-6 text-on-surface-variant">Belum ada slot waktu.</Card>
          ) : (
            list.data!.map((s) => (
              <Card key={s.id} className="p-4 bg-surface-container-lowest">
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-highest transition-colors group">
                  <span className="material-symbols-outlined text-outline-variant">drag_indicator</span>
                  <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="text-[0.875rem] font-medium text-on-surface">
                        {s.hari}
                      </div>
                      <div className="text-[0.875rem] text-on-surface-variant">
                        {s.mulai} - {s.selesai}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[0.875rem] text-on-surface-variant">{s.keterangan}</div>
                      <div className="text-[0.75rem] text-outline mt-1">
                        {teacherNameById.get(s.guruId) ?? '—'}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        onClick={() => openEdit(s)}
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[1.25rem]">edit</span>
                      </button>
                      <button
                        className="text-on-surface-variant hover:text-error transition-colors"
                        onClick={() => onDelete(s)}
                        title="Hapus"
                      >
                        <span className="material-symbols-outlined text-[1.25rem]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="p-6 sticky top-24 h-fit">
          <h3 className="text-[1.125rem] font-semibold text-on-surface mb-2 tracking-editorial">Petunjuk</h3>
          <p className="text-sm text-on-surface-variant">
            Tambahkan slot waktu untuk memudahkan penyusunan jadwal dan input penilaian.
          </p>
        </Card>
      </div>

      <Drawer
        open={drawerOpen}
        title={mode === 'create' ? 'Tambah Slot Waktu' : 'Edit Slot Waktu'}
        onClose={() => setDrawerOpen(false)}
        footer={null}
      >
        <SlotForm
          initial={
            editing
              ? { guruId: editing.guruId, hari: editing.hari, mulai: editing.mulai, selesai: editing.selesai, keterangan: editing.keterangan }
              : undefined
          }
          teachers={teacherOptions}
          onSubmit={onSave}
          onCancel={() => setDrawerOpen(false)}
          busy={busy}
          error={formError}
        />
      </Drawer>
    </div>
  )
}

