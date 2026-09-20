import { useState } from 'react'
import { BadgeCheck, Users } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useRoles } from '@/hooks/queries/useRoles'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import type { DiscordRole } from '@/types'
import { RoleMembersModal } from '@/pages/roles/RoleMembersModal'

function roleColor(color: number): string {
  if (!color) return '#6c6884'
  return `#${color.toString(16).padStart(6, '0')}`
}

export default function RolesPage() {
  const { activeClientId } = useClient()
  const { data: roles, isLoading } = useRoles(activeClientId)
  const [active, setActive] = useState<DiscordRole | null>(null)

  const sorted = [...(roles ?? [])].filter((r) => r.name !== '@everyone').sort((a, b) => b.position - a.position)

  return (
    <div>
      <PageHeader title="Roles" description="Discord roles for this server and who can manage members with them." />

      {isLoading ? (
        <PageSpinner />
      ) : !sorted.length ? (
        <EmptyState icon={<BadgeCheck size={26} />} title="No roles found" />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Role</Th>
              <Th>ID</Th>
              <Th>Position</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sorted.map((role) => (
              <Tr key={role.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: roleColor(role.color) }} />
                    <span className="font-medium text-ink">{role.name}</span>
                  </div>
                </Td>
                <Td className="font-mono text-xs text-ink-muted">{role.id}</Td>
                <Td className="text-ink-muted">{role.position}</Td>
                <Td className="text-right">
                  <Button size="sm" variant="secondary" onClick={() => setActive(role)}>
                    <Users size={13} /> Manage members
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <RoleMembersModal role={active} onClose={() => setActive(null)} />
    </div>
  )
}
