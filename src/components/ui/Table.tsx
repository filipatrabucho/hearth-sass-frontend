import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-xl2 border border-base-border">
      <table className={clsx('w-full border-collapse text-left text-sm', className)} {...props} />
    </div>
  )
}

export function Thead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={clsx('bg-base-surface-2', className)} {...props} />
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx(
        'whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-ink-faint',
        className,
      )}
      {...props}
    />
  )
}

export function Tbody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={clsx('divide-y divide-base-border-soft', className)} {...props} />
}

export function Tr({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={clsx('bg-base-surface transition-colors hover:bg-base-surface-2/60', className)} {...props} />
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx('whitespace-nowrap px-4 py-3 align-middle text-ink', className)} {...props} />
}
