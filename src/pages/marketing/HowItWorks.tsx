import { Bot, LayoutDashboard, Link2 } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    title: 'Connect your server',
    description: 'Sign in with Discord and invite the HearthGG bot to your community — one click, no setup script.',
  },
  {
    icon: Bot,
    title: 'Turn on your modules',
    description: 'Members, tickets, events, posts, analytics — enable only what your team needs, upgrade anytime.',
  },
  {
    icon: LayoutDashboard,
    title: 'Manage it all in one place',
    description: 'Give your staff dashboard access with roles that mirror how your team actually works.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-base-border bg-base-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Up and running in minutes</h2>
          <p className="mt-3 text-base text-ink-muted">No migrations, no exporting your server into another tool.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                <step.icon size={19} />
              </div>
              <p className="mt-4 text-xs font-semibold text-brand-300">STEP {i + 1}</p>
              <h3 className="mt-1 text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
