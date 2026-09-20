import { useState } from 'react'
import { Newspaper, Plus, Pencil, Trash2, Send } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useChannels } from '@/hooks/queries/useChannels'
import { useCreatePost, useDeletePost, usePosts, usePublishPost, useUpdatePost } from '@/hooks/queries/usePosts'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Menu } from '@/components/ui/Menu'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatRelativeTime } from '@/lib/format'
import type { Post } from '@/types'

export default function PostsPage() {
  const { activeClientId } = useClient()
  const { push } = useToast()
  const { data: channels } = useChannels(activeClientId)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [channelId, setChannelId] = useState('')

  const { data: posts, isLoading } = usePosts(activeClientId)
  const create = useCreatePost(activeClientId)
  const update = useUpdatePost(activeClientId)
  const publish = usePublishPost(activeClientId)
  const del = useDeletePost(activeClientId)

  const openCreate = () => {
    setEditing(null)
    setTitle('')
    setContent('')
    setChannelId(channels?.[0]?.id ?? '')
    setFormOpen(true)
  }

  const openEdit = (post: Post) => {
    setEditing(post)
    setTitle(post.title)
    setContent(post.content)
    setFormOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, payload: { title: title.trim(), content: content.trim() } })
        push('Post updated.', 'success')
      } else {
        await create.mutateAsync({ discord_channel_id: channelId, title: title.trim(), content: content.trim() })
        push('Post created as draft.', 'success')
      }
      setFormOpen(false)
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handlePublish = async (post: Post) => {
    try {
      await publish.mutateAsync(post.id)
      push('Post published to Discord.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await del.mutateAsync(deleting.id)
      push('Post deleted.', 'success')
      setDeleting(null)
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Posts"
        description="Announcements drafted here and published straight to a Discord channel."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus size={15} /> New post
          </Button>
        }
      />

      {isLoading ? (
        <PageSpinner />
      ) : !posts?.length ? (
        <EmptyState icon={<Newspaper size={26} />} title="No posts yet" description="Draft your first announcement." />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardBody className="flex items-start justify-between gap-4 pt-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-ink">{post.title}</h3>
                    <Badge tone={post.status === 'published' ? 'success' : 'neutral'}>{post.status}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{post.content}</p>
                  <p className="mt-2 text-[11px] text-ink-faint">
                    {post.status === 'published' ? `Published ${formatRelativeTime(post.published_at)}` : `Created ${formatRelativeTime(post.created_at)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {post.status === 'draft' && (
                    <Button size="sm" variant="secondary" onClick={() => handlePublish(post)} loading={publish.isPending}>
                      <Send size={13} /> Publish
                    </Button>
                  )}
                  <Menu
                    actions={[
                      { label: 'Edit', icon: <Pencil size={14} />, onClick: () => openEdit(post) },
                      { label: 'Delete', icon: <Trash2 size={14} />, destructive: true, onClick: () => setDeleting(post) },
                    ]}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit post' : 'New post'}
        description={editing ? undefined : 'Saved as a draft first — publish it when ready.'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!title.trim() || !content.trim() || (!editing && !channelId)}
              loading={create.isPending || update.isPending}
              onClick={handleSubmit}
            >
              {editing ? 'Save changes' : 'Create draft'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {!editing && (
            <Field label="Channel">
              <Select value={channelId} onChange={(e) => setChannelId(e.target.value)}>
                <option value="">Select a channel…</option>
                {channels?.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="We're launching something new…" />
          </Field>
          <Field label="Content">
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-32" />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleting?.title}"?`}
        confirmLabel="Delete post"
        loading={del.isPending}
      />
    </div>
  )
}
