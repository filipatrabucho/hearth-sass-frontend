import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket as TicketIcon, Plus } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useCreateTicket, useTickets } from '@/hooks/queries/useTickets'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Textarea } from '@/components/ui/Input'
import { formatRelativeTime } from '@/lib/format'
import type { TicketStatus } from '@/types'

const statusTone: Record<TicketStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  open: 'info',
  pending: 'warning',
  resolved: 'success',
  closed: 'neutral',
}

export default function TicketsPage() {
  const { activeClientId } = useClient()
  const { push } = useToast()
  const [tab, setTab] = useState<'open' | TicketStatus>('open')
  const [createOpen, setCreateOpen] = useState(false)
  const [discordUserId, setDiscordUserId] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const { data: tickets, isLoading } = useTickets(activeClientId)
  const create = useCreateTicket(activeClientId)

  const filtered = (tickets ?? []).filter((t) => (tab === 'open' ? t.status === 'open' || t.status === 'pending' : t.status === tab))

  const counts = {
    open: (tickets ?? []).filter((t) => t.status === 'open' || t.status === 'pending').length,
    resolved: (tickets ?? []).filter((t) => t.status === 'resolved').length,
    closed: (tickets ?? []).filter((t) => t.status === 'closed').length,
  }

  const handleCreate = async () => {
    try {
      const ticket = await create.mutateAsync({ discord_user_id: discordUserId.trim(), subject: subject.trim(), message: message.trim() || undefined })
      push('Ticket opened.', 'success')
      setCreateOpen(false)
      setDiscordUserId('')
      setSubject('')
      setMessage('')
      void ticket
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Tickets"
        description="Support requests from your community."
        actions={
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            <Plus size={15} /> New ticket
          </Button>
        }
      />

      <div className="mb-4">
        <Tabs
          items={[
            { key: 'open', label: 'Open', count: counts.open },
            { key: 'resolved', label: 'Resolved', count: counts.resolved },
            { key: 'closed', label: 'Closed', count: counts.closed },
          ]}
          active={tab}
          onChange={(k) => setTab(k as typeof tab)}
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !filtered.length ? (
        <EmptyState icon={<TicketIcon size={26} />} title="No tickets here" description="New requests will show up in this list." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Subject</Th>
              <Th>Requester</Th>
              <Th>Status</Th>
              <Th>Opened</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((t) => (
              <Tr key={t.id} className="cursor-pointer">
                <Td>
                  <Link to={`/tickets/${t.id}`} className="font-medium text-ink hover:text-brand-300">
                    {t.subject}
                  </Link>
                </Td>
                <Td className="font-mono text-xs text-ink-muted">{t.discord_user_id}</Td>
                <Td>
                  <Badge tone={statusTone[t.status]}>{t.status}</Badge>
                </Td>
                <Td className="text-ink-muted">{formatRelativeTime(t.created_at)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Open a new ticket"
        description="Start a ticket on behalf of a member."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={create.isPending}
              disabled={!discordUserId.trim() || !subject.trim()}
              onClick={handleCreate}
            >
              Open ticket
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Member Discord ID">
            <Input value={discordUserId} onChange={(e) => setDiscordUserId(e.target.value)} placeholder="123456789012345678" />
          </Field>
          <Field label="Subject">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Can't access the events channel" />
          </Field>
          <Field label="Opening message (optional)">
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add context…" />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
