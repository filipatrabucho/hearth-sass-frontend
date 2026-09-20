import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Post } from '@/types'

export function usePosts(clientId: number | null) {
  return useQuery({
    queryKey: ['posts', clientId],
    queryFn: async () => (await api.get<Post[]>(`/clients/${clientId}/posts`)).data,
    enabled: !!clientId,
  })
}

export function useCreatePost(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { discord_channel_id: string; title: string; content: string }) =>
      (await api.post<Post>(`/clients/${clientId}/posts`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts', clientId] }),
  })
}

export function useUpdatePost(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: { title?: string; content?: string } }) =>
      (await api.put<Post>(`/clients/${clientId}/posts/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts', clientId] }),
  })
}

export function usePublishPost(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await api.post<Post>(`/clients/${clientId}/posts/${id}/publish`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts', clientId] }),
  })
}

export function useDeletePost(clientId: number | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/clients/${clientId}/posts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts', clientId] }),
  })
}
