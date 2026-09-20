import { useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'

const DURATIONS = [
  { label: '10 minutes', minutes: 10 },
  { label: '1 hour', minutes: 60 },
  { label: '1 day', minutes: 60 * 24 },
  { label: '1 week', minutes: 60 * 24 * 7 },
  { label: 'Custom date/time', minutes: 0 },
]

export function TimeoutModal({
  open,
  onClose,
  onSubmit,
  title,
  loading,
}: {
  open?: boolean
  onClose: () => void
  onSubmit: (until: string, reason: string) => void
  title: string
  loading?: boolean
}) {
  const [durationIdx, setDurationIdx] = useState(1)
  const [customDate, setCustomDate] = useState('')
  const [reason, setReason] = useState('')

  if (!open) return null

  const custom = DURATIONS[durationIdx].minutes === 0

  const computeUntil = () => {
    if (custom) return customDate ? new Date(customDate).toISOString() : ''
    return new Date(Date.now() + DURATIONS[durationIdx].minutes * 60_000).toISOString()
  }

  const until = computeUntil()

  return (
    <Modal
      open={!!open}
      onClose={onClose}
      title={title}
      description="The member won't be able to send messages or join voice until this expires."
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!until} loading={loading} onClick={() => onSubmit(until, reason.trim())}>
            Apply timeout
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Duration">
          <Select value={durationIdx} onChange={(e) => setDurationIdx(Number(e.target.value))}>
            {DURATIONS.map((d, i) => (
              <option key={d.label} value={i}>
                {d.label}
              </option>
            ))}
          </Select>
        </Field>
        {custom && (
          <Field label="Until">
            <Input type="datetime-local" value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
          </Field>
        )}
        <Field label="Reason (optional)">
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why…" />
        </Field>
      </div>
    </Modal>
  )
}
