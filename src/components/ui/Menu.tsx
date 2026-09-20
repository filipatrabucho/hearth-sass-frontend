import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { MoreHorizontal } from 'lucide-react'

interface MenuAction {
  label: string
  onClick: () => void
  icon?: ReactNode
  destructive?: boolean
  disabled?: boolean
}

export function Menu({ actions, trigger }: { actions: MenuAction[]; trigger?: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 6, left: Math.max(8, rect.right - 192) })
    }
    setOpen((o) => !o)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="focus-ring rounded-lg p-1.5 text-ink-faint hover:bg-base-surface-3 hover:text-ink"
        aria-label="Open menu"
      >
        {trigger ?? <MoreHorizontal size={16} />}
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-50 w-48 overflow-hidden rounded-xl border border-base-border bg-base-surface-2 py-1 shadow-card"
          >
            {actions.map((action) => (
              <button
                key={action.label}
                disabled={action.disabled}
                onClick={() => {
                  setOpen(false)
                  action.onClick()
                }}
                className={clsx(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors disabled:opacity-40',
                  action.destructive ? 'text-red-300 hover:bg-accent-red/10' : 'text-ink hover:bg-base-surface-3',
                )}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
