import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { Card } from '@/components/ui/Card'

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
  trend,
}: {
  label: string
  value: ReactNode
  icon: LucideIcon
  tone?: 'brand' | 'green' | 'amber' | 'red' | 'blue'
  trend?: string
}) {
  const toneClasses = {
    brand: 'bg-brand-500/15 text-brand-300',
    green: 'bg-accent-green/15 text-emerald-300',
    amber: 'bg-accent-amber/15 text-amber-300',
    red: 'bg-accent-red/15 text-red-300',
    blue: 'bg-accent-blue/15 text-sky-300',
  }[tone]

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className={clsx('flex h-9 w-9 items-center justify-center rounded-lg', toneClasses)}>
          <Icon size={17} />
        </div>
        {trend && <span className="text-xs font-medium text-ink-faint">{trend}</span>}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{label}</p>
    </Card>
  )
}
