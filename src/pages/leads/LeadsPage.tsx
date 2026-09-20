import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Inbox } from 'lucide-react'

import { useLeads } from '@/hooks/queries/useLeads'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatRelativeTime } from '@/lib/format'
import { LeadDetailModal } from '@/pages/leads/LeadDetailModal'
import type { Lead, LeadStatus } from '@/types'

const statusTone: Record<LeadStatus, 'info' | 'success' | 'brand' | 'neutral'> = {
  new: 'info',
  contacted: 'brand',
  converted: 'success',
  archived: 'neutral',
}

function signupsByDay(leads: Lead[], days = 14) {
  const buckets = new Map<string, number>()
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    buckets.set(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 0)
  }
  for (const lead of leads) {
    const key = new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }
  return Array.from(buckets, ([name, value]) => ({ name, value }))
}

export default function LeadsPage() {
  const { data: leads, isLoading } = useLeads()
  const [tab, setTab] = useState<'all' | LeadStatus>('all')
  const [selected, setSelected] = useState<Lead | null>(null)

  const filtered = (leads ?? []).filter((l) => tab === 'all' || l.status === tab)
  const chartData = useMemo(() => signupsByDay(leads ?? []), [leads])

  const counts = {
    all: leads?.length ?? 0,
    new: (leads ?? []).filter((l) => l.status === 'new').length,
    contacted: (leads ?? []).filter((l) => l.status === 'contacted').length,
    converted: (leads ?? []).filter((l) => l.status === 'converted').length,
  }

  return (
    <div>
      <PageHeader title="Leads" description="Sign-ups from the marketing site's “get started” form." />

      <Card className="mb-6">
        <CardHeader title="Sign-ups, last 14 days" />
        <CardBody className="pt-2">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#211e33" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#9490ad', fontSize: 11 }} axisLine={{ stroke: '#28243d' }} tickLine={false} />
                <YAxis tick={{ fill: '#9490ad', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(122,92,245,0.08)' }}
                  contentStyle={{ background: '#191729', border: '1px solid #28243d', borderRadius: 10, fontSize: 12, color: '#f3f2f8' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#7a5cf5" maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <div className="mb-4">
        <Tabs
          items={[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'new', label: 'New', count: counts.new },
            { key: 'contacted', label: 'Contacted', count: counts.contacted },
            { key: 'converted', label: 'Converted', count: counts.converted },
          ]}
          active={tab}
          onChange={(k) => setTab(k as typeof tab)}
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !filtered.length ? (
        <EmptyState icon={<Inbox size={26} />} title="No leads here" description="New sign-ups from the homepage will show up in this list." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Server</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th>Submitted</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((lead) => (
              <Tr key={lead.id} className="cursor-pointer" onClick={() => setSelected(lead)}>
                <Td className="font-medium text-ink">{lead.name}</Td>
                <Td className="text-ink-muted">{lead.email}</Td>
                <Td className="text-ink-muted">{lead.server_name ?? '—'}</Td>
                <Td>
                  <Badge tone="neutral" className="capitalize">
                    {lead.plan_interest}
                  </Badge>
                </Td>
                <Td>
                  <Badge tone={statusTone[lead.status]} className="capitalize">
                    {lead.status}
                  </Badge>
                </Td>
                <Td className="text-ink-muted">{formatRelativeTime(lead.created_at)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <LeadDetailModal lead={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
