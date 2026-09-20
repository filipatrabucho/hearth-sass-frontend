import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Send } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useCloseTicket, useReplyTicket, useTicket, useUpdateTicketStatus } from '@/hooks/queries/useTickets'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select, Textarea } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { formatDateTime } from '@/lib/format'
import type { TicketStatus } from '@/types'

const statusTone: Record<TicketStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  open: 'info',
  pending: 'warning',
  resolved: 'success',
  closed: 'neutral',
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { activeClientId } = useClient()
  const { user } = useAuth()
  const { push } = useToast()
  const [body, setBody] = useState('')

  const ticketId = id ? Number(id) : null
  const { data: ticket, isLoading } = useTicket(activeClientId, ticketId)
  const reply = useReplyTicket(activeClientId, ticketId)
  const updateStatus = useUpdateTicketStatus(activeClientId, ticketId)
  const close = useCloseTicket(activeClientId, ticketId)

  if (isLoading || !ticket) return <PageSpinner />

  const handleReply = async () => {
    if (!body.trim()) return
    try {
      await reply.mutateAsync(body.trim())
      setBody('')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handleStatus = async (status: TicketStatus) => {
    try {
      await updateStatus.mutateAsync(status)
      push('Status updated.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handleClose = async () => {
    try {
      await close.mutateAsync()
      push('Ticket closed.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const isClosed = ticket.status === 'closed'

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate('/tickets')}
        className="focus-ring mb-4 flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Back to tickets
      </button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ink">{ticket.subject}</h1>
            <Badge tone={statusTone[ticket.status]}>{ticket.status}</Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-muted">Requester: {ticket.discord_user_id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={ticket.status}
            disabled={isClosed}
            onChange={(e) => handleStatus(e.target.value as TicketStatus)}
            className="w-36"
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </Select>
          {!isClosed && (
            <Button variant="secondary" onClick={handleClose} loading={close.isPending}>
              <Lock size={14} /> Close
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardBody className="space-y-4 pt-5">
          {!ticket.messages?.length ? (
            <p className="text-sm text-ink-muted">No messages yet.</p>
          ) : (
            ticket.messages.map((m) => {
              const staff = !!m.author_user_id
              return (
                <div key={m.id} className="flex items-start gap-3">
                  <Avatar name={staff ? m.author?.global_name ?? m.author?.username ?? 'Staff' : 'Member'} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink">
                        {staff ? m.author?.global_name ?? m.author?.username ?? 'Staff' : 'Member'}
                      </p>
                      {staff && <Badge tone="brand">Staff</Badge>}
                      <span className="text-xs text-ink-faint">{formatDateTime(m.created_at)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-ink-muted">{m.body}</p>
                  </div>
                </div>
              )
            })
          )}
        </CardBody>
      </Card>

      {!isClosed && (
        <Card className="mt-4">
          <CardBody className="pt-4">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`Reply as ${user?.global_name ?? user?.username}…`}
              className="min-h-20"
            />
            <div className="mt-3 flex justify-end">
              <Button variant="primary" onClick={handleReply} loading={reply.isPending} disabled={!body.trim()}>
                <Send size={14} /> Send reply
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
