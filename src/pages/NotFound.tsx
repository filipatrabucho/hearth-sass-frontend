import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-bg px-4 text-center">
      <Compass size={36} className="text-brand-300" />
      <h1 className="mt-4 text-3xl font-bold text-ink">404</h1>
      <p className="mt-1.5 text-sm text-ink-muted">This page doesn&apos;t exist, or you don&apos;t have access to it.</p>
      <Link to="/dashboard" className="mt-6">
        <Button variant="primary">Back to dashboard</Button>
      </Link>
    </div>
  )
}
