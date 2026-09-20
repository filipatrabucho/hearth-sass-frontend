import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'upgrade' | 'outline-brand' | 'outline-info'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-glow hover:brightness-110 active:brightness-95 disabled:opacity-50',
  upgrade:
    'bg-upgrade-gradient text-white shadow-glow hover:brightness-110 active:brightness-95 disabled:opacity-50',
  secondary:
    'bg-base-surface-3 text-ink border border-base-border hover:bg-[#272242] disabled:opacity-50',
  ghost: 'text-ink-muted hover:text-ink hover:bg-base-surface-2 disabled:opacity-40',
  subtle: 'bg-base-surface-2 text-ink-muted hover:text-ink hover:bg-base-surface-3 border border-transparent',
  danger: 'bg-accent-red/15 text-red-300 border border-accent-red/30 hover:bg-accent-red/25 disabled:opacity-50',
  'outline-brand':
    'bg-transparent text-brand-200 border border-brand-500/40 hover:bg-brand-500/10 disabled:opacity-50',
  'outline-info':
    'bg-transparent text-sky-300 border border-accent-blue/40 hover:bg-accent-blue/10 disabled:opacity-50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9 p-0 justify-center',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'focus-ring inline-flex select-none items-center rounded-lg font-medium transition-colors duration-150',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
