import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Drawer } from '../../../components/ui/Drawer'
import { Input } from '../../../components/ui/Input'
import type { Weekday } from '../../../lib/mockApi/types'
import { useAcademicYearsList } from '../../master/academicYears/academicYearsQueries'
import { useClassesList } from '../../master/classes/classesQueries'
import { useSubjectsList } from '../../master/subjects/subjectsQueries'
import { useEmployeesList } from '../../sdm/employees/employeesQueries'
import { useCreateSchedule, useDeleteSchedule, useSchedulesList, useUpdateSchedule } from './schedulesQueries'
import type { ScheduleItem } from './schedulesQueries'

const DAYS: Weekday[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

function ScheduleForm({
  initial,
  years,
  classes,
  subjects,
  teachers,
  onSubmit,
  onCancel,
  busy,
  error,
}: {
  initial?: Omit<ScheduleItem, 'id' | 'dibuatPada' | 'diubahPada'>
  years: Array<{ id: string; nama: string }>
  classes: Array<{ id: string; nama: string }>
  subjects: Array<{ id: string; nama: string }>
  teachers: Array<{ id: string; nama: string }>
  onSubmit: (vals: Omit<ScheduleItem, 'id' | 'dibuatPada' | 'diubahPada'>) => void
  onCancel: () => void
  busy: boolean
  error: string | null
}) {
  const [tahunAkademikId, setTahunAkademikId] = useState(initial?.tahunAkademikId ?? years[0]?.id ?? '')
  const [kelasId, setKelasId] = useState(initial?.kelasId ?? classes[0]?.id ?? '')
  const [hari, setHari] = useState<Weekday>(initial?.hari ?? 'Senin')
  const [mulai, setMulai] = useState(initial?.mulai ?? '07:00')
  const [selesai, setSelesai] = useState(initial?.selesai ?? '08:30')
  const [mapelId, setMapelId] = useState(initial?.mapelId ?? subjects[0]?.id ?? '')
  const [guruId, setGuruId] = useState(initial?.guruId ?? teachers[0]?.id ?? '')
  const [ruang, setRuang] = useState(initial?.ruang ?? 'R.101')
  const [status, setStatus] = useState<'aktif' | 'bentrok'>(initial?.status ?? 'aktif')

  const canSave = useMemo(() => !!tahunAkademikId && !!kelasId && !!mapelId && !!guruId && !!ruang.trim(), [
    tahunAkademikId,
    kelasId,
    mapelId,
    guruId,
    ruang,
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Tahun Akademik</label>
          <div className="relative">
            <select
              value={tahunAkademikId}
              onChange={(e) => setTahunAkademikId(e.target.value)}
              className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
            >
              {years.map((y) => (
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
        <div>
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Kelas</label>
          <div className="relative">
            <select
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
            >
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
      </div>

      <div>
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Mata Pelajaran</label>
        <div className="relative">
          <select
            value={mapelId}
            onChange={(e) => setMapelId(e.target.value)}
            className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
          >
            {subjects.map((s) => (
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

      <div>
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Guru Pengajar</label>
        <div className="relative">
          <select
            value={guruId}
            onChange={(e) => setGuruId(e.target.value)}
            className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
          >
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Hari</label>
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
        <div>
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Ruang</label>
          <Input value={ruang} onChange={(e) => setRuang(e.target.value)} placeholder="R.101" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Mulai</label>
          <Input type="time" value={mulai} onChange={(e) => setMulai(e.target.value)} />
        </div>
        <div>
          <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Selesai</label>
          <Input type="time" value={selesai} onChange={(e) => setSelesai(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-[0.75rem] font-medium text-on-surface-variant mb-1.5">Status</label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'aktif' | 'bentrok')}
            className="w-full rounded-xl bg-surface-container-low border-none text-sm text-on-surface focus:ring-2 focus:ring-primary"
          >
            <option value="aktif">Aktif</option>
            <option value="bentrok">Bentrok</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">{error}</div>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={busy}>
          Batal
        </Button>
        <Button variant="primary" type="button" onClick={() => onSubmit({ tahunAkademikId, kelasId, hari, mulai, selesai, mapelId, guruId, ruang: ruang.trim(), status })} disabled={!canSave || busy}>
          {busy ? 'Menyimpan…' : 'Simpan Jadwal'}
        </Button>
      </div>
    </div>
  )
}

export function SchedulesPage() {
  const years = useAcademicYearsList({ q: '', status: '' })
  const classes = useClassesList({ q: '', status: '', tingkat: '' })
  const subjects = useSubjectsList({ q: '', status: '' })
  const teachers = useEmployeesList({ q: '', tipe: 'guru', status: '' })

  const [tahunAkademikId, setTahunAkademikId] = useState('ay_1')
  const [kelasId, setKelasId] = useState('cls_1')

  const list = useSchedulesList({ tahunAkademikId, kelasId })
  const createMut = useCreateSchedule()
  const updateMut = useUpdateSchedule()
  const deleteMut = useDeleteSchedule()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<ScheduleItem | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const busy = createMut.isPending || updateMut.isPending

  const subjectName = useMemo(() => new Map((subjects.data ?? []).map((s) => [s.id, s.nama])), [subjects.data])
  const teacherName = useMemo(() => new Map((teachers.data ?? []).map((t) => [t.id, t.nama])), [teachers.data])

  const timeSlots = useMemo(() => {
    const items = list.data ?? []
    const uniq = new Set(items.map((i) => `${i.mulai}-${i.selesai}`))
    return Array.from(uniq).sort((a, b) => a.localeCompare(b))
  }, [list.data])

  const byDayAndSlot = useMemo(() => {
    const m = new Map<string, ScheduleItem>()
    for (const it of list.data ?? []) {
      m.set(`${it.hari}|${it.mulai}-${it.selesai}`, it)
    }
    return m
  }, [list.data])

  function openCreate() {
    setMode('create')
    setEditing(null)
    setFormError(null)
    setDrawerOpen(true)
  }
  function openEdit(item: ScheduleItem) {
    setMode('edit')
    setEditing(item)
    setFormError(null)
    setDrawerOpen(true)
  }

  async function onSave(vals: Omit<ScheduleItem, 'id' | 'dibuatPada' | 'diubahPada'>) {
    setFormError(null)
    try {
      if (mode === 'create') await createMut.mutateAsync(vals)
      else if (editing) await updateMut.mutateAsync({ id: editing.id, patch: vals })
      setDrawerOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan data.')
    }
  }

  async function onDelete(item: ScheduleItem) {
    const ok = window.confirm(`Hapus jadwal "${subjectName.get(item.mapelId) ?? 'Mapel'}"?`)
    if (!ok) return
    try {
      await deleteMut.mutateAsync(item.id)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Gagal menghapus data.')
    }
  }

  const selectedClassName = (classes.data ?? []).find((c) => c.id === kelasId)?.nama ?? '—'

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-editorial text-on-surface">Jadwal Pelajaran</h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">Manajemen jadwal kelas dan penugasan guru</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <span className="material-symbols-outlined text-[1.25rem]">add</span>
          Tambah Jadwal
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
      </Card>

      <Card className="rounded-xl overflow-x-auto flex flex-col min-h-[500px]">
        <div className="min-w-[900px] flex flex-col h-full">
          <div className="flex bg-surface-container-low sticky top-0 z-10">
            <div className="w-28 shrink-0 p-4 flex items-center justify-center font-medium text-[0.75rem] text-on-surface-variant">
              Waktu
            </div>
            <div className="flex-1 grid grid-cols-5">
              {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as Weekday[]).map((d) => (
                <div key={d} className="p-4 text-center font-medium text-[0.875rem] text-on-surface">
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {list.isLoading ? (
              <div className="p-6 text-on-surface-variant">Memuat jadwal…</div>
            ) : list.isError ? (
              <div className="p-6 text-on-surface-variant">Gagal memuat jadwal.</div>
            ) : timeSlots.length === 0 ? (
              <div className="p-6 text-on-surface-variant">Belum ada jadwal untuk {selectedClassName}.</div>
            ) : (
              timeSlots.map((slot) => {
                const [mulai, selesai] = slot.split('-')
                return (
                  <div key={slot} className="flex min-h-[110px]">
                    <div className="w-28 shrink-0 p-3 flex flex-col items-center justify-center bg-surface-container-low/30">
                      <span className="text-[0.875rem] font-medium text-on-surface">{mulai}</span>
                      <span className="text-[0.75rem] text-on-surface-variant">{selesai}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-5">
                      {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as Weekday[]).map((day) => {
                        const item = byDayAndSlot.get(`${day}|${slot}`)
                        if (!item) {
                          return (
                            <div key={day} className="p-2 hover:bg-surface-container-high transition-colors">
                              <div className="bg-surface-container-low rounded-lg p-3 h-full flex items-center justify-center border border-dashed border-outline-variant/50">
                                <span className="text-[0.75rem] text-on-surface-variant">Kosong</span>
                              </div>
                            </div>
                          )
                        }
                        const isConflict = item.status === 'bentrok'
                        return (
                          <div key={day} className="p-2 hover:bg-surface-container-high transition-colors group">
                            <button
                              className={`w-full text-left rounded-lg p-3 h-full flex flex-col gap-1 border-l-4 ${
                                isConflict ? 'bg-error-container/30 border-error' : 'bg-primary/10 border-primary'
                              }`}
                              onClick={() => openEdit(item)}
                              title="Klik untuk edit"
                            >
                              {isConflict ? (
                                <div className="self-end bg-error text-on-error text-[0.65rem] font-bold px-1.5 py-0.5 rounded-sm">
                                  BENTROK
                                </div>
                              ) : null}
                              <div className={`text-[0.875rem] font-semibold ${isConflict ? 'text-error' : 'text-on-surface'}`}>
                                {subjectName.get(item.mapelId) ?? 'Mapel'}
                              </div>
                              <div className={`text-[0.75rem] ${isConflict ? 'text-error' : 'text-on-surface-variant'} flex items-center gap-1`}>
                                <span className="material-symbols-outlined text-[1rem]">person</span>
                                {teacherName.get(item.guruId) ?? '—'}
                              </div>
                              <div className={`text-[0.75rem] ${isConflict ? 'text-error' : 'text-on-surface-variant'} flex items-center gap-1`}>
                                <span className="material-symbols-outlined text-[1rem]">room</span>
                                {item.ruang}
                              </div>
                            </button>
                            <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="text-on-surface-variant hover:text-error" onClick={() => onDelete(item)} title="Hapus">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </Card>

      <Drawer
        open={drawerOpen}
        title={mode === 'create' ? 'Tambah Jadwal' : 'Edit Jadwal'}
        onClose={() => setDrawerOpen(false)}
        footer={null}
      >
        <ScheduleForm
          initial={
            editing
              ? {
                  tahunAkademikId: editing.tahunAkademikId,
                  kelasId: editing.kelasId,
                  hari: editing.hari,
                  mulai: editing.mulai,
                  selesai: editing.selesai,
                  mapelId: editing.mapelId,
                  guruId: editing.guruId,
                  ruang: editing.ruang,
                  status: editing.status,
                }
              : undefined
          }
          years={(years.data ?? []).map((y) => ({ id: y.id, nama: y.nama }))}
          classes={(classes.data ?? []).map((c) => ({ id: c.id, nama: c.nama }))}
          subjects={(subjects.data ?? []).map((s) => ({ id: s.id, nama: s.nama }))}
          teachers={(teachers.data ?? []).map((t) => ({ id: t.id, nama: t.nama }))}
          onSubmit={onSave}
          onCancel={() => setDrawerOpen(false)}
          busy={busy}
          error={formError}
        />
      </Drawer>
    </div>
  )
}

