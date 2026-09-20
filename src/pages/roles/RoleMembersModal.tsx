import { useMemo, useState } from 'react'
import { UserMinus, UserPlus } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useMembers } from '@/hooks/queries/useMembers'
import { useAddRoleToMember, useRemoveRoleFromMember } from '@/hooks/queries/useRoles'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar, discordAvatarUrl } from '@/components/ui/Avatar'
import type { DiscordRole } from '@/types'

export function RoleMembersModal({ role, onClose }: { role: DiscordRole | null; onClose: () => void }) {
  const { activeClientId } = useClient()
  const { push } = useToast()
  const { data: members } = useMembers(activeClientId)
  const addRole = useAddRoleToMember(activeClientId)
  const removeRole = useRemoveRoleFromMember(activeClientId)
  const [search, setSearch] = useState('')

  const holders = useMemo(
    () => (members ?? []).filter((m) => role && m.role_ids?.includes(role.id)),
    [members, role],
  )
  const candidates = useMemo(
    () =>
      (members ?? [])
        .filter((m) => role && !m.role_ids?.includes(role.id))
        .filter((m) => `${m.username} ${m.global_name ?? ''}`.toLowerCase().includes(search.toLowerCase())),
    [members, role, search],
  )

  if (!role) return null

  const handleAdd = async (discordUserId: string) => {
    try {
      await addRole.mutateAsync({ discordUserId, roleId: role.id })
      push('Role added.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handleRemove = async (discordUserId: string) => {
    try {
      await removeRole.mutateAsync({ discordUserId, roleId: role.id })
      push('Role removed.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <Modal open={!!role} onClose={onClose} title={`@${role.name}`} description="Add or remove this role from synced members.">
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Current holders ({holders.length})
          </p>
          {!holders.length ? (
            <p className="text-sm text-ink-muted">No synced members hold this role.</p>
          ) : (
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {holders.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-base-surface-2">
                  <div className="flex items-center gap-2">
                    <Avatar src={discordAvatarUrl(m.discord_user_id, m.avatar_hash, 32) ?? undefined} name={m.username} size={26} />
                    <span className="text-sm text-ink">{m.global_name ?? m.username}</span>
                  </div>
                  <Button size="sm" variant="ghost" loading={removeRole.isPending} onClick={() => handleRemove(m.discord_user_id)}>
                    <UserMinus size={13} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Add member</p>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search synced members…" />
          <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
            {candidates.slice(0, 20).map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-base-surface-2">
                <div className="flex items-center gap-2">
                  <Avatar src={discordAvatarUrl(m.discord_user_id, m.avatar_hash, 32) ?? undefined} name={m.username} size={26} />
                  <span className="text-sm text-ink">{m.global_name ?? m.username}</span>
                </div>
                <Button size="sm" variant="ghost" loading={addRole.isPending} onClick={() => handleAdd(m.discord_user_id)}>
                  <UserPlus size={13} />
                </Button>
              </div>
            ))}
            {!candidates.length && <p className="px-2 py-2 text-xs text-ink-muted">No matches.</p>}
          </div>
        </div>
      </div>
    </Modal>
  )
}
