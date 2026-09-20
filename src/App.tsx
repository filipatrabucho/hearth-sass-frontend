import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ProtectedRoute, GuestRoute } from '@/components/layout/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { RequireModule, RequireRole, RequireSuperAdmin } from '@/components/layout/RequireModule'
import { PageSpinner } from '@/components/ui/Spinner'

import Login from '@/pages/auth/Login'
import NotFound from '@/pages/NotFound'
import Dashboard from '@/pages/Dashboard'
import Home from '@/pages/marketing/Home'

const MembersPage = lazy(() => import('@/pages/members/MembersPage'))
const BansPage = lazy(() => import('@/pages/bans/BansPage'))
const WarningsPage = lazy(() => import('@/pages/warnings/WarningsPage'))
const TicketsPage = lazy(() => import('@/pages/tickets/TicketsPage'))
const TicketDetailPage = lazy(() => import('@/pages/tickets/TicketDetailPage'))
const EventsPage = lazy(() => import('@/pages/events/EventsPage'))
const PostsPage = lazy(() => import('@/pages/posts/PostsPage'))
const RolesPage = lazy(() => import('@/pages/roles/RolesPage'))
const InvitesPage = lazy(() => import('@/pages/invites/InvitesPage'))
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const BotCallbackPage = lazy(() => import('@/pages/settings/BotCallbackPage'))
const ClientsPage = lazy(() => import('@/pages/clients/ClientsPage'))
const LeadsPage = lazy(() => import('@/pages/leads/LeadsPage'))

export default function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/members"
              element={
                <RequireModule module="members">
                  <MembersPage />
                </RequireModule>
              }
            />
            <Route
              path="/bans"
              element={
                <RequireModule module="bans">
                  <BansPage />
                </RequireModule>
              }
            />
            <Route
              path="/warnings"
              element={
                <RequireModule module="members">
                  <WarningsPage />
                </RequireModule>
              }
            />
            <Route
              path="/tickets"
              element={
                <RequireModule module="tickets">
                  <TicketsPage />
                </RequireModule>
              }
            />
            <Route
              path="/tickets/:id"
              element={
                <RequireModule module="tickets">
                  <TicketDetailPage />
                </RequireModule>
              }
            />
            <Route
              path="/events"
              element={
                <RequireModule module="events">
                  <EventsPage />
                </RequireModule>
              }
            />
            <Route
              path="/posts"
              element={
                <RequireModule module="posts">
                  <PostsPage />
                </RequireModule>
              }
            />
            <Route
              path="/roles"
              element={
                <RequireModule module="members">
                  <RolesPage />
                </RequireModule>
              }
            />
            <Route
              path="/invites"
              element={
                <RequireModule module="members">
                  <InvitesPage />
                </RequireModule>
              }
            />
            <Route
              path="/analytics"
              element={
                <RequireModule module="analytics">
                  <AnalyticsPage />
                </RequireModule>
              }
            />

            <Route
              path="/settings"
              element={
                <RequireRole role="admin">
                  <SettingsPage />
                </RequireRole>
              }
            />
            <Route path="/bot/callback" element={<BotCallbackPage />} />
            <Route
              path="/clients"
              element={
                <RequireSuperAdmin>
                  <ClientsPage />
                </RequireSuperAdmin>
              }
            />
            <Route
              path="/leads"
              element={
                <RequireSuperAdmin>
                  <LeadsPage />
                </RequireSuperAdmin>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
