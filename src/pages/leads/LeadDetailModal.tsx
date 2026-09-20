import { Mail, MessageSquare, Server, User as UserIcon } from 'lucide-react'

import { useDeleteLead, useUpdateLeadStatus } from '@/hooks/queries/useLeads'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/format'
import type { Lead, LeadStatus } from '@/types'

const statusTone: Record<LeadStatus, 'info' | 'success' | 'brand' | 'neutral'> = {
  new: 'info',
  contacted: 'brand',
  converted: 'success',
  archived: 'neutral',
}

const planLabel = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' } as const

export function LeadDetailModal({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  const { push } = useToast()
  const updateStatus = useUpdateLeadStatus()
  const del = useDeleteLead()

  if (!lead) return null

  const handleStatus = async (status: LeadStatus) => {
    try {
      await updateStatus.mutateAsync({ id: lead.id, status })
      push('Lead updated.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handleArchive = async () => {
    try {
      await del.mutateAsync(lead.id)
      push('Lead removed.', 'success')
      onClose()
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <Modal
      open={!!lead}
      onClose={onClose}
      title={lead.name}
      description={`Submitted ${formatDateTime(lead.created_at)} via ${lead.source ?? 'homepage'}`}
      footer={
        <>
          <Button variant="danger" onClick={handleArchive} loading={del.isPending}>
            Delete
          </Button>
          <div className="flex-1" />
          {lead.status !== 'contacted' && (
            <Button variant="secondary" onClick={() => handleStatus('contacted')} loading={updateStatus.isPending}>
              Mark contacted
            </Button>
          )}
          {lead.status !== 'converted' && (
            <Button variant="primary" onClick={() => handleStatus('converted')} loading={updateStatus.isPending}>
              Mark converted
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge tone={statusTone[lead.status]} className="capitalize">
            {lead.status}
          </Badge>
          <Badge tone="neutral">{planLabel[lead.plan_interest]} plan</Badge>
        </div>

        <div className="space-y-2.5 rounded-xl border border-base-border bg-base-surface-2 p-4">
          <div className="flex items-center gap-2.5 text-sm">
            <Mail size={15} className="text-ink-faint" />
            <a href={`mailto:${lead.email}`} className="text-brand-300 hover:text-brand-200">
              {lead.email}
            </a>
          </div>
          {lead.discord_username && (
            <div className="flex items-center gap-2.5 text-sm text-ink">
              <UserIcon size={15} className="text-ink-faint" />
              {lead.discord_username}
            </div>
          )}
          {lead.server_name && (
            <div className="flex items-center gap-2.5 text-sm text-ink">
              <Server size={15} className="text-ink-faint" />
              {lead.server_name}
            </div>
          )}
        </div>

        {lead.message && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <MessageSquare size={12} /> Message
            </p>
            <p className="whitespace-pre-wrap rounded-xl border border-base-border bg-base-surface-2 p-3 text-sm text-ink-muted">
              {lead.message}
            </p>
          </div>
        )}

        {lead.status !== 'archived' && (
          <button
            onClick={() => handleStatus('archived')}
            className="focus-ring text-xs text-ink-faint underline-offset-2 hover:text-ink-muted hover:underline"
          >
            Archive instead of deleting
          </button>
        )}
      </div>
    </Modal>
  )
}
