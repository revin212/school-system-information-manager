import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { downloadExcel } from '../../lib/export/excel'
import { useAcademicYearsList } from '../master/academicYears/academicYearsQueries'
import { useClassesList } from '../master/classes/classesQueries'
import { useSubjectsList } from '../master/subjects/subjectsQueries'
import { useStudentsList } from '../sdm/students/studentsQueries'
import { useGradebook } from '../akademik/grades/gradesQueries'
import type { GradeEntry } from '../../lib/mockApi/types'

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

export function LedgerNilaiPage() {
  const years = useAcademicYearsList({ q: '', status: '' })
  const classes = useClassesList({ q: '', status: '', tingkat: '' })
  const subjects = useSubjectsList({ q: '', status: '' })

  const [tahunAkademikId, setTahunAkademikId] = useState('ay_1')
  const [kelasId, setKelasId] = useState('cls_1')
  const [mapelId, setMapelId] = useState('subj_1')

  const students = useStudentsList({ q: '', kelasId, jurusanId: '', status: '' })
  const gradebook = useGradebook({ tahunAkademikId, kelasId, mapelId })

  const categories = useMemo(() => gradebook.data?.categories ?? [], [gradebook.data?.categories])
  const entries = useMemo(() => gradebook.data?.entries ?? [], [gradebook.data?.entries])

  const entryByStudentId = useMemo(() => {
    const m = new Map<string, GradeEntry>()
    for (const e of entries) m.set(e.siswaId, e)
    return m
  }, [entries])

  const kelasName = (classes.data ?? []).find((c) => c.id === kelasId)?.nama ?? '—'
  const mapelName = (subjects.data ?? []).find((s) => s.id === mapelId)?.nama ?? '—'
  const yearName = (years.data ?? []).find((y) => y.id === tahunAkademikId)?.nama ?? '—'

  function onDownloadExcel() {
    const rows = (students.data ?? []).map((s) => {
      const entry = entryByStudentId.get(s.id)
      const nilai = (entry?.nilai ?? {}) as Record<string, number | null>
      const final = weightedFinal({
        categories: categories.map((c) => ({ id: c.id, bobot: c.bobot })),
        nilai,
      })
      const row: Record<string, string | number> = {
        'Tahun Akademik': yearName,
        Kelas: kelasName,
        'Mata Pelajaran': mapelName,
        NIS: s.nis,
        Nama: s.nama,
      }
      for (const c of categories) row[c.nama] = nilai[c.id] ?? ''
      row['Nilai Akhir'] = final ?? ''
      return row
    })
    downloadExcel({
      filename: `ledger_nilai_${kelasName.replaceAll(' ', '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Ledger Nilai',
      rows,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold text-on-surface tracking-tight leading-tight">Ledger Nilai</h2>
          <p className="text-[0.875rem] text-on-surface-variant mt-1">
            Matriks nilai siswa per mata pelajaran berdasarkan kategori & bobot.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onDownloadExcel} disabled={students.isLoading || gradebook.isLoading}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh Laporan (Excel)
          </Button>
        </div>
      </div>

      <Card className="p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <div className="relative">
            <select
              value={tahunAkademikId}
              onChange={(e) => setTahunAkademikId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
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
          <div className="relative">
            <select
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
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
          <div className="relative">
            <select
              value={mapelId}
              onChange={(e) => setMapelId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary cursor-pointer"
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

      <Card className="rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 pb-4 flex items-end justify-between">
          <div>
            <h3 className="text-[1.125rem] font-semibold text-on-surface tracking-tight">Matriks Ledger</h3>
            <p className="text-[0.75rem] text-on-surface-variant mt-1">
              {kelasName} • {mapelName} • {yearName}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-4 px-6 font-semibold text-xs text-on-surface-variant w-12 text-center">No</th>
                <th className="py-4 px-6 font-semibold text-xs text-on-surface-variant w-72">Nama Siswa</th>
                {categories.map((c) => (
                  <th key={c.id} className="py-4 px-4 font-semibold text-xs text-on-surface-variant text-center w-20">
                    {c.nama}
                  </th>
                ))}
                <th className="py-4 px-6 font-semibold text-xs text-primary text-center bg-primary/5 w-28">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students.isLoading || gradebook.isLoading ? (
                <tr>
                  <td className="py-6 px-6 text-on-surface-variant" colSpan={3 + categories.length}>
                    Memuat data…
                  </td>
                </tr>
              ) : students.isError || gradebook.isError ? (
                <tr>
                  <td className="py-6 px-6 text-on-surface-variant" colSpan={3 + categories.length}>
                    Gagal memuat ledger. Silakan coba lagi.
                  </td>
                </tr>
              ) : (students.data?.length ?? 0) === 0 ? (
                <tr>
                  <td className="py-6 px-6 text-on-surface-variant" colSpan={3 + categories.length}>
                    Tidak ada siswa untuk kelas ini.
                  </td>
                </tr>
              ) : (
                (students.data ?? []).map((s, idx) => {
                  const entry = entryByStudentId.get(s.id)
                  const nilai = (entry?.nilai ?? {}) as Record<string, number | null>
                  const final = weightedFinal({ categories: categories.map((c) => ({ id: c.id, bobot: c.bobot })), nilai })
                  return (
                    <tr key={s.id} className="hover:bg-surface-container-highest/30 transition-colors">
                      <td className="py-3 px-6 text-on-surface-variant text-center">{idx + 1}</td>
                      <td className="py-3 px-6 font-medium text-on-surface">
                        {s.nama}
                        <div className="text-xs text-on-surface-variant mt-0.5">NIS: {s.nis}</div>
                      </td>
                      {categories.map((c) => (
                        <td key={c.id} className="py-3 px-4 text-center text-on-surface">
                          {nilai[c.id] ?? '-'}
                        </td>
                      ))}
                      <td className="py-3 px-6 font-semibold text-primary text-center bg-primary/5">{final ?? '-'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-surface-container-low flex justify-end gap-4">
          <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" disabled>
            Sebelumnya
          </button>
          <span className="text-sm text-outline">1 / 1</span>
          <button className="text-sm font-medium text-primary hover:text-primary-container transition-colors">Selanjutnya</button>
        </div>
      </Card>
    </div>
  )
}

