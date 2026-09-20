import { useState } from 'react'
import { RefreshCw, Search, UserX, Clock, MessageSquareWarning, Ban, History } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import {
  useBanMember,
  useKickMember,
  useMembers,
  useSyncMembers,
  useTimeoutMember,
  useWarnMember,
} from '@/hooks/queries/useMembers'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Avatar, discordAvatarUrl } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Menu } from '@/components/ui/Menu'
import { formatDate } from '@/lib/format'
import type { Member } from '@/types'
import { ReasonModal } from '@/pages/members/ReasonModal'
import { TimeoutModal } from '@/pages/members/TimeoutModal'
import { MemberHistoryDrawer } from '@/pages/members/MemberHistoryDrawer'

type ActiveAction =
  | { type: 'kick' | 'warn' | 'ban'; member: Member }
  | { type: 'timeout'; member: Member }
  | { type: 'history'; member: Member }
  | null

export default function MembersPage() {
  const { activeClientId, hasModule } = useClient()
  const { push } = useToast()
  const [search, setSearch] = useState('')
  const [action, setAction] = useState<ActiveAction>(null)

  const { data: members, isLoading } = useMembers(activeClientId)
  const sync = useSyncMembers(activeClientId)
  const kick = useKickMember(activeClientId)
  const warn = useWarnMember(activeClientId)
  const ban = useBanMember(activeClientId)
  const timeout = useTimeoutMember(activeClientId)

  const bansEnabled = hasModule('bans')

  const filtered = (members ?? []).filter((m) =>
    `${m.username} ${m.global_name ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSync = async () => {
    try {
      const res = await sync.mutateAsync()
      push(`Synced ${res.synced} member${res.synced === 1 ? '' : 's'} from Discord.`, 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Members"
        description="Everyone in your Discord server, cached for fast search and moderation."
        actions={
          <Button variant="secondary" onClick={handleSync} loading={sync.isPending}>
            <RefreshCw size={14} /> Sync from Discord
          </Button>
        }
      />

      <div className="mb-4 relative max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members…"
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !filtered.length ? (
        <EmptyState
          title="No members found"
          description={members?.length ? 'Try a different search term.' : 'Sync from Discord to load your member list.'}
        />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Member</Th>
              <Th>Discord ID</Th>
              <Th>Joined</Th>
              <Th>Last synced</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((m) => (
              <Tr key={m.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar src={discordAvatarUrl(m.discord_user_id, m.avatar_hash, 40) ?? undefined} name={m.global_name ?? m.username} size={32} />
                    <div>
                      <p className="text-sm font-medium text-ink">{m.global_name ?? m.username}</p>
                      <p className="text-xs text-ink-muted">@{m.username}</p>
                    </div>
                  </div>
                </Td>
                <Td className="font-mono text-xs text-ink-muted">{m.discord_user_id}</Td>
                <Td className="text-ink-muted">{formatDate(m.joined_discord_at)}</Td>
                <Td className="text-ink-muted">{formatDate(m.synced_at)}</Td>
                <Td className="text-right">
                  <Menu
                    actions={[
                      { label: 'View history', icon: <History size={14} />, onClick: () => setAction({ type: 'history', member: m }) },
                      { label: 'Warn', icon: <MessageSquareWarning size={14} />, onClick: () => setAction({ type: 'warn', member: m }) },
                      { label: 'Timeout', icon: <Clock size={14} />, onClick: () => setAction({ type: 'timeout', member: m }) },
                      { label: 'Kick', icon: <UserX size={14} />, destructive: true, onClick: () => setAction({ type: 'kick', member: m }) },
                      ...(bansEnabled
                        ? [{ label: 'Ban', icon: <Ban size={14} />, destructive: true, onClick: () => setAction({ type: 'ban', member: m }) }]
                        : []),
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <ReasonModal
        open={action?.type === 'kick'}
        onClose={() => setAction(null)}
        title={`Kick ${action?.member.global_name ?? action?.member.username ?? ''}`}
        description="They'll be removed from the server but can rejoin with a new invite."
        confirmLabel="Kick member"
        required={false}
        loading={kick.isPending}
        onSubmit={async (reason) => {
          if (action?.type !== 'kick') return
          try {
            await kick.mutateAsync({ discordUserId: action.member.discord_user_id, reason })
            push('Member kicked.', 'success')
            setAction(null)
          } catch (e) {
            push(extractErrorMessage(e), 'error')
          }
        }}
      />

      <ReasonModal
        open={action?.type === 'warn'}
        onClose={() => setAction(null)}
        title={`Warn ${action?.member.global_name ?? action?.member.username ?? ''}`}
        description="A record is kept and the member is notified via DM."
        confirmLabel="Send warning"
        required
        destructive={false}
        loading={warn.isPending}
        onSubmit={async (reason) => {
          if (action?.type !== 'warn') return
          try {
            await warn.mutateAsync({ discordUserId: action.member.discord_user_id, reason })
            push('Warning issued.', 'success')
            setAction(null)
          } catch (e) {
            push(extractErrorMessage(e), 'error')
          }
        }}
      />

      <ReasonModal
        open={action?.type === 'ban'}
        onClose={() => setAction(null)}
        title={`Ban ${action?.member.global_name ?? action?.member.username ?? ''}`}
        description="They'll be removed and unable to rejoin until unbanned."
        confirmLabel="Ban member"
        required={false}
        loading={ban.isPending}
        onSubmit={async (reason) => {
          if (action?.type !== 'ban') return
          try {
            await ban.mutateAsync({ discordUserId: action.member.discord_user_id, reason })
            push('Member banned.', 'success')
            setAction(null)
          } catch (e) {
            push(extractErrorMessage(e), 'error')
          }
        }}
      />

      <TimeoutModal
        open={action?.type === 'timeout'}
        onClose={() => setAction(null)}
        title={`Timeout ${action?.member.global_name ?? action?.member.username ?? ''}`}
        loading={timeout.isPending}
        onSubmit={async (until, reason) => {
          if (action?.type !== 'timeout') return
          try {
            await timeout.mutateAsync({ discordUserId: action.member.discord_user_id, until, reason })
            push('Member timed out.', 'success')
            setAction(null)
          } catch (e) {
            push(extractErrorMessage(e), 'error')
          }
        }}
      />

      <MemberHistoryDrawer
        open={action?.type === 'history'}
        onClose={() => setAction(null)}
        member={action?.type === 'history' ? action.member : null}
      />
    </div>
  )
}
