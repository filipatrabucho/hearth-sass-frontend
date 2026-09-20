import { Check } from 'lucide-react'
import { clsx } from 'clsx'

import { Button } from '@/components/ui/Button'
import type { ClientPlan } from '@/types'

interface Tier {
  plan: ClientPlan
  name: string
  tagline: string
  cta: string
  buttonVariant: 'primary' | 'outline-info' | 'outline-brand'
  highlighted?: boolean
  features: string[]
}

const tiers: Tier[] = [
  {
    plan: 'free',
    name: 'Free',
    tagline: 'For communities just getting organized.',
    cta: 'Get started free',
    buttonVariant: 'outline-info',
    features: ['Member directory & sync', 'Warnings & basic moderation', '1 staff seat', 'Community support'],
  },
  {
    plan: 'pro',
    name: 'Pro',
    tagline: 'For active servers running events and support.',
    cta: 'Get started',
    buttonVariant: 'primary',
    highlighted: true,
    features: [
      'Everything in Free',
      'Tickets, events & announcements',
      'Analytics & audit log',
      'Unlimited staff seats',
      'Priority support',
    ],
  },
  {
    plan: 'enterprise',
    name: 'Enterprise',
    tagline: 'For networks managing multiple communities.',
    cta: 'Talk to us',
    buttonVariant: 'outline-brand',
    features: [
      'Everything in Pro',
      'Multiple servers under one account',
      'Custom onboarding',
      'Dedicated support channel',
    ],
  },
]

export function PricingSection({ onGetStarted }: { onGetStarted: (plan: ClientPlan) => void }) {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-ink">Simple plans, no surprises</h2>
        <p className="mt-3 text-base text-ink-muted">
          Start free. Talk to us when you're ready to scale — pricing is tailored to your community's size.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.plan}
            className={clsx(
              'relative flex flex-col rounded-xl2 border p-6',
              tier.highlighted
                ? 'border-brand-500/50 bg-base-surface shadow-glow'
                : 'border-base-border bg-base-surface',
            )}
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-6 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold text-white shadow-glow">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold text-ink">{tier.name}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{tier.tagline}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-300" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={tier.buttonVariant}
              className="mt-6 w-full justify-center"
              onClick={() => onGetStarted(tier.plan)}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
