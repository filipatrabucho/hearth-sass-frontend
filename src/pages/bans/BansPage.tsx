import { useState } from 'react'
import { ShieldOff, Search } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useBans, useUnbanMember } from '@/hooks/queries/useMembers'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/Input'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

export default function BansPage() {
  const { activeClientId } = useClient()
  const { push } = useToast()
  const [search, setSearch] = useState('')

  const { data: bans, isLoading } = useBans(activeClientId)
  const unban = useUnbanMember(activeClientId)

  const filtered = (bans ?? []).filter((b) => b.user.username.toLowerCase().includes(search.toLowerCase()))

  const handleUnban = async (discordUserId: string) => {
    try {
      await unban.mutateAsync({ discordUserId })
      push('Member unbanned.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <div>
      <PageHeader title="Bans" description="Members currently banned from your Discord server." />

      <div className="mb-4 relative max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search banned users…" className="pl-9" />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !filtered.length ? (
        <EmptyState
          icon={<ShieldOff size={26} />}
          title="No bans"
          description={bans?.length ? 'Try a different search term.' : 'Nobody is currently banned from this server.'}
        />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Reason</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((b) => (
              <Tr key={b.user.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={b.user.global_name ?? b.user.username} size={32} />
                    <div>
                      <p className="text-sm font-medium text-ink">{b.user.global_name ?? b.user.username}</p>
                      <p className="font-mono text-xs text-ink-muted">{b.user.id}</p>
                    </div>
                  </div>
                </Td>
                <Td className="max-w-xs truncate text-ink-muted">{b.reason || '—'}</Td>
                <Td className="text-right">
                  <Button size="sm" variant="secondary" loading={unban.isPending} onClick={() => handleUnban(b.user.id)}>
                    Unban
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  )
}
