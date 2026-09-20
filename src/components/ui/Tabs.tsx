import { clsx } from 'clsx'

export interface TabItem {
  key: string
  label: string
  count?: number
}

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-base-border">
      {items.map((item) => {
        const isActive = item.key === active
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={clsx(
              'focus-ring relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  isActive ? 'bg-brand-500/20 text-brand-200' : 'bg-base-surface-3 text-ink-faint',
                )}
              >
                {item.count}
              </span>
            )}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-gradient" />}
          </button>
        )
      })}
    </div>
  )
}
