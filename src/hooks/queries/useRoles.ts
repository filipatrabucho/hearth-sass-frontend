import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { DiscordRole, Member } from '@/types'

export function useRoles(clientId: number | null) {
  return useQuery({
    queryKey: ['roles', clientId],
    queryFn: async () => (await api.get<DiscordRole[]>(`/clients/${clientId}/roles`)).data,
    enabled: !!clientId,
  })
}

export function useStaffMembers(clientId: number | null, roleIds: string[]) {
  return useQuery({
    queryKey: ['roles-staff', clientId, roleIds],
    queryFn: async () =>
      (
        await api.get<Member[]>(`/clients/${clientId}/roles/staff`, {
          params: { role_ids: roleIds },
        })
      ).data,
    enabled: !!clientId && roleIds.length > 0,
  })
}

export function useAddRoleToMember(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ discordUserId, roleId, reason }: { discordUserId: string; roleId: string; reason?: string }) =>
      api.put(`/clients/${clientId}/roles/${roleId}/members/${discordUserId}`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members', clientId] })
      qc.invalidateQueries({ queryKey: ['roles-staff', clientId] })
    },
  })
}

export function useRemoveRoleFromMember(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ discordUserId, roleId, reason }: { discordUserId: string; roleId: string; reason?: string }) =>
      api.delete(`/clients/${clientId}/roles/${roleId}/members/${discordUserId}`, { data: { reason } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members', clientId] })
      qc.invalidateQueries({ queryKey: ['roles-staff', clientId] })
    },
  })
}
