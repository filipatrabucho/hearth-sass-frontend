import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { ClientSwitcher } from '@/components/layout/ClientSwitcher'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-base-bg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-base-border lg:flex">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-base-border">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <div className="border-b border-base-border px-4 py-3 lg:hidden">
          <ClientSwitcher />
        </div>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
