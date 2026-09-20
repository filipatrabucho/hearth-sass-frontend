import { Link } from 'react-router-dom'
import { ShieldCheck, Users2, Ticket } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { Logo } from '@/components/Logo'

const DiscordMark = () => (
  <svg viewBox="0 0 127.14 96.36" className="h-5 w-5" fill="currentColor" aria-hidden>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
)

export default function Login() {
  const { loginWithDiscord } = useAuth()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-bg px-4">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand-800/25 blur-[120px]" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/">
            <Logo size={48} className="shadow-glow" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">HearthGG</h1>
          <p className="mt-1.5 text-sm text-ink-muted">Manage your Discord communities in one place.</p>
        </div>

        <div className="rounded-xl2 border border-base-border bg-base-surface p-6 shadow-card">
          <button
            onClick={loginWithDiscord}
            className="focus-ring flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#5865F2] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4]"
          >
            <DiscordMark />
            Continue with Discord
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
            We only use your Discord account to sign you in and figure out which servers you manage.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Users2, label: 'Members' },
            { icon: Ticket, label: 'Tickets' },
            { icon: ShieldCheck, label: 'Moderation' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="rounded-xl border border-base-border bg-base-surface/60 px-2 py-3">
              <Icon size={16} className="mx-auto text-brand-300" />
              <p className="mt-1.5 text-[11px] text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
