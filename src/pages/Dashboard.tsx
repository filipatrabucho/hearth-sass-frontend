import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Ticket,
  Newspaper,
  AlertTriangle,
  CalendarDays,
  Radio,
  ExternalLink,
  LifeBuoy,
  Github,
  BadgeCheck,
  ShieldAlert,
  Bot,
  Inbox,
} from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { useClient } from '@/context/ClientContext'
import { useAnalyticsSummary } from '@/hooks/queries/useAnalytics'
import { useTickets } from '@/hooks/queries/useTickets'
import { usePosts } from '@/hooks/queries/usePosts'
import { useLeads } from '@/hooks/queries/useLeads'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge, StatusDot } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/dashboard/StatCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate, formatNumber, formatRelativeTime } from '@/lib/format'
import { meetsRole } from '@/config/nav'
import { LeadDetailModal } from '@/pages/leads/LeadDetailModal'
import type { Lead, LeadStatus } from '@/types'

const leadStatusTone: Record<LeadStatus, 'info' | 'success' | 'brand' | 'neutral'> = {
  new: 'info',
  contacted: 'brand',
  converted: 'success',
  archived: 'neutral',
}

const planLabel: Record<string, string> = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' }

export default function Dashboard() {
  const { user } = useAuth()
  const { activeClient, activeClientId, activeClientLoading, hasModule, role } = useClient()

  const analyticsEnabled = hasModule('analytics')
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary(analyticsEnabled ? activeClientId : null)
  const { data: tickets } = useTickets(hasModule('tickets') ? activeClientId : null)
  const { data: posts } = usePosts(hasModule('posts') ? activeClientId : null)
  const { data: leads } = useLeads({}, !!user?.is_super_admin)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  if (activeClientLoading || !activeClient) return <PageSpinner />

  const botInstalled = !!activeClient.bot_installed_at
  const trialing = activeClient.status === 'active' && activeClient.trial_ends_at && new Date(activeClient.trial_ends_at) > new Date()

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-ink-muted">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {user?.global_name ?? user?.username}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone={botInstalled ? 'success' : 'warning'}>
              <StatusDot tone={botInstalled ? 'success' : 'warning'} />
              {botInstalled ? 'Bot connected' : 'Bot not installed'}
            </Badge>
            <Badge tone={activeClient.status === 'active' ? 'success' : 'danger'}>{activeClient.status}</Badge>
            <Badge tone="brand">{activeClient.name}</Badge>
          </div>
        </div>
        {!botInstalled && meetsRole(role, 'admin') && (
          <Link to="/settings">
            <Button variant="primary">
              <Bot size={15} /> Connect the bot
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {!analyticsEnabled ? (
            <EmptyState
              icon={<ShieldAlert size={26} />}
              title="Analytics module not active"
              description="Enable the analytics module from Settings to see live stats for this server."
            />
          ) : summaryLoading || !summary ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl2 bg-base-surface-2" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatCard
                icon={Radio}
                tone="green"
                label="Members online"
                value={formatNumber(summary.guild.approximate_presence_count)}
              />
              <StatCard
                icon={Users}
                tone="brand"
                label="Total members"
                value={formatNumber(summary.guild.approximate_member_count)}
              />
              <StatCard icon={Ticket} tone="blue" label="Open tickets" value={formatNumber(summary.open_tickets)} />
              <StatCard
                icon={AlertTriangle}
                tone="amber"
                label="Unresolved warnings"
                value={formatNumber(summary.unresolved_warnings)}
              />
              <StatCard
                icon={Newspaper}
                tone="brand"
                label="Published posts"
                value={formatNumber(summary.published_posts)}
              />
              <StatCard
                icon={CalendarDays}
                tone="green"
                label="Upcoming events"
                value={formatNumber(summary.upcoming_events)}
              />
            </div>
          )}

          <Card>
            <CardHeader title="Recent tickets" description="Latest support requests from your community" />
            <CardBody className="pt-3">
              {!hasModule('tickets') ? (
                <p className="text-sm text-ink-muted">Tickets module isn&apos;t active for this client.</p>
              ) : !tickets?.length ? (
                <p className="text-sm text-ink-muted">No tickets yet.</p>
              ) : (
                <div className="divide-y divide-base-border-soft">
                  {tickets.slice(0, 5).map((t) => (
                    <Link
                      key={t.id}
                      to="/tickets"
                      className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-base-surface-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{t.subject}</p>
                        <p className="text-xs text-ink-muted">{formatRelativeTime(t.created_at)}</p>
                      </div>
                      <Badge
                        tone={t.status === 'open' ? 'info' : t.status === 'resolved' ? 'success' : t.status === 'pending' ? 'warning' : 'neutral'}
                      >
                        {t.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent posts" description="Announcements published to your Discord" />
            <CardBody className="pt-3">
              {!hasModule('posts') ? (
                <p className="text-sm text-ink-muted">Posts module isn&apos;t active for this client.</p>
              ) : !posts?.length ? (
                <p className="text-sm text-ink-muted">No posts yet.</p>
              ) : (
                <div className="divide-y divide-base-border-soft">
                  {posts.slice(0, 5).map((p) => (
                    <Link
                      key={p.id}
                      to="/posts"
                      className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-base-surface-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                        <p className="text-xs text-ink-muted">
                          {p.status === 'published' ? `Published ${formatRelativeTime(p.published_at)}` : 'Draft'}
                        </p>
                      </div>
                      <Badge tone={p.status === 'published' ? 'success' : 'neutral'}>{p.status}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {user?.is_super_admin && (
            <Card>
              <CardHeader
                title="Recent sign-ups"
                description="New leads from the marketing site's “get started” form"
                icon={<Inbox size={16} />}
                action={
                  <Link to="/leads" className="text-xs font-semibold text-brand-300 hover:text-brand-200">
                    View all
                  </Link>
                }
              />
              <CardBody className="pt-3">
                {!leads?.length ? (
                  <p className="text-sm text-ink-muted">No sign-ups yet.</p>
                ) : (
                  <div className="divide-y divide-base-border-soft">
                    {leads.slice(0, 5).map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="-mx-2 flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-base-surface-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{lead.name}</p>
                          <p className="truncate text-xs text-ink-muted">
                            {lead.server_name ?? lead.email} · {formatRelativeTime(lead.created_at)}
                          </p>
                        </div>
                        <Badge tone={leadStatusTone[lead.status]} className="capitalize">
                          {lead.status}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-promo-gradient p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/80">Current plan</p>
                <BadgeCheck size={18} className="text-white/80" />
              </div>
              <p className="mt-2 text-3xl font-bold text-white">{planLabel[activeClient.plan] ?? activeClient.plan}</p>
              {trialing && (
                <p className="mt-1 text-xs text-white/75">Trial ends {formatDate(activeClient.trial_ends_at)}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-white/70">Status</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-medium capitalize text-white">
                  {activeClient.status}
                </span>
              </div>
            </div>
            <CardBody>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">Modules</p>
              <div className="space-y-2">
                {activeClient.modules?.length ? (
                  activeClient.modules.map((m) => {
                    const active =
                      m.pivot?.is_enabled &&
                      m.pivot.payment_status !== 'canceled' &&
                      (!m.pivot.paid_until || new Date(m.pivot.paid_until) > new Date())
                    return (
                      <div key={m.id} className="flex items-center justify-between text-sm">
                        <span className="text-ink-muted">{m.name}</span>
                        <Badge tone={active ? 'success' : 'neutral'}>
                          {m.pivot?.is_enabled ? m.pivot.payment_status : 'inactive'}
                        </Badge>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-ink-muted">No modules configured yet.</p>
                )}
              </div>
              {meetsRole(role, 'admin') && (
                <Link to="/settings" className="mt-4 block">
                  <Button variant="secondary" className="w-full justify-center">
                    Manage modules
                  </Button>
                </Link>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="System status" />
            <CardBody className="space-y-3 pt-3">
              {[
                { label: 'Discord bot', ok: botInstalled },
                { label: 'HearthGG API', ok: true },
                { label: `${activeClient.name} server`, ok: activeClient.status === 'active' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">{row.label}</span>
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <StatusDot tone={row.ok ? 'success' : 'danger'} />
                    {row.ok ? 'Online' : 'Action needed'}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Useful links" />
            <CardBody className="grid grid-cols-1 gap-2 pt-3 sm:grid-cols-2">
              <a
                href="https://github.com/filipatrabucho/hearth-sass"
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex items-center justify-center gap-2 rounded-lg border border-base-border bg-base-surface-2 px-3 py-2.5 text-sm font-medium text-ink hover:bg-base-surface-3"
              >
                <LifeBuoy size={15} /> Support guide
              </a>
              <a
                href="https://github.com/filipatrabucho/hearth-sass"
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex items-center justify-center gap-2 rounded-lg border border-base-border bg-base-surface-2 px-3 py-2.5 text-sm font-medium text-ink hover:bg-base-surface-3"
              >
                <Github size={15} /> Repository <ExternalLink size={12} className="text-ink-faint" />
              </a>
            </CardBody>
          </Card>
        </div>
      </div>

      {user?.is_super_admin && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  )
}
