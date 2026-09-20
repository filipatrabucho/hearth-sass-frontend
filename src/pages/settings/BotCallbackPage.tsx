import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'

import { useClient } from '@/context/ClientContext'
import { useRecordBotInstall } from '@/hooks/queries/useClientsAdmin'
import { extractErrorMessage } from '@/lib/api'
import { PageSpinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

export default function BotCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { activeClientId } = useClient()
  const record = useRecordBotInstall(activeClientId)
  const [error, setError] = useState<string | null>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const guildId = params.get('guild_id')
    const permissions = params.get('permissions')

    if (!guildId || !permissions) {
      setError('Discord did not return the expected authorization details.')
      return
    }

    record
      .mutateAsync({ guildId, permissions })
      .then(() => {
        setTimeout(() => navigate('/settings'), 1200)
      })
      .catch((e) => setError(extractErrorMessage(e)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <XCircle size={32} className="text-accent-red" />
        <p className="mt-3 text-sm font-medium text-ink">Couldn&apos;t connect the bot</p>
        <p className="mt-1 max-w-sm text-xs text-ink-muted">{error}</p>
        <Button className="mt-4" variant="secondary" onClick={() => navigate('/settings')}>
          Back to settings
        </Button>
      </div>
    )
  }

  if (record.isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <CheckCircle2 size={32} className="text-accent-green" />
        <p className="mt-3 text-sm font-medium text-ink">Bot connected!</p>
        <p className="mt-1 text-xs text-ink-muted">Redirecting you back to settings…</p>
      </div>
    )
  }

  return <PageSpinner />
}
