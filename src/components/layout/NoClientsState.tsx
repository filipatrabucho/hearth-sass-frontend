import { Link } from 'react-router-dom'
import { Building2, RotateCw, TriangleAlert } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { useClient } from '@/context/ClientContext'
import { Button } from '@/components/ui/Button'

export function NoClientsOrErrorState() {
  const { user } = useAuth()
  const { clientsError, activeClientError, refetchClients, refetchActiveClient } = useClient()

  if (clientsError || activeClientError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <TriangleAlert size={32} className="text-accent-amber" />
        <p className="mt-3 text-sm font-medium text-ink">Couldn&apos;t reach the HearthGG API</p>
        <p className="mt-1 max-w-sm text-xs text-ink-muted">
          Check that the API is running and reachable, then try again.
        </p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => {
            refetchClients()
            refetchActiveClient()
          }}
        >
          <RotateCw size={14} /> Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
        <Building2 size={26} />
      </div>
      <p className="mt-4 text-base font-semibold text-ink">No clients yet</p>
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
        {user?.is_super_admin
          ? "You're a HearthGG admin, but no Discord community has been onboarded yet. Add one to get started."
          : "You don't have access to any client yet. Ask an owner or admin to add your account to their team."}
      </p>
      {user?.is_super_admin && (
        <Link to="/clients" className="mt-5">
          <Button variant="primary">Onboard a client</Button>
        </Link>
      )}
    </div>
  )
}
