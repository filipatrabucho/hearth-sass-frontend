import { Github } from 'lucide-react'

import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="border-t border-base-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Logo size={24} />
          <span className="text-sm font-semibold text-ink">HearthGG</span>
        </div>

        <p className="text-xs text-ink-faint">© {new Date().getFullYear()} HearthGG. All rights reserved.</p>

        <a
          href="https://github.com/filipatrabucho/hearth-sass"
          target="_blank"
          rel="noreferrer"
          className="focus-ring flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
        >
          <Github size={14} /> GitHub
        </a>
      </div>
    </footer>
  )
}
