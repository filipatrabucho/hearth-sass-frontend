import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  push: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let idCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, variant }])
      window.setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl2 border px-4 py-3 shadow-card backdrop-blur-sm',
              toast.variant === 'success' && 'border-accent-green/30 bg-[#12291f]/95 text-emerald-200',
              toast.variant === 'error' && 'border-accent-red/30 bg-[#2a1616]/95 text-red-200',
              toast.variant === 'info' && 'border-base-border bg-base-surface-2/95 text-ink',
            )}
          >
            {toast.variant === 'success' && <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-green" />}
            {toast.variant === 'error' && <XCircle size={18} className="mt-0.5 shrink-0 text-accent-red" />}
            {toast.variant === 'info' && <Info size={18} className="mt-0.5 shrink-0 text-brand-300" />}
            <p className="flex-1 text-sm leading-snug">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-ink-faint hover:text-ink focus-ring rounded"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
