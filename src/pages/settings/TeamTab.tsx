import { useState } from 'react'
import { UserMinus, UserPlus } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { useClient } from '@/context/ClientContext'
import { useAddTeamMember, useClientTeam, useRemoveTeamMember, useUsers } from '@/hooks/queries/useClientsAdmin'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import type { ClientRole } from '@/types'

export function TeamTab() {
  const { user } = useAuth()
  const { activeClient, activeClientId } = useClient()
  const { push } = useToast()
  const { data: team } = useClientTeam(activeClientId)
  const { data: users } = useUsers(!!user?.is_super_admin)
  const addMember = useAddTeamMember(activeClientId)
  const removeMember = useRemoveTeamMember(activeClientId)

  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<ClientRole>('staff')

  if (!activeClient) return null

  const alreadyAdded = new Set([activeClient.owner_user_id, ...team.map((t) => t.id)])
  const candidates = users?.filter((u) => !alreadyAdded.has(u.id)) ?? []

  const handleAdd = async () => {
    const id = Number(userId)
    if (!id) return
    try {
      await addMember.mutateAsync({ userId: id, role })
      push('Team member added.', 'success')
      setUserId('')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handleRemove = async (id: number) => {
    try {
      await removeMember.mutateAsync(id)
      push('Team member removed.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <Card>
      <CardHeader title="Team" description="Who on your staff can manage this client in HearthGG." />
      <CardBody className="space-y-5 pt-3">
        <div className="space-y-2">
          {activeClient.owner && (
            <div className="flex items-center justify-between rounded-lg px-2 py-2">
              <div className="flex items-center gap-2.5">
                <Avatar name={activeClient.owner.global_name ?? activeClient.owner.username} size={30} />
                <div>
                  <p className="text-sm font-medium text-ink">{activeClient.owner.global_name ?? activeClient.owner.username}</p>
                  <p className="text-xs text-ink-muted">@{activeClient.owner.username}</p>
                </div>
              </div>
              <Badge tone="brand">Owner</Badge>
            </div>
          )}
          {team
            .filter((t) => t.id !== activeClient.owner_user_id)
            .map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-base-surface-2">
                <div className="flex items-center gap-2.5">
                  <Avatar name={member.global_name ?? member.username} size={30} />
                  <div>
                    <p className="text-sm font-medium text-ink">{member.global_name ?? member.username}</p>
                    <p className="text-xs text-ink-muted">@{member.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral" className="capitalize">
                    {member.pivot.role}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => handleRemove(member.id)} loading={removeMember.isPending}>
                    <UserMinus size={14} />
                  </Button>
                </div>
              </div>
            ))}
          {!team.length && (
            <p className="text-xs text-ink-faint">
              Team members added this session show up here — HearthGG doesn&apos;t expose a full roster endpoint yet.
            </p>
          )}
        </div>

        <div className="border-t border-base-border pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Add a team member</p>
          {user?.is_super_admin ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={userId} onChange={(e) => setUserId(e.target.value)} className="flex-1">
                <option value="">Select a user…</option>
                {candidates.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.global_name ?? u.username} (@{u.username})
                  </option>
                ))}
              </Select>
              <Select value={role} onChange={(e) => setRole(e.target.value as ClientRole)} className="sm:w-32">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </Select>
              <Button variant="primary" onClick={handleAdd} disabled={!userId} loading={addMember.isPending}>
                <UserPlus size={14} /> Add
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <Input id="user-id" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="HearthGG user ID" />
              </div>
              <Select value={role} onChange={(e) => setRole(e.target.value as ClientRole)} className="sm:w-32">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </Select>
              <Button variant="primary" onClick={handleAdd} disabled={!userId} loading={addMember.isPending}>
                <UserPlus size={14} /> Add
              </Button>
            </div>
          )}
          <p className="mt-2 text-xs text-ink-faint">
            They need to have signed in to HearthGG with Discord at least once before you can add them.
          </p>
        </div>
      </CardBody>
    </Card>
  )
}
