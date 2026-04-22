import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { USE_MOCK } from '../../lib/api/config'
import type { AuthUser } from './authStore'
import { clearAuthUser, fetchMe, getAuthUser, setAuthUser } from './authStore'

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [checking, setChecking] = useState(!USE_MOCK)
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser())

  useEffect(() => {
    if (USE_MOCK) return
    let alive = true
    fetchMe()
      .then((u) => {
        if (!alive) return
        setAuthUser(u)
        setUser(u)
      })
      .catch(() => {
        if (!alive) return
        clearAuthUser()
        setUser(null)
      })
      .finally(() => {
        if (!alive) return
        setChecking(false)
      })
    return () => {
      alive = false
    }
  }, [])

  if (checking) return <div className="p-6 text-sm text-on-surface-variant">Memuat sesi…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

