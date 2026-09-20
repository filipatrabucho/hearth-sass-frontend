import { useClient } from '@/context/ClientContext'
import { useMemberHistory } from '@/hooks/queries/useMembers'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateTime } from '@/lib/format'
import type { Member } from '@/types'

export function MemberHistoryDrawer({
  open,
  onClose,
  member,
}: {
  open?: boolean
  onClose: () => void
  member: Member | null
}) {
  const { activeClientId } = useClient()
  const { data: warnings, isLoading } = useMemberHistory(activeClientId, open ? member?.discord_user_id ?? null : null)

  if (!open || !member) return null

  return (
    <Modal
      open={!!open}
      onClose={onClose}
      title={`History · ${member.global_name ?? member.username}`}
      description="Warnings recorded against this member."
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !warnings?.length ? (
        <EmptyState title="No warnings" description="This member has a clean record." />
      ) : (
        <ul className="space-y-3">
          {warnings.map((w) => (
            <li key={w.id} className="rounded-xl border border-base-border bg-base-surface-2 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-ink">{w.reason}</p>
                <Badge tone={w.resolved_at ? 'success' : 'warning'}>{w.resolved_at ? 'Resolved' : 'Active'}</Badge>
              </div>
              <p className="mt-1.5 text-xs text-ink-faint">{formatDateTime(w.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
