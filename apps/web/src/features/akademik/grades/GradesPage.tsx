import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { useAcademicYearsList } from '../../master/academicYears/academicYearsQueries'
import { useClassesList } from '../../master/classes/classesQueries'
import { useSubjectsList } from '../../master/subjects/subjectsQueries'
import { useStudentsList } from '../../sdm/students/studentsQueries'
import { useGradebook, useSetGradebookStatus, useUpsertScore } from './gradesQueries'
import type { GradeEntry } from '../../../lib/mockApi/types'

function weightedFinal(params: { categories: Array<{ id: string; bobot: number }>; nilai: Record<string, number | null> }) {
  if (!params.categories.length) return null
  let sum = 0
  let hasAny = false
  for (const c of params.categories) {
    const v = params.nilai[c.id]
    if (v === null || v === undefined || Number.isNaN(v)) continue
    hasAny = true
    sum += (v * c.bobot) / 100
  }
  return hasAny ? Math.round(sum * 10) / 10 : null
}

export function GradesPage() {
  const years = useAcademicYearsList({ q: '', status: '' })
  const classes = useClassesList({ q: '', status: '', tingkat: '' })
  const subjects = useSubjectsList({ q: '', status: '' })

  const [tahunAkademikId, setTahunAkademikId] = useState('ay_1')
  const [kelasId, setKelasId] = useState('cls_1')
  const [mapelId, setMapelId] = useState('subj_1')

  const students = useStudentsList({ q: '', kelasId, jurusanId: '', status: '' })
  const gradebook = useGradebook({ tahunAkademikId, kelasId, mapelId })
  const upsert = useUpsertScore()
  const setStatus = useSetGradebookStatus()

  const categories = useMemo(() => gradebook.data?.categories ?? [], [gradebook.data?.categories])
  const entries = useMemo(() => gradebook.data?.entries ?? [], [gradebook.data?.entries])
  const entryByStudentId = useMemo(() => {
    const m = new Map<string, GradeEntry>()
    for (const e of entries) m.set(e.siswaId, e)
    return m
  }, [entries])

  const status = entries[0]?.status ?? 'draft'

  const kelasName = (classes.data ?? []).find((c) => c.id === kelasId)?.nama ?? '—'
  const mapelName = (subjects.data ?? []).find((s) => s.id === mapelId)?.nama ?? '—'

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold text-on-surface tracking-editorial">Penilaian Akademik</h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Kelola kategori nilai dan input nilai siswa.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setStatus.mutate({ tahunAkademikId, kelasId, mapelId, status: 'draft' })}
            disabled={setStatus.isPending}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={() => setStatus.mutate({ tahunAkademikId, kelasId, mapelId, status: 'draft' })}
            disabled={setStatus.isPending}
          >
            Simpan Draft
          </Button>
          <button
            className="px-5 py-2.5 rounded-xl bg-tertiary text-on-tertiary font-medium text-sm shadow-[0_4px_32px_rgba(0,98,41,0.2)] hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            onClick={() => setStatus.mutate({ tahunAkademikId, kelasId, mapelId, status: 'published' })}
            disabled={setStatus.isPending}
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="text-[1.125rem] font-semibold text-on-surface mb-5 tracking-editorial">Filter Kelas</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[0.75rem] font-medium text-on-surface-variant block mb-1.5">Tahun Akademik</label>
                <div className="relative">
                  <select
                    value={tahunAkademikId}
                    onChange={(e) => setTahunAkademikId(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg text-sm text-on-surface py-2.5 focus:ring-2 focus:ring-primary/30"
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
              <div>
                <label className="text-[0.75rem] font-medium text-on-surface-variant block mb-1.5">Kelas</label>
                <div className="relative">
                  <select
                    value={kelasId}
                    onChange={(e) => setKelasId(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg text-sm text-on-surface py-2.5 focus:ring-2 focus:ring-primary/30"
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
              <div>
                <label className="text-[0.75rem] font-medium text-on-surface-variant block mb-1.5">Mata Pelajaran</label>
                <div className="relative">
                  <select
                    value={mapelId}
                    onChange={(e) => setMapelId(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg text-sm text-on-surface py-2.5 focus:ring-2 focus:ring-primary/30"
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
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[1.125rem] font-semibold text-on-surface tracking-editorial">Kategori Nilai</h3>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/akademik/kategori-nilai')}>
                Kelola
              </Button>
            </div>
            <div className="space-y-3">
              {gradebook.isLoading ? (
                <div className="text-on-surface-variant">Memuat…</div>
              ) : gradebook.isError ? (
                <div className="text-on-surface-variant">Gagal memuat kategori.</div>
              ) : categories.length === 0 ? (
                <div className="text-on-surface-variant">Belum ada kategori nilai.</div>
              ) : (
                categories.map((c) => (
                  <div key={c.id} className="bg-surface-container-low rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-medium text-on-surface">{c.nama}</div>
                      <div className="text-xs text-on-surface-variant font-medium">{c.bobot}%</div>
                    </div>
                    {c.keterangan ? (
                      <div className="text-[0.75rem] text-on-surface-variant">{c.keterangan}</div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="overflow-hidden flex flex-col h-full">
            <div className="p-6 pb-4 flex justify-between items-end bg-surface-container-lowest">
              <div>
                <h3 className="text-[1.125rem] font-semibold text-on-surface tracking-editorial">Input Nilai Siswa</h3>
                <p className="text-[0.75rem] text-on-surface-variant mt-1">
                  {kelasName} • {mapelName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[0.75rem] font-medium text-on-surface-variant px-2 py-1 bg-surface-container rounded-md">
                  Status: {status === 'draft' ? 'Draft' : 'Published'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-[0.75rem] font-medium text-on-surface-variant">
                    <th className="px-6 py-4 font-medium w-12">No</th>
                    <th className="px-6 py-4 font-medium min-w-[220px]">Nama Siswa</th>
                    {categories.map((c) => (
                      <th key={c.id} className="px-4 py-4 font-medium text-center w-28">
                        {c.nama} ({c.bobot}%)
                      </th>
                    ))}
                    <th className="px-6 py-4 font-medium text-center w-28">Nilai Akhir</th>
                  </tr>
                </thead>
                <tbody className="text-[0.875rem] text-on-surface">
                  {students.isLoading || gradebook.isLoading ? (
                    <tr>
                      <td className="px-6 py-6 text-on-surface-variant" colSpan={3 + categories.length}>
                        Memuat data…
                      </td>
                    </tr>
                  ) : (students.data?.length ?? 0) === 0 ? (
                    <tr>
                      <td className="px-6 py-6 text-on-surface-variant" colSpan={3 + categories.length}>
                        Tidak ada siswa untuk kelas ini.
                      </td>
                    </tr>
                  ) : (
                    (students.data ?? []).map((s, idx) => {
                      const entry = entryByStudentId.get(s.id)
                      const nilai = (entry?.nilai ?? {}) as Record<string, number | null>
                      const final = weightedFinal({ categories: categories.map((c) => ({ id: c.id, bobot: c.bobot })), nilai })
                      return (
                        <tr key={s.id} className="hover:bg-surface-container-highest transition-colors group">
                          <td className="px-6 py-4 text-on-surface-variant">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-semibold text-xs">
                                {s.nama
                                  .split(' ')
                                  .slice(0, 2)
                                  .map((p) => p[0])
                                  .join('')
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{s.nama}</div>
                                <div className="text-[0.75rem] text-on-surface-variant">NIS: {s.nis}</div>
                              </div>
                            </div>
                          </td>
                          {categories.map((c) => (
                            <td key={c.id} className="px-4 py-4">
                              <Input
                                type="number"
                                className="w-full bg-surface-container-low border-none rounded-lg py-2 text-center text-sm font-medium focus:ring-2 focus:ring-primary/50 focus:bg-surface-container-lowest transition-all"
                                placeholder="-"
                                value={nilai[c.id] ?? ''}
                                disabled={status === 'published'}
                                onChange={(e) => {
                                  const raw = e.target.value
                                  const score = raw === '' ? null : Number(raw)
                                  upsert.mutate({ tahunAkademikId, kelasId, mapelId, siswaId: s.id, categoryId: c.id, score })
                                }}
                              />
                            </td>
                          ))}
                          <td className="px-6 py-4 text-center font-bold text-primary">{final ?? '-'}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-surface-container-low flex justify-between items-center mt-auto">
              <span className="text-[0.75rem] text-on-surface-variant">
                Menampilkan 1-{students.data?.length ?? 0} dari {students.data?.length ?? 0} siswa
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" disabled>
                  Sebelumnya
                </button>
                <button className="px-3 py-1 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                  Selanjutnya
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

