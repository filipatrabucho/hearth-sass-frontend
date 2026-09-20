import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AnalyticsSummary, DiscordAuditLogEntry, DiscordGuildStats } from '@/types'

export function useAnalyticsSummary(clientId: number | null) {
  return useQuery({
    queryKey: ['analytics-summary', clientId],
    queryFn: async () => (await api.get<AnalyticsSummary>(`/clients/${clientId}/analytics/summary`)).data,
    enabled: !!clientId,
  })
}

export function useGuildStats(clientId: number | null) {
  return useQuery({
    queryKey: ['analytics-guild-stats', clientId],
    queryFn: async () => (await api.get<DiscordGuildStats>(`/clients/${clientId}/analytics/guild-stats`)).data,
    enabled: !!clientId,
  })
}

export function useAuditLog(clientId: number | null, filters: { limit?: number } = {}) {
  return useQuery({
    queryKey: ['analytics-audit-log', clientId, filters],
    queryFn: async () =>
      (
        await api.get<{ audit_log_entries?: DiscordAuditLogEntry[] }>(`/clients/${clientId}/analytics/audit-log`, {
          params: filters,
        })
      ).data,
    enabled: !!clientId,
  })
}
