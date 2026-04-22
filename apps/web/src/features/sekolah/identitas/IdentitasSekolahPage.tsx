import { useMemo, useRef, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import type { SchoolIdentity, SchoolLevel } from '../../../lib/mockApi/types'
import { useSchoolIdentity, useUpdateSchoolIdentity } from './schoolIdentityQueries'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function schoolLevelLabel(level: SchoolLevel) {
  if (level === 'sd') return 'SD / Sederajat'
  if (level === 'smp') return 'SMP / Sederajat'
  return 'SMA / Sederajat'
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Gagal membaca file.'))
    reader.readAsDataURL(file)
  })
}

export function IdentitasSekolahPage() {
  const q = useSchoolIdentity()
  const mut = useUpdateSchoolIdentity()

  const [patch, setPatch] = useState<Partial<SchoolIdentity>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement | null>(null)

  const draft = useMemo(() => {
    if (!q.data) return null
    return { ...q.data, ...patch } satisfies SchoolIdentity
  }, [q.data, patch])

  const dirty = useMemo(() => {
    if (!q.data) return false
    return Object.keys(patch).length > 0
  }, [patch, q.data])

  async function onPickLogo(file: File) {
    setFormError(null)
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('Ukuran file terlalu besar. Maksimal 2MB.')
      if (!/^image\/(png|jpeg|jpg)$/.test(file.type)) throw new Error('Format file harus PNG atau JPG.')
      const dataUrl = await readFileAsDataUrl(file)
      setPatch((p) => ({ ...p, logoDataUrl: dataUrl }))
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal memuat logo.')
    }
  }

  async function onSave() {
    if (!draft) return
    setFormError(null)
    try {
      await mut.mutateAsync(draft)
      setPatch({})
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan perubahan.')
    }
  }

  function onCancel() {
    setPatch({})
    setFormError(null)
  }

  const busy = q.isLoading || mut.isPending

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button variant="ghost" onClick={onCancel} disabled={!dirty || busy}>
        Batal
      </Button>
      <Button variant="primary" onClick={onSave} disabled={!dirty || busy}>
        <span className="material-symbols-outlined text-sm">save</span>
        Simpan Perubahan
      </Button>
    </div>
  )

  if (q.isLoading || !draft) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[1.5rem] font-semibold tracking-tight text-on-surface leading-tight">
              Identitas Sekolah
            </h2>
            <p className="text-[0.875rem] text-on-surface-variant mt-1">Memuat data identitas sekolah…</p>
          </div>
          {headerActions}
        </div>
        <Card className="p-8 rounded-2xl">
          <div className="text-sm text-on-surface-variant">Memuat…</div>
        </Card>
      </div>
    )
  }

  if (q.isError) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[1.5rem] font-semibold tracking-tight text-on-surface leading-tight">
              Identitas Sekolah
            </h2>
            <p className="text-[0.875rem] text-on-surface-variant mt-1">Gagal memuat data.</p>
          </div>
        </div>
        <Card className="p-8 rounded-2xl bg-error-container text-on-error-container">
          <div className="text-sm">Terjadi kesalahan saat mengambil data. Silakan muat ulang halaman.</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[1.75rem] md:text-[2rem] font-semibold text-on-surface tracking-tight mb-2">
              Identitas Sekolah
            </h2>
            <p className="text-on-surface-variant text-[0.875rem] md:text-base max-w-2xl">
              Kelola informasi utama dan identitas visual institusi pendidikan Anda.
            </p>
          </div>
          {headerActions}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <Card className="rounded-2xl p-6 md:p-8 shadow-sm shadow-surface-container-highest/50">
            <div className="mb-8 pb-6 ghost-border border-x-0 border-t-0">
              <h3 className="text-lg font-semibold text-on-surface mb-1">Informasi Dasar</h3>
              <p className="text-sm text-on-surface-variant">Detail resmi institusi yang terdaftar di sistem nasional.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-on-surface">Nama Sekolah</label>
                <Input
                  value={draft.namaSekolah}
                  onChange={(e) => setPatch((p) => ({ ...p, namaSekolah: e.target.value }))}
                  placeholder="Masukkan nama sekolah lengkap"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">NPSN</label>
                <Input
                  value={draft.npsn}
                  onChange={(e) => setPatch((p) => ({ ...p, npsn: e.target.value }))}
                  placeholder="8 digit NPSN"
                  className="rounded-xl font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Jenjang Pendidikan</label>
                <div className="relative">
                  <select
                    value={draft.jenjang}
                    onChange={(e) => setPatch((p) => ({ ...p, jenjang: e.target.value as SchoolLevel }))}
                    className="w-full appearance-none px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="sma">SMA / Sederajat</option>
                    <option value="smp">SMP / Sederajat</option>
                    <option value="sd">SD / Sederajat</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 mb-8 pb-6 ghost-border border-x-0 border-t-0">
              <h3 className="text-lg font-semibold text-on-surface mb-1">Kontak & Lokasi</h3>
              <p className="text-sm text-on-surface-variant">Alamat fisik dan informasi komunikasi resmi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-on-surface">Alamat Lengkap</label>
                <textarea
                  value={draft.alamat}
                  onChange={(e) => setPatch((p) => ({ ...p, alamat: e.target.value }))}
                  rows={3}
                  placeholder="Jalan, RT/RW, Kelurahan"
                  className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Provinsi</label>
                <div className="relative">
                  <select
                    value={draft.provinsi}
                    onChange={(e) => setPatch((p) => ({ ...p, provinsi: e.target.value }))}
                    className="w-full appearance-none px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Kota / Kabupaten</label>
                <div className="relative">
                  <select
                    value={draft.kota}
                    onChange={(e) => setPatch((p) => ({ ...p, kota: e.target.value }))}
                    className="w-full appearance-none px-4 py-3 bg-surface-container-low border-none rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Semarang">Semarang</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Email Resmi</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
                    mail
                  </span>
                  <Input
                    type="email"
                    value={draft.email}
                    onChange={(e) => setPatch((p) => ({ ...p, email: e.target.value }))}
                    placeholder="email@sekolah.sch.id"
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Nomor Telepon</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
                    call
                  </span>
                  <Input
                    value={draft.telepon}
                    onChange={(e) => setPatch((p) => ({ ...p, telepon: e.target.value }))}
                    placeholder="(021) xxxxxxx"
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {formError ? (
              <div className="mt-6 bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">
                {formError}
              </div>
            ) : null}
          </Card>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <Card className="rounded-2xl p-6 md:p-8 shadow-sm shadow-surface-container-highest/50">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Logo Sekolah</h3>
            <button
              type="button"
              className={cx(
                'w-full flex flex-col items-center justify-center p-8 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer group',
                'ghost-border border-2 border-dashed border-outline-variant/40',
              )}
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-24 h-24 mb-4 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform duration-300">
                {draft.logoDataUrl ? (
                  <img alt="Logo Sekolah" className="w-full h-full object-cover rounded-full" src={draft.logoDataUrl} />
                ) : (
                  <div className="w-full h-full rounded-full bg-secondary-container/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">school</span>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-primary mb-1">Klik untuk mengganti</span>
              <span className="text-xs text-on-surface-variant text-center max-w-[220px]">
                Format PNG atau JPG. Maksimal 2MB. Resolusi 1:1 disarankan.
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void onPickLogo(f)
                e.currentTarget.value = ''
              }}
            />
          </Card>

          <Card className="rounded-2xl p-6 md:p-8 shadow-sm shadow-surface-container-highest/50">
            <h3 className="text-lg font-semibold text-on-surface mb-2">Pratinjau Kartu</h3>
            <p className="text-xs text-on-surface-variant mb-6">Tampilan pada kop surat dan dokumen resmi.</p>

            <div className="bg-gradient-to-br from-surface to-surface-container-low p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-surface-container-lowest shadow-sm flex-shrink-0 overflow-hidden p-1">
                  {draft.logoDataUrl ? (
                    <img alt="Logo Preview" className="w-full h-full object-cover rounded-lg" src={draft.logoDataUrl} />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-secondary-container/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">school</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-lg leading-tight mb-1">{draft.namaSekolah}</h4>
                  <div className="text-xs text-on-surface-variant space-y-1">
                    <p className="flex items-center">
                      <span className="material-symbols-outlined text-[14px] mr-1">pin_drop</span>
                      {draft.kota}, {draft.provinsi}
                    </p>
                    <p className="flex items-center">
                      <span className="material-symbols-outlined text-[14px] mr-1">fingerprint</span>
                      NPSN: {draft.npsn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 ghost-border border-x-0 border-b-0 flex justify-between items-center">
                <span className="px-2.5 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-medium rounded-md flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5"></span>
                  {draft.statusAktif ? 'Status Aktif' : 'Nonaktif'}
                </span>
                <span className="text-xs text-outline font-medium">{draft.terverifikasi ? 'Terverifikasi' : 'Belum verifikasi'}</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-on-surface-variant">
              Jenjang: <span className="font-medium text-on-surface">{schoolLevelLabel(draft.jenjang)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

