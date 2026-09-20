import {
  LayoutDashboard,
  Users,
  ShieldBan,
  AlertTriangle,
  Ticket,
  CalendarDays,
  Newspaper,
  BadgeCheck,
  MailPlus,
  BarChart3,
  Settings,
  Building2,
  type LucideIcon,
} from 'lucide-react'
import type { ClientRole, ModuleKey } from '@/types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  module?: ModuleKey
  minRole?: ClientRole
  superAdminOnly?: boolean
}

export const primaryNav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/members', label: 'Members', icon: Users, module: 'members' },
  { to: '/bans', label: 'Bans', icon: ShieldBan, module: 'bans' },
  { to: '/warnings', label: 'Warnings', icon: AlertTriangle, module: 'members' },
  { to: '/tickets', label: 'Tickets', icon: Ticket, module: 'tickets' },
  { to: '/events', label: 'Events', icon: CalendarDays, module: 'events' },
  { to: '/posts', label: 'Posts', icon: Newspaper, module: 'posts' },
  { to: '/roles', label: 'Roles', icon: BadgeCheck, module: 'members' },
  { to: '/invites', label: 'Invites', icon: MailPlus, module: 'members' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, module: 'analytics' },
]

export const secondaryNav: NavItem[] = [
  { to: '/settings', label: 'Settings', icon: Settings, minRole: 'admin' },
  { to: '/clients', label: 'All clients', icon: Building2, superAdminOnly: true },
]

const roleWeight: Record<ClientRole, number> = { staff: 0, admin: 1, owner: 2 }

export function meetsRole(role: ClientRole, min?: ClientRole): boolean {
  if (!min) return true
  return roleWeight[role] >= roleWeight[min]
}
