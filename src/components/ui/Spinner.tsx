import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

export function Spinner({ className, size = 20 }: { className?: string; size?: number }) {
  return <Loader2 size={size} className={clsx('animate-spin text-brand-300', className)} />
}

export function PageSpinner() {
  return (
    <div className="flex h-full min-h-[40vh] w-full items-center justify-center">
      <Spinner size={28} />
    </div>
  )
}
