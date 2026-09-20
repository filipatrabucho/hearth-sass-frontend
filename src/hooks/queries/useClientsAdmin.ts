import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Client, ClientPlan, ClientRole, ClientStatus, Module, PaymentStatus, User } from '@/types'

export interface TeamMember extends User {
  pivot: { role: ClientRole }
}

export function useUsers(enabled: boolean) {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get<User[]>('/users')).data,
    enabled,
  })
}

export function useModulesCatalog() {
  return useQuery({
    queryKey: ['modules-catalog'],
    queryFn: async () => (await api.get<Module[]>('/modules')).data,
  })
}

export interface CreateClientPayload {
  discord_guild_id: string
  name: string
  icon_hash?: string | null
  owner_user_id: number
  plan: ClientPlan
  status: ClientStatus
  trial_ends_at?: string | null
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateClientPayload) => (await api.post<Client>('/clients', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useUpdateClient(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CreateClientPayload>) =>
      (await api.put<Client>(`/clients/${clientId}`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      qc.invalidateQueries({ queryKey: ['client', clientId] })
    },
  })
}

export function useToggleModule(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      moduleId,
      enabled,
      paymentStatus,
      paidUntil,
    }: {
      moduleId: number
      enabled: boolean
      paymentStatus?: PaymentStatus
      paidUntil?: string | null
    }) =>
      api.post(`/clients/${clientId}/modules/${moduleId}`, {
        enabled,
        payment_status: paymentStatus,
        paid_until: paidUntil,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', clientId] })
      qc.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

/**
 * The API has no "list team" endpoint (only add/remove), so this starts
 * empty and is populated from the response of those mutations during the
 * session — see useAddTeamMember/useRemoveTeamMember below.
 */
export function useClientTeam(clientId: number | null) {
  return useQuery({
    queryKey: ['client-team', clientId],
    queryFn: async () => [] as TeamMember[],
    initialData: [] as TeamMember[],
    staleTime: Infinity,
    enabled: !!clientId,
  })
}

export function useAddTeamMember(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: ClientRole }) =>
      (await api.post<TeamMember[]>(`/clients/${clientId}/team`, { user_id: userId, role })).data,
    onSuccess: (data) => {
      qc.setQueryData(['client-team', clientId], data)
    },
  })
}

export function useRemoveTeamMember(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (userId: number) => api.delete(`/clients/${clientId}/team/${userId}`),
    onSuccess: (_data, userId) => {
      qc.setQueryData<TeamMember[] | undefined>(['client-team', clientId], (prev) =>
        prev?.filter((u) => u.id !== userId),
      )
    },
  })
}

export function useRecordBotInstall(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ guildId, permissions }: { guildId: string; permissions: string }) =>
      (await api.post<Client>(`/clients/${clientId}/bot/install`, { guild_id: guildId, permissions })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', clientId] })
      qc.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
