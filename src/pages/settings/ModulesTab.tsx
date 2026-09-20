import { useClient } from '@/context/ClientContext'
import { useModulesCatalog, useToggleModule } from '@/hooks/queries/useClientsAdmin'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        checked ? 'bg-brand-gradient' : 'bg-base-surface-3'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export function ModulesTab() {
  const { activeClient, activeClientId } = useClient()
  const { push } = useToast()
  const { data: catalog, isLoading } = useModulesCatalog()
  const toggle = useToggleModule(activeClientId)

  if (!activeClient) return null

  const handleToggle = async (moduleId: number, enabled: boolean) => {
    try {
      await toggle.mutateAsync({ moduleId, enabled, paymentStatus: enabled ? 'active' : undefined })
      push(`Module ${enabled ? 'enabled' : 'disabled'}.`, 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <Card>
      <CardHeader title="Modules" description="Turn features on or off for this client." />
      <CardBody className="pt-3">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="divide-y divide-base-border-soft">
            {catalog?.map((mod) => {
              const pivot = activeClient.modules?.find((m) => m.id === mod.id)?.pivot
              const enabled = !!pivot?.is_enabled
              return (
                <div key={mod.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink">{mod.name}</p>
                      {pivot && <Badge tone={enabled ? 'success' : 'neutral'}>{pivot.payment_status}</Badge>}
                    </div>
                    {mod.description && <p className="mt-0.5 text-xs text-ink-muted">{mod.description}</p>}
                  </div>
                  <Toggle checked={enabled} disabled={toggle.isPending} onChange={() => handleToggle(mod.id, !enabled)} />
                </div>
              )
            })}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
