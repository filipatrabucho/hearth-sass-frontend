import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { useSubmitLead } from '@/hooks/queries/useLeads'
import { extractErrorMessage } from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import type { ClientPlan } from '@/types'

const planLabel: Record<ClientPlan, string> = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' }

export function GetStartedModal({
  open,
  onClose,
  plan,
}: {
  open: boolean
  onClose: () => void
  plan: ClientPlan
}) {
  const submit = useSubmitLead()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [discordUsername, setDiscordUsername] = useState('')
  const [serverName, setServerName] = useState('')
  const [planInterest, setPlanInterest] = useState<ClientPlan>(plan)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) setPlanInterest(plan)
  }, [open, plan])

  const reset = () => {
    setName('')
    setEmail('')
    setDiscordUsername('')
    setServerName('')
    setMessage('')
    setError(null)
    submit.reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    setError(null)
    try {
      await submit.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        discord_username: discordUsername.trim() || undefined,
        server_name: serverName.trim() || undefined,
        plan_interest: planInterest,
        message: message.trim() || undefined,
      })
    } catch (e) {
      setError(extractErrorMessage(e))
    }
  }

  if (submit.isSuccess) {
    return (
      <Modal open={open} onClose={handleClose} title="You're on the list" size="sm">
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 size={32} className="text-accent-green" />
          <p className="mt-3 text-sm font-medium text-ink">Thanks, {name.split(' ')[0]}!</p>
          <p className="mt-1 text-sm text-ink-muted">
            We got your details — someone from HearthGG will reach out at {email} shortly.
          </p>
          <Button className="mt-5" variant="primary" onClick={handleClose}>
            Done
          </Button>
        </div>
      </Modal>
    )
  }

  const valid = name.trim() && /\S+@\S+\.\S+/.test(email)

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Get started with HearthGG"
      description="Tell us about your server and we'll set you up."
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={submit.isPending}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!valid} loading={submit.isPending} onClick={handleSubmit}>
            Submit
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <p className="rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Your name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Filipa" autoFocus />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Discord username" hint="Optional">
            <Input value={discordUsername} onChange={(e) => setDiscordUsername(e.target.value)} placeholder="username" />
          </Field>
          <Field label="Server name" hint="Optional">
            <Input value={serverName} onChange={(e) => setServerName(e.target.value)} placeholder="Nightfall Gaming" />
          </Field>
        </div>
        <Field label="Plan you're interested in">
          <Select value={planInterest} onChange={(e) => setPlanInterest(e.target.value as ClientPlan)}>
            {(Object.keys(planLabel) as ClientPlan[]).map((p) => (
              <option key={p} value={p}>
                {planLabel[p]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Anything else?" hint="Optional">
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Server size, modules you need, questions…" />
        </Field>
      </div>
    </Modal>
  )
}
