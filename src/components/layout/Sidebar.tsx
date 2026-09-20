import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { ExternalLink, Sparkles, Crown } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { useClient } from '@/context/ClientContext'
import { primaryNav, secondaryNav, meetsRole } from '@/config/nav'
import { Avatar, discordAvatarUrl } from '@/components/ui/Avatar'
import { Logo } from '@/components/Logo'

const planLabel: Record<string, string> = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' }
const nextPlan: Record<string, string> = { free: 'Pro', pro: 'Enterprise', enterprise: 'Enterprise' }

function NavRow({ item, onNavigate }: { item: (typeof primaryNav)[number]; onNavigate?: () => void }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          'focus-ring group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand-500/15 text-white'
            : 'text-ink-muted hover:bg-base-surface-2 hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={17} className={isActive ? 'text-brand-300' : 'text-ink-faint group-hover:text-ink-muted'} />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()
  const { activeClient, role, hasModule } = useClient()

  const visiblePrimary = primaryNav.filter((item) => !item.module || hasModule(item.module))
  const visibleSecondary = secondaryNav.filter((item) => {
    if (item.superAdminOnly) return !!user?.is_super_admin
    if (item.minRole) return meetsRole(role, item.minRole)
    return true
  })

  const botMissing = activeClient && !activeClient.bot_installed_at

  return (
    <div className="flex h-full flex-col bg-base-surface">
      <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <Logo size={30} className="shadow-glow" />
        <span className="text-[15px] font-bold tracking-tight text-ink">HearthGG</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {visiblePrimary.map((item) => (
          <NavRow key={item.to} item={item} onNavigate={onNavigate} />
        ))}

        {visibleSecondary.length > 0 && (
          <div className="mt-4 space-y-0.5 border-t border-base-border pt-4">
            {visibleSecondary.map((item) => (
              <NavRow key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </nav>

      <div className="px-3 pb-3 pt-2">
        {botMissing && meetsRole(role, 'admin') ? (
          <NavLink
            to="/settings"
            onClick={onNavigate}
            className="block overflow-hidden rounded-xl2 bg-promo-gradient p-4 shadow-glow transition-transform hover:scale-[1.01]"
          >
            <Sparkles size={18} className="text-white/90" />
            <p className="mt-2 text-sm font-semibold text-white">Connect the bot</p>
            <p className="mt-1 text-xs leading-relaxed text-white/75">
              Install the HearthGG bot on {activeClient?.name} to unlock every module.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white">
              Set up now <ExternalLink size={12} />
            </span>
          </NavLink>
        ) : activeClient && activeClient.plan !== 'enterprise' && meetsRole(role, 'admin') ? (
          <NavLink
            to="/settings"
            onClick={onNavigate}
            className="block overflow-hidden rounded-xl2 bg-upgrade-gradient p-4 shadow-glow transition-transform hover:scale-[1.01]"
          >
            <Crown size={18} className="text-white/90" />
            <p className="mt-2 text-sm font-semibold text-white">Upgrade to {nextPlan[activeClient.plan]}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/75">
              Unlock more modules and priority support for {activeClient.name}.
            </p>
            <span className="mt-3 inline-flex items-center justify-center rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25">
              Upgrade plan
            </span>
          </NavLink>
        ) : (
          activeClient && (
            <div className="rounded-xl2 border border-base-border bg-base-surface-2 p-4">
              <p className="text-xs text-ink-muted">Current plan</p>
              <p className="mt-1 text-sm font-medium text-ink">{planLabel[activeClient.plan] ?? activeClient.plan}</p>
              <a
                href="https://github.com/filipatrabucho/hearth-sass"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-300 hover:text-brand-200"
              >
                Read the docs <ExternalLink size={12} />
              </a>
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-2.5 border-t border-base-border px-4 py-3">
        <Avatar src={user ? discordAvatarUrl(user.discord_id, user.avatar_hash) ?? undefined : undefined} name={user?.global_name ?? user?.username} size={32} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{user?.global_name ?? user?.username}</p>
          <p className="truncate text-[11px] capitalize text-ink-muted">{role}</p>
        </div>
      </div>
    </div>
  )
}
