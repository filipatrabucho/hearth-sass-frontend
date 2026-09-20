import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-base-surface-3 text-ink-muted border-base-border',
  success: 'bg-accent-green/10 text-emerald-300 border-accent-green/25',
  warning: 'bg-accent-amber/10 text-amber-300 border-accent-amber/25',
  danger: 'bg-accent-red/10 text-red-300 border-accent-red/25',
  info: 'bg-accent-blue/10 text-sky-300 border-accent-blue/25',
  brand: 'bg-brand-500/15 text-brand-200 border-brand-500/30',
}

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusDot({ tone = 'neutral' }: { tone?: 'success' | 'danger' | 'warning' | 'neutral' }) {
  const dot = {
    success: 'bg-accent-green',
    danger: 'bg-accent-red',
    warning: 'bg-accent-amber',
    neutral: 'bg-ink-faint',
  }[tone]
  return <span className={clsx('inline-block h-1.5 w-1.5 rounded-full', dot)} />
}
