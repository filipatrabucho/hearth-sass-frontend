import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, ensureCsrfCookie } from '@/lib/api'
import type { ClientPlan, Lead, LeadStatus } from '@/types'

export interface LeadSubmission {
  name: string
  email: string
  discord_username?: string
  server_name?: string
  plan_interest: ClientPlan
  message?: string
}

/**
 * The public "get started" form on the marketing homepage. No auth, but
 * still a stateful-origin request, so it needs the XSRF cookie primed
 * first — see App\Http\Middleware\EnsureFrontendRequestsAreStateful.
 */
export function useSubmitLead() {
  return useMutation({
    mutationFn: async (payload: LeadSubmission) => {
      await ensureCsrfCookie()
      return (await api.post<Lead>('/leads', payload)).data
    },
  })
}

export function useLeads(filters: { status?: LeadStatus } = {}, enabled = true) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => (await api.get<Lead[]>('/leads', { params: filters })).data,
    enabled,
  })
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: LeadStatus }) =>
      (await api.put<Lead>(`/leads/${id}/status`, { status })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useDeleteLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/leads/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}
