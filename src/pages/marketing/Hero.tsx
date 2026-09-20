import { ArrowRight, Radio, Ticket, Users } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { StatusDot } from '@/components/ui/Badge'

function PreviewCard() {
  return (
    <div className="relative mx-auto w-full max-w-md rotate-1 rounded-xl2 border border-base-border bg-base-surface p-4 shadow-card sm:rotate-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-muted">Nightfall Gaming</p>
          <p className="text-sm font-semibold text-ink">Server overview</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-accent-green/25 bg-accent-green/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
          <StatusDot tone="success" /> Bot online
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { icon: Users, label: 'Members', value: '4,281' },
          { icon: Radio, label: 'Online', value: '612' },
          { icon: Ticket, label: 'Tickets', value: '3' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-base-border bg-base-surface-2 p-3">
            <s.icon size={14} className="text-brand-300" />
            <p className="mt-2 text-base font-bold text-ink">{s.value}</p>
            <p className="text-[11px] text-ink-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2 rounded-xl border border-base-border bg-base-surface-2 p-3">
        {['New warning issued', 'Event "Game night" scheduled', 'Post published to #announcements'].map((row) => (
          <div key={row} className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            {row}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-brand-800/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200">
            Built for Discord community teams
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Run your Discord community like a real product.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted">
            HearthGG brings moderation, tickets, events, announcements and analytics for your
            Discord server into one dashboard — so your team stops juggling bots, spreadsheets and
            DMs to keep things running.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" onClick={onGetStarted}>
              Get started free <ArrowRight size={16} />
            </Button>
            <a href="#features">
              <Button variant="outline-brand" size="lg" className="w-full sm:w-auto">
                See what it does
              </Button>
            </a>
          </div>
          <p className="mt-4 text-xs text-ink-faint">No credit card required to get started.</p>
        </div>

        <PreviewCard />
      </div>
    </section>
  )
}
