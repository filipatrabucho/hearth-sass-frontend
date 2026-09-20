import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import { PageSpinner } from '@/components/ui/Spinner'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageSpinner />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <Outlet />
}

export function GuestRoute() {
  const { user, loading } = useAuth()

  if (loading) return <PageSpinner />
  if (user) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
