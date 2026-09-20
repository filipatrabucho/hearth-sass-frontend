export type ClientRole = 'owner' | 'admin' | 'staff'

export type ClientPlan = 'free' | 'pro' | 'enterprise'
export type ClientStatus = 'active' | 'suspended' | 'cancelled'

export type PaymentStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

export const MODULE_KEYS = [
  'members',
  'bans',
  'events',
  'tickets',
  'posts',
  'invites',
  'analytics',
] as const
export type ModuleKey = (typeof MODULE_KEYS)[number]

export interface User {
  id: number
  discord_id: string
  username: string
  discriminator: string | null
  global_name: string | null
  email: string | null
  avatar_hash: string | null
  is_super_admin: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface Module {
  id: number
  key: ModuleKey | string
  name: string
  description: string | null
  pivot?: {
    is_enabled: boolean
    payment_status: PaymentStatus
    paid_until: string | null
    enabled_at: string | null
  }
}

export interface Client {
  id: number
  discord_guild_id: string
  name: string
  icon_hash: string | null
  owner_user_id: number
  plan: ClientPlan
  status: ClientStatus
  trial_ends_at: string | null
  bot_installed_at: string | null
  bot_permissions: string | null
  created_at: string
  updated_at: string
  owner?: User
  modules?: Module[]
  pivot?: { role: ClientRole }
}

export interface Member {
  id: number
  client_id: number
  discord_user_id: string
  username: string
  global_name: string | null
  avatar_hash: string | null
  role_ids: string[] | null
  joined_discord_at: string | null
  synced_at: string | null
}

export interface Warning {
  id: number
  client_id: number
  discord_user_id: string
  moderator_id: number | null
  reason: string
  resolved_at: string | null
  created_at: string
  moderator?: User
}

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'

export interface TicketMessage {
  id: number
  ticket_id: number
  author_user_id: number | null
  discord_user_id: string | null
  body: string
  created_at: string
  author?: User
}

export interface Ticket {
  id: number
  client_id: number
  discord_user_id: string
  subject: string
  status: TicketStatus
  assigned_user_id: number | null
  discord_channel_id: string | null
  created_at: string
  updated_at: string
  assignee?: User
  messages?: TicketMessage[]
}

export type PostStatus = 'draft' | 'published'

export interface Post {
  id: number
  client_id: number
  author_user_id: number | null
  discord_channel_id: string
  discord_message_id: string | null
  title: string
  content: string
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
  author?: User
}

export interface Invite {
  id: number
  client_id: number
  code: string
  inviter_discord_id: string | null
  uses: number
  max_uses: number | null
  expires_at: string | null
  synced_at: string | null
}

/** Raw Discord role object (guild role resource). */
export interface DiscordRole {
  id: string
  name: string
  color: number
  hoist: boolean
  position: number
  permissions: string
  managed: boolean
  mentionable: boolean
}

/** Raw Discord channel object (guild channel resource). */
export interface DiscordChannel {
  id: string
  name: string
  type: number
  position: number
  parent_id: string | null
}

/** Raw Discord guild object, requested with with_counts=true. */
export interface DiscordGuildStats {
  id: string
  name: string
  icon: string | null
  approximate_member_count?: number
  approximate_presence_count?: number
  premium_subscription_count?: number
  [key: string]: unknown
}

export interface DiscordBanEntry {
  reason: string | null
  user: {
    id: string
    username: string
    global_name?: string | null
    avatar?: string | null
  }
}

export interface DiscordAuditLogEntry {
  id: string
  action_type: number
  user_id: string | null
  target_id: string | null
  reason?: string | null
  [key: string]: unknown
}

export interface AnalyticsSummary {
  guild: DiscordGuildStats
  members_cached: number
  open_tickets: number
  published_posts: number
  unresolved_warnings: number
  upcoming_events: number
}

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'archived'

export interface Lead {
  id: number
  name: string
  email: string
  discord_username: string | null
  server_name: string | null
  plan_interest: ClientPlan
  message: string | null
  status: LeadStatus
  source: string | null
  created_at: string
  updated_at: string
}

/** Raw Discord scheduled-event object. */
export interface DiscordScheduledEvent {
  id: string
  guild_id: string
  name: string
  description: string | null
  scheduled_start_time: string
  scheduled_end_time: string | null
  entity_type: 1 | 2 | 3
  channel_id: string | null
  entity_metadata?: { location?: string } | null
  status?: number
  [key: string]: unknown
}
