import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

const fieldBase =
  'w-full rounded-lg border border-base-border bg-base-surface-2 px-3 text-sm text-ink placeholder:text-ink-faint focus-ring transition-colors focus:border-brand-500/60 disabled:opacity-50'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={clsx(fieldBase, 'h-9', className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={clsx(fieldBase, 'min-h-24 py-2', className)} {...props} />
  ),
)
Textarea.displayName = 'Textarea'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={clsx(fieldBase, 'h-9 appearance-none bg-no-repeat pr-8', className)} {...props}>
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-faint">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-accent-red">{error}</span>}
    </label>
  )
}
