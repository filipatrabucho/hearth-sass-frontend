import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useToast } from '@/context/ToastContext'
import { extractErrorMessage } from '@/lib/api'
import { useCreateClient, useUsers, type CreateClientPayload } from '@/hooks/queries/useClientsAdmin'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge, StatusDot } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Select } from '@/components/ui/Input'

export default function ClientsPage() {
  const navigate = useNavigate()
  const { clients, clientsLoading, setActiveClientId } = useClient()
  const { push } = useToast()
  const { data: users } = useUsers(true)
  const create = useCreateClient()

  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<Partial<CreateClientPayload>>({ plan: 'free', status: 'active' })

  const handleCreate = async () => {
    if (!form.discord_guild_id || !form.name || !form.owner_user_id) return
    try {
      await create.mutateAsync({
        discord_guild_id: form.discord_guild_id.trim(),
        name: form.name.trim(),
        owner_user_id: Number(form.owner_user_id),
        plan: form.plan ?? 'free',
        status: form.status ?? 'active',
      })
      push('Client onboarded.', 'success')
      setFormOpen(false)
      setForm({ plan: 'free', status: 'active' })
    } catch (e) {
      push(extractErrorMessage(e), 'error')
    }
  }

  const handleManage = (id: number) => {
    setActiveClientId(id)
    navigate('/settings')
  }

  return (
    <div>
      <PageHeader
        title="All clients"
        description="Every Discord community onboarded onto HearthGG."
        actions={
          <Button variant="primary" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Onboard client
          </Button>
        }
      />

      {clientsLoading ? (
        <PageSpinner />
      ) : !clients.length ? (
        <EmptyState icon={<Building2 size={26} />} title="No clients yet" description="Onboard your first Discord community." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Client</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th>Bot</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} size={30} />
                    <div>
                      <p className="text-sm font-medium text-ink">{c.name}</p>
                      <p className="font-mono text-xs text-ink-muted">{c.discord_guild_id}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <Badge tone="brand" className="capitalize">
                    {c.plan}
                  </Badge>
                </Td>
                <Td>
                  <span className="flex items-center gap-1.5 text-sm capitalize text-ink">
                    <StatusDot tone={c.status === 'active' ? 'success' : 'danger'} /> {c.status}
                  </span>
                </Td>
                <Td>
                  <Badge tone={c.bot_installed_at ? 'success' : 'neutral'}>{c.bot_installed_at ? 'Installed' : 'Not installed'}</Badge>
                </Td>
                <Td className="text-right">
                  <Button size="sm" variant="secondary" onClick={() => handleManage(c.id)}>
                    Manage
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Onboard a new client"
        description="Add a Discord community to HearthGG."
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={create.isPending}
              disabled={!form.discord_guild_id || !form.name || !form.owner_user_id}
              onClick={handleCreate}
            >
              Create client
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Server name">
            <Input value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nightfall Gaming" />
          </Field>
          <Field label="Discord guild ID">
            <Input
              value={form.discord_guild_id ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, discord_guild_id: e.target.value }))}
              placeholder="123456789012345678"
            />
          </Field>
          <Field label="Owner">
            <Select
              value={form.owner_user_id ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, owner_user_id: Number(e.target.value) }))}
            >
              <option value="">Select a user…</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.global_name ?? u.username} (@{u.username})
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Plan">
              <Select value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value as CreateClientPayload['plan'] }))}>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CreateClientPayload['status'] }))}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  )
}
