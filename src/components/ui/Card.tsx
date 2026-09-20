import { clsx } from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-xl2 border border-base-border bg-base-surface shadow-card', className)}
      {...props}
    />
  )
}

export function CardHeader({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('flex items-start justify-between gap-4 px-5 pt-5', className)}>
      <div className="flex items-start gap-2.5">
        {icon && <div className="mt-0.5 text-brand-300">{icon}</div>}
        <div>
          <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('px-5 pb-5 pt-4', className)} {...props} />
}
