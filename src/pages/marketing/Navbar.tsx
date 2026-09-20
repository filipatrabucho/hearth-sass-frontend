import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu as MenuIcon, X } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'

export function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-base-border bg-base-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="text-[15px] font-bold tracking-tight text-ink">HearthGG</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link to="/dashboard">
              <Button variant="primary">Go to dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Button variant="primary" onClick={onGetStarted}>
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="focus-ring rounded-lg p-2 text-ink-muted hover:bg-base-surface-2 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-base-border px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink-muted hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" className="w-full justify-center">
                  Go to dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" className="w-full justify-center">
                    Login
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => {
                    setOpen(false)
                    onGetStarted()
                  }}
                >
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
