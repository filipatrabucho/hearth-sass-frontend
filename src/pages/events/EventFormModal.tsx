import { useEffect, useState } from 'react'

import { useClient } from '@/context/ClientContext'
import { useChannels } from '@/hooks/queries/useChannels'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import type { EventPayload } from '@/hooks/queries/useEvents'
import type { DiscordScheduledEvent } from '@/types'

function toLocalInput(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function EventFormModal({
  open,
  onClose,
  onSubmit,
  loading,
  initial,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (payload: EventPayload) => void
  loading?: boolean
  initial?: DiscordScheduledEvent | null
}) {
  const { activeClientId } = useClient()
  const { data: channels } = useChannels(activeClientId)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [entityType, setEntityType] = useState<1 | 2 | 3>(2)
  const [channelId, setChannelId] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? '')
    setDescription(initial?.description ?? '')
    setStart(toLocalInput(initial?.scheduled_start_time))
    setEnd(toLocalInput(initial?.scheduled_end_time))
    setEntityType(initial?.entity_type ?? 2)
    setChannelId(initial?.channel_id ?? '')
    setLocation(initial?.entity_metadata?.location ?? '')
  }, [open, initial])

  const voiceOrStage = entityType === 1 || entityType === 2
  const valid = name.trim() && start && (voiceOrStage ? channelId : location.trim())

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      scheduled_start_time: new Date(start).toISOString(),
      scheduled_end_time: end ? new Date(end).toISOString() : null,
      entity_type: entityType,
      channel_id: voiceOrStage ? channelId : undefined,
      location: !voiceOrStage ? location.trim() : undefined,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit event' : 'New scheduled event'}
      description="Shows up directly on your Discord server's Events tab."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!valid} loading={loading} onClick={handleSubmit}>
            {initial ? 'Save changes' : 'Create event'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Community game night" />
        </Field>
        <Field label="Description (optional)">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Starts">
            <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Ends (optional)">
            <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>
        <Field label="Location type">
          <Select value={entityType} onChange={(e) => setEntityType(Number(e.target.value) as 1 | 2 | 3)}>
            <option value={2}>Voice channel</option>
            <option value={1}>Stage channel</option>
            <option value={3}>External location</option>
          </Select>
        </Field>
        {voiceOrStage ? (
          <Field label="Channel" hint={!channels?.length ? "Couldn't load channels — check the members module is active." : undefined}>
            <Select value={channelId} onChange={(e) => setChannelId(e.target.value)}>
              <option value="">Select a channel…</option>
              {channels?.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.name}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <Field label="Location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Community Discord stage, Twitch, …" />
          </Field>
        )}
      </div>
    </Modal>
  )
}
