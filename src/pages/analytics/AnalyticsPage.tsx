import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Users, Radio, Ticket, AlertTriangle, Newspaper, CalendarDays, ScrollText } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useAnalyticsSummary, useAuditLog } from '@/hooks/queries/useAnalytics'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { PageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Input'
import { formatNumber } from '@/lib/format'

export default function AnalyticsPage() {
  const { activeClientId } = useClient()
  const [limit, setLimit] = useState(20)

  const { data: summary, isLoading } = useAnalyticsSummary(activeClientId)
  const { data: auditLog, isLoading: auditLoading } = useAuditLog(activeClientId, { limit })

  if (isLoading || !summary) return <PageSpinner />

  const chartData = [
    { name: 'Members', value: summary.members_cached },
    { name: 'Tickets', value: summary.open_tickets },
    { name: 'Posts', value: summary.published_posts },
    { name: 'Warnings', value: summary.unresolved_warnings },
    { name: 'Events', value: summary.upcoming_events },
  ]

  const entries = auditLog?.audit_log_entries ?? []

  return (
    <div>
      <PageHeader title="Analytics" description="Live snapshot of your server's activity." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Users} tone="brand" label="Members" value={formatNumber(summary.guild.approximate_member_count)} />
        <StatCard icon={Radio} tone="green" label="Online now" value={formatNumber(summary.guild.approximate_presence_count)} />
        <StatCard icon={Ticket} tone="blue" label="Open tickets" value={formatNumber(summary.open_tickets)} />
        <StatCard icon={AlertTriangle} tone="amber" label="Warnings" value={formatNumber(summary.unresolved_warnings)} />
        <StatCard icon={Newspaper} tone="brand" label="Posts" value={formatNumber(summary.published_posts)} />
        <StatCard icon={CalendarDays} tone="green" label="Events" value={formatNumber(summary.upcoming_events)} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Activity breakdown" description="What's active across HearthGG modules right now" />
        <CardBody className="pt-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#211e33" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#9490ad', fontSize: 12 }} axisLine={{ stroke: '#28243d' }} tickLine={false} />
                <YAxis tick={{ fill: '#9490ad', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(122,92,245,0.08)' }}
                  contentStyle={{
                    background: '#191729',
                    border: '1px solid #28243d',
                    borderRadius: 10,
                    fontSize: 12,
                    color: '#f3f2f8',
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#7a5cf5" maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Audit log"
          description="Recent moderation actions straight from Discord"
          icon={<ScrollText size={16} />}
          action={
            <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="w-28">
              <option value={10}>Last 10</option>
              <option value={20}>Last 20</option>
              <option value={50}>Last 50</option>
              <option value={100}>Last 100</option>
            </Select>
          }
        />
        <CardBody className="pt-3">
          {auditLoading ? (
            <PageSpinner />
          ) : !entries.length ? (
            <EmptyState title="No audit log entries" description="Discord hasn't recorded any actions yet." />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Action</Th>
                  <Th>User</Th>
                  <Th>Target</Th>
                  <Th>Reason</Th>
                </Tr>
              </Thead>
              <Tbody>
                {entries.map((entry) => (
                  <Tr key={entry.id}>
                    <Td className="text-ink">{entry.action_type}</Td>
                    <Td className="font-mono text-xs text-ink-muted">{entry.user_id ?? '—'}</Td>
                    <Td className="font-mono text-xs text-ink-muted">{entry.target_id ?? '—'}</Td>
                    <Td className="max-w-xs truncate text-ink-muted">{entry.reason ?? '—'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
