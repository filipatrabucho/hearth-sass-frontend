import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { DiscordChannel } from '@/types'

export function useChannels(clientId: number | null) {
  return useQuery({
    queryKey: ['channels', clientId],
    queryFn: async () => (await api.get<DiscordChannel[]>(`/clients/${clientId}/channels`)).data,
    enabled: !!clientId,
    retry: 0,
  })
}
