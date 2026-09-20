import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { Client, ClientRole, ModuleKey } from '@/types'

const STORAGE_KEY = 'hearthgg:activeClientId'

function isModuleActive(client: Client | undefined, key: ModuleKey | string): boolean {
  const mod = client?.modules?.find((m) => m.key === key)
  if (!mod?.pivot) return false
  if (!mod.pivot.is_enabled || mod.pivot.payment_status === 'canceled') return false
  if (!mod.pivot.paid_until) return true
  return new Date(mod.pivot.paid_until).getTime() > Date.now()
}

interface ClientContextValue {
  clients: Client[]
  clientsLoading: boolean
  clientsError: boolean
  refetchClients: () => void
  activeClient: Client | undefined
  activeClientId: number | null
  activeClientLoading: boolean
  activeClientError: boolean
  setActiveClientId: (id: number) => void
  role: ClientRole
  hasModule: (key: ModuleKey | string) => boolean
  refetchActiveClient: () => void
}

const ClientContext = createContext<ClientContextValue | null>(null)

export function ClientProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [activeClientId, setActiveClientIdState] = useState<number | null>(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? Number(raw) : null
  })

  const {
    data: clients = [],
    isLoading: clientsLoading,
    isError: clientsError,
    refetch: refetchClients,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => (await api.get<Client[]>('/clients')).data,
    enabled: !!user,
  })

  useEffect(() => {
    if (!clients.length) return
    const stillValid = activeClientId && clients.some((c) => c.id === activeClientId)
    if (!stillValid) {
      setActiveClientIdState(clients[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients])

  const setActiveClientId = (id: number) => {
    setActiveClientIdState(id)
    window.localStorage.setItem(STORAGE_KEY, String(id))
  }

  const {
    data: activeClient,
    isLoading: activeClientLoading,
    isError: activeClientError,
    refetch: refetchActiveClient,
  } = useQuery({
    queryKey: ['client', activeClientId],
    queryFn: async () => (await api.get<Client>(`/clients/${activeClientId}`)).data,
    enabled: !!activeClientId,
  })

  useEffect(() => {
    if (!user) {
      qc.removeQueries({ queryKey: ['clients'] })
      qc.removeQueries({ queryKey: ['client'] })
      setActiveClientIdState(null)
    }
  }, [user, qc])

  const role: ClientRole = useMemo(() => {
    if (user?.is_super_admin) return 'owner'
    return activeClient?.pivot?.role ?? 'staff'
  }, [user, activeClient])

  const value: ClientContextValue = useMemo(
    () => ({
      clients,
      clientsLoading,
      clientsError,
      refetchClients: () => refetchClients(),
      activeClient,
      activeClientId,
      activeClientLoading,
      activeClientError,
      setActiveClientId,
      role,
      hasModule: (key) => isModuleActive(activeClient, key),
      refetchActiveClient: () => refetchActiveClient(),
    }),
    [
      clients,
      clientsLoading,
      clientsError,
      refetchClients,
      activeClient,
      activeClientId,
      activeClientLoading,
      activeClientError,
      role,
      refetchActiveClient,
    ],
  )

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
}

export function useClient(): ClientContextValue {
  const ctx = useContext(ClientContext)
  if (!ctx) throw new Error('useClient must be used within ClientProvider')
  return ctx
}
