import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useResolveWarning, useWarnings } from '@/hooks/queries/useWarnings'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/format'

export default function WarningsPage() {
  const { activeClientId } = useClient()
  const { push } = useToast()
  const [tab, setTab] = useState<'active' | 'resolved'>('active')

  const { data: warnings, isLoading } = useWarnings(activeClientId)
  const resolve = useResolveWarning(activeClientId)

  const filtered = (warnings ?? []).filter((w) => (tab === 'active' ? !w.resolved_at : !!w.resolved_at))
  const activeCount = (warnings ?? []).filter((w) => !w.resolved_at).length

  const handleResolve = async (id: number) => {
    try {
      await resolve.mutateAsync(id)
      push('Warning resolved.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <div>
      <PageHeader title="Warnings" description="Moderation warnings issued to members." />

      <div className="mb-4">
        <Tabs
          items={[
            { key: 'active', label: 'Active', count: activeCount },
            { key: 'resolved', label: 'Resolved' },
          ]}
          active={tab}
          onChange={(k) => setTab(k as 'active' | 'resolved')}
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !filtered.length ? (
        <EmptyState icon={<AlertTriangle size={26} />} title={`No ${tab} warnings`} />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Member</Th>
              <Th>Reason</Th>
              <Th>Issued</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((w) => (
              <Tr key={w.id}>
                <Td className="font-mono text-xs text-ink-muted">{w.discord_user_id}</Td>
                <Td className="max-w-sm truncate text-ink">{w.reason}</Td>
                <Td className="text-ink-muted">{formatDateTime(w.created_at)}</Td>
                <Td className="text-right">
                  {w.resolved_at ? (
                    <Badge tone="success">Resolved</Badge>
                  ) : (
                    <Button size="sm" variant="secondary" loading={resolve.isPending} onClick={() => handleResolve(w.id)}>
                      Mark resolved
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  )
}
