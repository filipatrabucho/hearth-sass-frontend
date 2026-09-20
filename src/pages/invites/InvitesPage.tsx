import { RefreshCw, MailPlus } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useInvites, useSyncInvites } from '@/hooks/queries/useInvites'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/format'

export default function InvitesPage() {
  const { activeClientId } = useClient()
  const { push } = useToast()
  const { data: invites, isLoading } = useInvites(activeClientId)
  const sync = useSyncInvites(activeClientId)

  const handleSync = async () => {
    try {
      const res = await sync.mutateAsync()
      push(`Synced ${res.synced} invite${res.synced === 1 ? '' : 's'}.`, 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Invites"
        description="Track which invite links are bringing members into your server."
        actions={
          <Button variant="secondary" onClick={handleSync} loading={sync.isPending}>
            <RefreshCw size={14} /> Sync from Discord
          </Button>
        }
      />

      {isLoading ? (
        <PageSpinner />
      ) : !invites?.length ? (
        <EmptyState icon={<MailPlus size={26} />} title="No invites tracked yet" description="Sync to pull the latest invite links." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Code</Th>
              <Th>Inviter</Th>
              <Th>Uses</Th>
              <Th>Expires</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invites.map((invite) => (
              <Tr key={invite.id}>
                <Td className="font-mono text-sm text-ink">discord.gg/{invite.code}</Td>
                <Td className="font-mono text-xs text-ink-muted">{invite.inviter_discord_id ?? '—'}</Td>
                <Td>
                  <Badge tone="brand">
                    {invite.uses}
                    {invite.max_uses ? ` / ${invite.max_uses}` : ''}
                  </Badge>
                </Td>
                <Td className="text-ink-muted">{invite.expires_at ? formatDate(invite.expires_at) : 'Never'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  )
}
