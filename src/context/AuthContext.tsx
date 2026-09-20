import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { api, discordAuthRedirectUrl, ensureCsrfCookie } from '@/lib/api'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  loginWithDiscord: () => void
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      await ensureCsrfCookie()
      const { data } = await api.get<User>('/auth/me')
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const loginWithDiscord = useCallback(() => {
    window.location.href = discordAuthRedirectUrl()
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout')
    setUser(null)
    window.localStorage.removeItem('hearthgg:activeClientId')
    window.location.href = '/login'
  }, [])

  const value = useMemo(
    () => ({ user, loading, loginWithDiscord, logout, refresh }),
    [user, loading, loginWithDiscord, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
