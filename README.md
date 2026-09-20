# HearthGG — Frontend

React SPA for **HearthGG**, a multi-tenant platform for managing Discord communities. Talks to the
[hearth-sass](https://github.com/filipatrabucho/hearth-sass) Laravel API for auth, tenants (clients)
and every module (members, bans, warnings, tickets, events, posts, roles, invites, analytics).

## Stack

- React 18 + TypeScript, built with Vite
- React Router for routing, TanStack Query for server state/caching
- Tailwind CSS for styling, Recharts for the analytics chart
- Axios, wired up for Laravel Sanctum's SPA (cookie) authentication

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` needs:

```
VITE_API_URL=http://localhost:8000       # the hearth-sass API
VITE_DISCORD_CLIENT_ID=                  # optional: enables the one-click "Add bot" button
```

The API must have `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` pointing at this app's origin
(`localhost:5173` by default) for the Sanctum session cookie to work across origins.

## How auth works

There's no login form — the only way in is Discord OAuth, handled entirely by the API:

1. The app sends the browser to `GET {API_URL}/auth/discord/redirect`.
2. Discord redirects back to the API's callback, which creates/updates the user and starts a
   Sanctum SPA session, then redirects to `{FRONTEND_URL}/dashboard`.
3. From then on the app calls `/api/*` with `withCredentials`, and Sanctum's `XSRF-TOKEN` cookie
   is echoed back automatically by axios.

## Structure

- `src/context` — auth session and the active-client (tenant) switcher, including per-module
  access checks (`hasModule`) mirroring the API's own `Client::hasModuleEnabled()`.
- `src/hooks/queries` — one file per API resource, wrapping TanStack Query.
- `src/components/ui` — small design-system primitives (Button, Card, Table, Modal, …).
- `src/components/layout` — sidebar, topbar, client switcher, route guards.
- `src/pages` — one folder per module/route.

## Notes on API coverage

- The **Team** tab has no "list members" endpoint on the API (only add/remove), so it starts
  empty and fills in as you add/remove people during the session.
- The **Bot** tab builds a real Discord bot-invite link when `VITE_DISCORD_CLIENT_ID` is set, and
  the `/bot/callback` route forwards Discord's `guild_id`/`permissions` straight to
  `POST /clients/{client}/bot/install`, matching the flow described in the API's README.
