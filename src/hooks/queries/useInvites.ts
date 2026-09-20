import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Invite } from '@/types'

export function useInvites(clientId: number | null) {
  return useQuery({
    queryKey: ['invites', clientId],
    queryFn: async () => (await api.get<Invite[]>(`/clients/${clientId}/invites`)).data,
    enabled: !!clientId,
  })
}

export function useSyncInvites(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => (await api.post<{ synced: number }>(`/clients/${clientId}/invites/sync`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invites', clientId] }),
  })
}
