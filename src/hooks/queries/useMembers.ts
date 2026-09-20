import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { DiscordBanEntry, Member, Warning } from '@/types'

export function useMembers(clientId: number | null) {
  return useQuery({
    queryKey: ['members', clientId],
    queryFn: async () => (await api.get<Member[]>(`/clients/${clientId}/members`)).data,
    enabled: !!clientId,
  })
}

export function useSyncMembers(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => (await api.post<{ synced: number }>(`/clients/${clientId}/members/sync`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members', clientId] })
      qc.invalidateQueries({ queryKey: ['bans', clientId] })
    },
  })
}

export function useMemberHistory(clientId: number | null, discordUserId: string | null) {
  return useQuery({
    queryKey: ['member-history', clientId, discordUserId],
    queryFn: async () =>
      (await api.get<Warning[]>(`/clients/${clientId}/members/${discordUserId}/history`)).data,
    enabled: !!clientId && !!discordUserId,
  })
}

export function useKickMember(clientId: number | null) {
  return useMutation({
    mutationFn: async ({ discordUserId, reason }: { discordUserId: string; reason?: string }) =>
      api.post(`/clients/${clientId}/members/${discordUserId}/kick`, { reason }),
  })
}

export function useTimeoutMember(clientId: number | null) {
  return useMutation({
    mutationFn: async ({
      discordUserId,
      until,
      reason,
    }: {
      discordUserId: string
      until?: string | null
      reason?: string
    }) => api.post(`/clients/${clientId}/members/${discordUserId}/timeout`, { until, reason }),
  })
}

export function useWarnMember(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ discordUserId, reason }: { discordUserId: string; reason: string }) =>
      (await api.post<Warning>(`/clients/${clientId}/members/${discordUserId}/warn`, { reason })).data,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['warnings', clientId] })
      qc.invalidateQueries({ queryKey: ['member-history', clientId, vars.discordUserId] })
    },
  })
}

export function useBans(clientId: number | null) {
  return useQuery({
    queryKey: ['bans', clientId],
    queryFn: async () => (await api.get<DiscordBanEntry[]>(`/clients/${clientId}/members/bans`)).data,
    enabled: !!clientId,
  })
}

export function useBanMember(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      discordUserId,
      reason,
      deleteMessageSeconds,
    }: {
      discordUserId: string
      reason?: string
      deleteMessageSeconds?: number
    }) =>
      api.post(`/clients/${clientId}/members/${discordUserId}/ban`, {
        reason,
        delete_message_seconds: deleteMessageSeconds,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bans', clientId] }),
  })
}

export function useUnbanMember(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ discordUserId, reason }: { discordUserId: string; reason?: string }) =>
      api.post(`/clients/${clientId}/members/${discordUserId}/unban`, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bans', clientId] }),
  })
}
