import { useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Field, Textarea } from '@/components/ui/Input'

export function ReasonModal({
  open,
  onClose,
  onSubmit,
  title,
  description,
  confirmLabel,
  required = false,
  destructive = true,
  loading,
}: {
  open?: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
  title: string
  description?: string
  confirmLabel: string
  required?: boolean
  destructive?: boolean
  loading?: boolean
}) {
  const [reason, setReason] = useState('')

  if (!open) return null

  const disabled = required && !reason.trim()

  return (
    <Modal
      open={!!open}
      onClose={() => {
        setReason('')
        onClose()
      }}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            disabled={disabled}
            loading={loading}
            onClick={() => onSubmit(reason.trim())}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Field label={`Reason${required ? '' : ' (optional)'}`}>
        <Textarea
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain why for the moderation log…"
        />
      </Field>
    </Modal>
  )
}
