import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-4 selection:bg-primary-container selection:text-on-primary-container">
      <Outlet />
    </div>
  )
}

