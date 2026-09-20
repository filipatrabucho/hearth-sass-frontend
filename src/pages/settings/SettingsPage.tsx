import { useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { GeneralTab } from '@/pages/settings/GeneralTab'
import { ModulesTab } from '@/pages/settings/ModulesTab'
import { TeamTab } from '@/pages/settings/TeamTab'
import { BotTab } from '@/pages/settings/BotTab'

type TabKey = 'general' | 'modules' | 'team' | 'bot'

export default function SettingsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<TabKey>('general')

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Configure this client — visible to owners and admins." />

      <div className="mb-5">
        <Tabs
          items={[
            { key: 'general', label: 'General' },
            { key: 'modules', label: 'Modules' },
            { key: 'team', label: 'Team' },
            { key: 'bot', label: 'Bot' },
          ]}
          active={tab}
          onChange={(k) => setTab(k as TabKey)}
        />
      </div>

      {tab === 'general' && <GeneralTab />}
      {tab === 'modules' && <ModulesTab />}
      {tab === 'team' && <TeamTab />}
      {tab === 'bot' && <BotTab />}

      {!user?.is_super_admin && tab === 'team' && (
        <p className="mt-3 text-xs text-ink-faint">Only HearthGG admins can search the full user directory when adding staff.</p>
      )}
    </div>
  )
}
