import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Warning } from '@/types'

export function useWarnings(clientId: number | null) {
  return useQuery({
    queryKey: ['warnings', clientId],
    queryFn: async () => (await api.get<Warning[]>(`/clients/${clientId}/warnings`)).data,
    enabled: !!clientId,
  })
}

export function useResolveWarning(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (warningId: number) =>
      (await api.post<Warning>(`/clients/${clientId}/warnings/${warningId}/resolve`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warnings', clientId] }),
  })
}
