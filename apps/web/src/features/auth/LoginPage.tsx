import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setAuthUser } from './authStore'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AppBrandIcon } from '../../components/brand/AppBrandIcon'
import loginHeroImage from '../../assets/image-sekolah.jpg'

const DEMO_PASSWORD = 'password1234'

const DEMO_ACCOUNTS: ReadonlyArray<{ email: string; nama: string; peran: string }> = [
  { email: 'admin@sim.local', nama: 'Admin Utama', peran: 'Administrator' },
  { email: 'tu@sim.local', nama: 'Admin TU', peran: 'Tata usaha' },
  { email: 'guru@sim.local', nama: 'Ibu Sari', peran: 'Guru' },
  { email: 'kepsek@sim.local', nama: 'Bapak Andi', peran: 'Kepala sekolah' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [demoPick, setDemoPick] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => !!identifier.trim() && !!password, [identifier, password])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await login({ identifier, password })
      if (remember) setAuthUser(user)
      else setAuthUser(user) // for now still store; can switch to memory later
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat masuk.')
    } finally {
      setLoading(false)
    }
  }

  function onDemoChange(email: string) {
    setDemoPick(email)
    if (!email) return
    setIdentifier(email)
    setPassword(DEMO_PASSWORD)
    setError(null)
  }

  return (
    <main className="w-full max-w-5xl bg-surface-container-lowest rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[560px] md:min-h-[600px] relative shadow-float ghost-border">
      <section className="w-full md:w-[46%] lg:w-1/2 p-8 md:p-10 lg:p-14 flex flex-col justify-center relative z-10 bg-surface-container-lowest">
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="rounded-xl bg-primary-container/15 p-1 flex items-center justify-center ring-1 ring-outline-variant/10">
              <AppBrandIcon className="h-9 w-9" />
            </div>
            <span className="font-headline font-black tracking-tighter text-primary text-xl">SIM Sekolah</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-editorial text-on-surface mb-2">
            Masuk ke SIM Sekolah
          </h1>
          <p className="font-body text-on-surface-variant text-sm md:text-base leading-relaxed">
            Masukkan kredensial Anda untuk mengakses dashboard sekolah.
          </p>
        </div>

        <form className="space-y-5 md:space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block font-label text-xs font-medium text-on-surface-variant mb-1">
                Email atau NIP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">person</span>
                </div>
                <Input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 rounded-xl"
                  placeholder="nama@sekolah.sch.id"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-label text-xs font-medium text-on-surface-variant">Kata sandi</label>
                <button
                  type="button"
                  className="font-label text-xs font-medium text-primary hover:text-primary-container transition-colors"
                  onClick={() => setError('Fitur ini belum tersedia.')}
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">lock</span>
                </div>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 rounded-xl"
                  placeholder="••••••••"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPass ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-4 space-y-2">
              <label htmlFor="login-demo-account" className="block font-label text-xs font-semibold text-on-surface">
                Akun demo
              </label>
              <p className="font-body text-[0.7rem] text-on-surface-variant leading-snug -mt-0.5 mb-1">
                Pilih akun untuk mengisi email dan kata sandi otomatis (demonstrasi ke calon klien).
              </p>
              <div className="relative">
                <select
                  id="login-demo-account"
                  value={demoPick}
                  onChange={(e) => onDemoChange(e.target.value)}
                  className="w-full appearance-none rounded-xl bg-surface-container-low border-none py-3 pl-3 pr-10 text-sm text-on-surface shadow-sm ring-1 ring-inset ring-outline-variant/15 focus:ring-2 focus:ring-primary"
                >
                  <option value="">— Pilih akun demo —</option>
                  {DEMO_ACCOUNTS.map((row) => (
                    <option key={row.email} value={row.email}>
                      {row.nama} · {row.peran}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                  expand_more
                </span>
              </div>
              <p className="font-body text-[0.7rem] text-on-surface-variant pt-0.5">
                Kata sandi demo (semua akun):{' '}
                <span className="font-mono text-xs text-primary font-medium select-all">{DEMO_PASSWORD}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-surface-container-lowest"
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="ml-2 block text-sm font-body text-on-surface-variant" htmlFor="remember-me">
              Ingat saya di perangkat ini
            </label>
          </div>

          {error ? (
            <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">{error}</div>
          ) : null}

          <Button variant="primary" type="submit" disabled={!canSubmit || loading} className="w-full rounded-full py-3">
            {loading ? 'Memproses…' : 'Masuk'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/15 flex justify-center">
          <p className="text-xs text-on-surface-variant/70 font-body text-center">
            © 2026 The Academic Atelier. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </section>

      <section className="hidden md:block md:flex-1 min-h-[280px] md:min-h-0 relative overflow-hidden bg-surface-container">
        <img
          src={loginHeroImage}
          alt="Gedung dan lingkungan sekolah"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-low/90 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/70 via-transparent to-surface-container-low/20 pointer-events-none" />
      </section>
    </main>
  )
}
