import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { DiscordScheduledEvent } from '@/types'

export interface EventPayload {
  name: string
  description?: string
  scheduled_start_time: string
  scheduled_end_time?: string | null
  entity_type: 1 | 2 | 3
  channel_id?: string
  location?: string
}

export function useEvents(clientId: number | null) {
  return useQuery({
    queryKey: ['events', clientId],
    queryFn: async () => (await api.get<DiscordScheduledEvent[]>(`/clients/${clientId}/events`)).data,
    enabled: !!clientId,
  })
}

export function useCreateEvent(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: EventPayload) =>
      (await api.post<DiscordScheduledEvent>(`/clients/${clientId}/events`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events', clientId] }),
  })
}

export function useUpdateEvent(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<EventPayload> }) =>
      (await api.put<DiscordScheduledEvent>(`/clients/${clientId}/events/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events', clientId] }),
  })
}

export function useDeleteEvent(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/clients/${clientId}/events/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events', clientId] }),
  })
}
