import { useEffect, useState } from 'react'

import { useClient } from '@/context/ClientContext'
import { useUpdateClient } from '@/hooks/queries/useClientsAdmin'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Field, Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { ClientPlan, ClientStatus } from '@/types'

export function GeneralTab() {
  const { activeClient, activeClientId } = useClient()
  const { push } = useToast()
  const update = useUpdateClient(activeClientId)

  const [name, setName] = useState('')
  const [plan, setPlan] = useState<ClientPlan>('free')
  const [status, setStatus] = useState<ClientStatus>('active')

  useEffect(() => {
    if (!activeClient) return
    setName(activeClient.name)
    setPlan(activeClient.plan)
    setStatus(activeClient.status)
  }, [activeClient])

  if (!activeClient) return null

  const dirty = name !== activeClient.name || plan !== activeClient.plan || status !== activeClient.status

  const handleSave = async () => {
    try {
      await update.mutateAsync({ name: name.trim(), plan, status })
      push('Client updated.', 'success')
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  return (
    <Card>
      <CardHeader title="General" description="Basic information about this client." />
      <CardBody className="space-y-4 pt-3">
        <Field label="Server name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Plan">
            <Select value={plan} onChange={(e) => setPlan(e.target.value as ClientPlan)}>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </Field>
        </div>
        <Field label="Discord guild ID" hint="Set when the client was onboarded — not editable here.">
          <Input value={activeClient.discord_guild_id} disabled />
        </Field>
        <div className="flex justify-end">
          <Button variant="primary" disabled={!dirty} loading={update.isPending} onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
