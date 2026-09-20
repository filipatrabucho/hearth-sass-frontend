import { useState } from 'react'
import { Menu as MenuIcon, LogOut, User as UserIcon } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { ClientSwitcher } from '@/components/layout/ClientSwitcher'
import { Avatar, discordAvatarUrl } from '@/components/ui/Avatar'

export function Topbar({ onMenu, title }: { onMenu: () => void; title?: string }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-base-border bg-base-bg/85 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenu}
        className="focus-ring -ml-1 rounded-lg p-2 text-ink-muted hover:bg-base-surface-2 lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon size={18} />
      </button>

      <div className="hidden lg:block">
        <ClientSwitcher />
      </div>

      {title && <h1 className="text-sm font-semibold text-ink lg:hidden">{title}</h1>}

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="focus-ring flex items-center gap-2 rounded-full border border-transparent p-0.5 hover:border-base-border"
          >
            <Avatar
              src={user ? discordAvatarUrl(user.discord_id, user.avatar_hash) ?? undefined : undefined}
              name={user?.global_name ?? user?.username}
              size={34}
            />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-52 overflow-hidden rounded-xl border border-base-border bg-base-surface-2 py-1.5 shadow-card">
                <div className="border-b border-base-border px-3 py-2.5">
                  <p className="truncate text-sm font-medium text-ink">{user?.global_name ?? user?.username}</p>
                  <p className="truncate text-xs text-ink-muted">{user?.email ?? `@${user?.username}`}</p>
                </div>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-muted hover:bg-base-surface-3 hover:text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserIcon size={15} /> Profile
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-300 hover:bg-accent-red/10"
                  onClick={() => logout()}
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
