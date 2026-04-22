import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setAuthUser } from './authStore'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export function LoginPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
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

  return (
    <main className="w-full max-w-5xl bg-surface-container-lowest rounded-full overflow-hidden flex flex-col md:flex-row min-h-[600px] relative shadow-float ghost-border">
      <section className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-surface-container-lowest">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                school
              </span>
            </div>
            <span className="font-headline font-black tracking-tighter text-primary text-xl">
              SIM Sekolah
            </span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-editorial text-on-surface mb-2">
            Masuk ke SIM Sekolah
          </h1>
          <p className="font-body text-on-surface-variant text-sm md:text-base">
            Silakan masukkan kredensial Anda untuk mengakses The Academic Atelier.
          </p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
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
                <label className="block font-label text-xs font-medium text-on-surface-variant">
                  Kata Sandi
                </label>
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
            <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          ) : null}

          <div>
            <Button
              variant="primary"
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-full py-3"
            >
              {loading ? 'Memproses…' : 'Masuk'}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 ghost-border border-x-0 border-b-0 flex justify-center">
          <p className="text-xs text-on-surface-variant/70 font-body">
            © 2026 The Academic Atelier. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </section>

      <section className="hidden md:block md:w-1/2 relative bg-surface-container">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-surface-container-low z-0" />
        <div className="absolute inset-0 p-12 flex flex-col justify-end z-10 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent">
          <div className="max-w-md bg-surface-container-lowest/80 backdrop-blur-2xl p-6 rounded-full shadow-lift border border-outline-variant/20">
            <p className="font-headline text-lg font-semibold text-on-surface mb-2 leading-tight">
              “Platform ini menyederhanakan kompleksitas, memungkinkan kami fokus pada apa yang benar-benar penting:
              pendidikan.”
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm">
                DR
              </div>
              <div>
                <p className="font-label text-sm font-medium text-on-surface">Dr. Rina Saraswati</p>
                <p className="font-body text-xs text-on-surface-variant">Kepala Sekolah, SMA Negeri 1</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

