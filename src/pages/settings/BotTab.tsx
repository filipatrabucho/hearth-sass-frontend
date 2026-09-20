import { Bot, ExternalLink, CheckCircle2 } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { botInviteUrl } from '@/lib/discord'
import { formatDateTime } from '@/lib/format'

export function BotTab() {
  const { activeClient } = useClient()

  if (!activeClient) return null

  const installed = !!activeClient.bot_installed_at
  const inviteUrl = botInviteUrl(activeClient.discord_guild_id)

  return (
    <Card>
      <CardHeader title="Bot connection" description="The HearthGG bot must be in your server for modules to work." />
      <CardBody className="pt-3">
        <div className="flex items-center gap-4 rounded-xl border border-base-border bg-base-surface-2 p-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${installed ? 'bg-accent-green/15 text-emerald-300' : 'bg-base-surface-3 text-ink-faint'}`}>
            <Bot size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">{installed ? 'Bot is connected' : 'Bot not installed'}</p>
            <p className="text-xs text-ink-muted">
              {installed ? `Connected ${formatDateTime(activeClient.bot_installed_at)}` : 'Install the bot to unlock every module.'}
            </p>
          </div>
          <Badge tone={installed ? 'success' : 'warning'}>{installed ? 'Online' : 'Missing'}</Badge>
        </div>

        {!installed && (
          <div className="mt-4">
            {inviteUrl ? (
              <a href={inviteUrl} className="inline-block">
                <Button variant="primary">
                  Add bot to {activeClient.name} <ExternalLink size={14} />
                </Button>
              </a>
            ) : (
              <p className="text-xs text-ink-faint">
                Set <code className="rounded bg-base-surface-3 px-1 py-0.5">VITE_DISCORD_CLIENT_ID</code> in your frontend
                environment to enable one-click bot installs.
              </p>
            )}
          </div>
        )}

        {installed && (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-muted">
            <CheckCircle2 size={13} className="text-accent-green" /> Every active module can reach your Discord server.
          </p>
        )}
      </CardBody>
    </Card>
  )
}
