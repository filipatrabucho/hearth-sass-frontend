import type { ReactNode } from 'react'
import { ShieldOff } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { useClient } from '@/context/ClientContext'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ModuleKey } from '@/types'
import { meetsRole } from '@/config/nav'
import type { ClientRole } from '@/types'

export function RequireModule({ module, children }: { module: ModuleKey; children: ReactNode }) {
  const { hasModule, activeClient } = useClient()

  if (!activeClient) return null

  if (!hasModule(module)) {
    return (
      <EmptyState
        icon={<ShieldOff size={28} />}
        title="Module not active"
        description={`${activeClient.name} doesn't have this module enabled right now. Ask an owner to activate it from Settings.`}
      />
    )
  }

  return <>{children}</>
}

export function RequireSuperAdmin({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  if (!user?.is_super_admin) {
    return (
      <EmptyState
        icon={<ShieldOff size={28} />}
        title="HearthGG admins only"
        description="This area is limited to HearthGG's own super admins."
      />
    )
  }

  return <>{children}</>
}

export function RequireRole({ role, children }: { role: ClientRole; children: ReactNode }) {
  const { role: currentRole } = useClient()

  if (!meetsRole(currentRole, role)) {
    return (
      <EmptyState
        icon={<ShieldOff size={28} />}
        title="Insufficient permissions"
        description="You need a higher role on this client to view this page."
      />
    )
  }

  return <>{children}</>
}
