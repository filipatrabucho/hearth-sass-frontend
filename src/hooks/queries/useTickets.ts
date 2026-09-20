import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Ticket, TicketMessage, TicketStatus } from '@/types'

export function useTickets(clientId: number | null) {
  return useQuery({
    queryKey: ['tickets', clientId],
    queryFn: async () => (await api.get<Ticket[]>(`/clients/${clientId}/tickets`)).data,
    enabled: !!clientId,
  })
}

export function useTicket(clientId: number | null, ticketId: number | null) {
  return useQuery({
    queryKey: ['ticket', clientId, ticketId],
    queryFn: async () => (await api.get<Ticket>(`/clients/${clientId}/tickets/${ticketId}`)).data,
    enabled: !!clientId && !!ticketId,
  })
}

export function useCreateTicket(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { discord_user_id: string; subject: string; message?: string }) =>
      (await api.post<Ticket>(`/clients/${clientId}/tickets`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets', clientId] }),
  })
}

export function useReplyTicket(clientId: number | null, ticketId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: string) =>
      (await api.post<TicketMessage>(`/clients/${clientId}/tickets/${ticketId}/reply`, { body })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ticket', clientId, ticketId] })
      qc.invalidateQueries({ queryKey: ['tickets', clientId] })
    },
  })
}

export function useUpdateTicketStatus(clientId: number | null, ticketId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (status: TicketStatus) =>
      (await api.put<Ticket>(`/clients/${clientId}/tickets/${ticketId}/status`, { status })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ticket', clientId, ticketId] })
      qc.invalidateQueries({ queryKey: ['tickets', clientId] })
    },
  })
}

export function useCloseTicket(clientId: number | null, ticketId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => (await api.post<Ticket>(`/clients/${clientId}/tickets/${ticketId}/close`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ticket', clientId, ticketId] })
      qc.invalidateQueries({ queryKey: ['tickets', clientId] })
    },
  })
}
