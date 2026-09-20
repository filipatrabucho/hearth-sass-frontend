import { useEffect, useRef, useState } from 'react'
import { ChevronsUpDown, Check, Search } from 'lucide-react'
import { clsx } from 'clsx'

import { useClient } from '@/context/ClientContext'
import { Avatar } from '@/components/ui/Avatar'
import { StatusDot } from '@/components/ui/Badge'

function guildIconUrl(guildId: string, iconHash?: string | null): string | undefined {
  if (!iconHash) return undefined
  return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png?size=64`
}

export function ClientSwitcher() {
  const { clients, activeClient, setActiveClientId, clientsLoading } = useClient()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  if (clientsLoading) {
    return <div className="h-11 w-64 animate-pulse rounded-xl bg-base-surface-2" />
  }

  if (!clients.length) return null

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex w-64 items-center gap-2.5 rounded-xl border border-base-border bg-base-surface-2 px-2.5 py-2 text-left transition-colors hover:bg-base-surface-3"
      >
        <Avatar src={guildIconUrl(activeClient?.discord_guild_id ?? '', activeClient?.icon_hash)} name={activeClient?.name} size={30} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{activeClient?.name ?? 'Select client'}</p>
          <p className="flex items-center gap-1 truncate text-[11px] text-ink-muted">
            <StatusDot tone={activeClient?.status === 'active' ? 'success' : 'warning'} />
            {activeClient?.plan ? activeClient.plan[0].toUpperCase() + activeClient.plan.slice(1) : ''} plan
          </p>
        </div>
        <ChevronsUpDown size={15} className="shrink-0 text-ink-faint" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-40 w-80 overflow-hidden rounded-xl2 border border-base-border bg-base-surface-2 shadow-card">
          {clients.length > 6 && (
            <div className="flex items-center gap-2 border-b border-base-border px-3 py-2">
              <Search size={14} className="text-ink-faint" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clients…"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
            </div>
          )}
          <div className="max-h-72 overflow-y-auto p-1.5">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveClientId(c.id)
                  setOpen(false)
                  setQuery('')
                }}
                className={clsx(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-base-surface-3',
                  c.id === activeClient?.id && 'bg-base-surface-3',
                )}
              >
                <Avatar src={guildIconUrl(c.discord_guild_id, c.icon_hash)} name={c.name} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{c.name}</p>
                  <p className="truncate text-[11px] text-ink-muted capitalize">
                    {c.pivot?.role ?? 'owner'} · {c.plan}
                  </p>
                </div>
                {c.id === activeClient?.id && <Check size={15} className="shrink-0 text-brand-300" />}
              </button>
            ))}
            {!filtered.length && <p className="px-2.5 py-4 text-center text-xs text-ink-muted">No clients found.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
