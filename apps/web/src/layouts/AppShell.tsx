import { useMemo } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppBrandIcon } from '../components/brand/AppBrandIcon'
import { Sidebar } from '../components/ui/Sidebar/Sidebar'
import { Button } from '../components/ui/Button'
import { canAccessPath, navigationForRole } from '../features/auth/access'
import { getAuthUser, setAuthUser } from '../features/auth/authStore'

const breadcrumbLabel: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/akademik/jadwal-administratif': 'Jadwal Administratif',
  '/master/mata-pelajaran': 'Mata Pelajaran',
  '/master/jurusan': 'Jurusan',
  '/master/kelas': 'Kelas',
  '/master/tahun-akademik': 'Tahun Akademik',
}

export function AppShell() {
  const user = getAuthUser()
  const nav = useNavigate()
  const { pathname } = useLocation()

  const navEntries = useMemo(() => navigationForRole(user?.peran ?? 'ADMIN'), [user?.peran])

  const crumb = breadcrumbLabel[pathname] ?? 'SIM Sekolah'

  if (user && !canAccessPath(user.peran, pathname)) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="bg-surface text-on-surface antialiased flex h-screen overflow-hidden">
      <Sidebar
        entries={navEntries}
        footer={
          <div className="flex items-center gap-3 bg-surface-container-highest/50 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm">
              {user?.nama
                ?.split(' ')
                .slice(0, 2)
                .map((p) => p[0])
                .join('')
                .toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-label text-sm font-medium text-on-surface truncate">
                {user?.nama ?? 'Pengguna'}
              </p>
              <p className="font-label text-xs text-on-surface-variant">{user?.peran ?? '-'}</p>
            </div>
          </div>
        }
      />

      <div className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden bg-surface-container-low relative">
        <header className="sticky top-0 z-40 w-full glass shadow-sm font-body tracking-tight">
          <div className="flex items-center justify-between px-8 py-3 w-full">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium">
              <span className="text-on-surface-variant">SIM Sekolah</span>
              <span className="material-symbols-outlined text-base text-outline">chevron_right</span>
              <span className="text-primary font-semibold">{crumb}</span>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <div className="rounded-lg bg-primary-container/15 p-0.5 ring-1 ring-outline-variant/10">
                <AppBrandIcon className="h-8 w-8" />
              </div>
              <span className="font-headline font-black tracking-tighter text-primary text-lg">SIM Sekolah</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAuthUser(null)
                  nav('/login', { replace: true, state: { from: pathname } })
                }}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Keluar
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

