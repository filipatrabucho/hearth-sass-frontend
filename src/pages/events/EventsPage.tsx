import { useState } from 'react'
import { CalendarDays, Plus, MapPin, Hash, Pencil, Trash2 } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useCreateEvent, useDeleteEvent, useEvents, useUpdateEvent, type EventPayload } from '@/hooks/queries/useEvents'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Menu } from '@/components/ui/Menu'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatDateTime } from '@/lib/format'
import { EventFormModal } from '@/pages/events/EventFormModal'
import type { DiscordScheduledEvent } from '@/types'

const entityLabel = { 1: 'Stage', 2: 'Voice', 3: 'External' } as const

export default function EventsPage() {
  const { activeClientId } = useClient()
  const { push } = useToast()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<DiscordScheduledEvent | null>(null)
  const [deleting, setDeleting] = useState<DiscordScheduledEvent | null>(null)

  const { data: events, isLoading } = useEvents(activeClientId)
  const create = useCreateEvent(activeClientId)
  const update = useUpdateEvent(activeClientId)
  const del = useDeleteEvent(activeClientId)

  const sorted = [...(events ?? [])].sort(
    (a, b) => new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime(),
  )

  const handleSubmit = async (payload: EventPayload) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, payload })
        push('Event updated.', 'success')
      } else {
        await create.mutateAsync(payload)
        push('Event created.', 'success')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await del.mutateAsync(deleting.id)
      push('Event deleted.', 'success')
      setDeleting(null)
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Events"
        description="Scheduled events published to your Discord server."
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={15} /> New event
          </Button>
        }
      />

      {isLoading ? (
        <PageSpinner />
      ) : !sorted.length ? (
        <EmptyState icon={<CalendarDays size={26} />} title="No events scheduled" description="Create one to see it here and on Discord." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardBody className="flex flex-1 flex-col pt-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone="brand">{entityLabel[event.entity_type]}</Badge>
                  <Menu
                    actions={[
                      {
                        label: 'Edit',
                        icon: <Pencil size={14} />,
                        onClick: () => {
                          setEditing(event)
                          setFormOpen(true)
                        },
                      },
                      { label: 'Delete', icon: <Trash2 size={14} />, destructive: true, onClick: () => setDeleting(event) },
                    ]}
                  />
                </div>
                <h3 className="mt-2.5 text-sm font-semibold text-ink">{event.name}</h3>
                {event.description && <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{event.description}</p>}
                <div className="mt-3 space-y-1.5 text-xs text-ink-muted">
                  <p>{formatDateTime(event.scheduled_start_time)}</p>
                  <p className="flex items-center gap-1.5">
                    {event.entity_metadata?.location ? (
                      <>
                        <MapPin size={12} /> {event.entity_metadata.location}
                      </>
                    ) : (
                      <>
                        <Hash size={12} /> {event.channel_id ?? 'No channel'}
                      </>
                    )}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <EventFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
        loading={create.isPending || update.isPending}
        initial={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleting?.name}"?`}
        confirmLabel="Delete event"
        loading={del.isPending}
      />
    </div>
  )
}
