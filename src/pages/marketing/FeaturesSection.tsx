import { Users, ShieldBan, Ticket, CalendarDays, Newspaper, BarChart3, BadgeCheck, MailPlus } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Members',
    description: 'A searchable, always up-to-date roster of your server, synced straight from Discord.',
  },
  {
    icon: ShieldBan,
    title: 'Moderation',
    description: 'Warn, timeout, kick and ban with a paper trail — every action logged against the member.',
  },
  {
    icon: Ticket,
    title: 'Tickets',
    description: 'Support requests turn into a private channel and a threaded conversation your team can track.',
  },
  {
    icon: CalendarDays,
    title: 'Events',
    description: 'Schedule voice, stage or external events without leaving the dashboard.',
  },
  {
    icon: Newspaper,
    title: 'Announcements',
    description: 'Draft posts, review them, then publish straight to any channel when they’re ready.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Live member counts, activity and audit-log visibility without digging through Discord itself.',
  },
  {
    icon: BadgeCheck,
    title: 'Roles',
    description: 'See who holds which role and manage staff and member roles in a couple of clicks.',
  },
  {
    icon: MailPlus,
    title: 'Invites',
    description: 'Track which invite links are actually bringing members into your community.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-ink">Everything your team needs, one login</h2>
        <p className="mt-3 text-base text-ink-muted">
          Turn on the modules your community actually uses. Each one is built on top of your real
          Discord server — nothing to migrate, nothing to duplicate.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl2 border border-base-border bg-base-surface p-5 transition-colors hover:border-brand-500/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
              <f.icon size={18} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-ink">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
