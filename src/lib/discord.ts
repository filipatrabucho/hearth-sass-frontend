/** Standard "Manage Server" + moderation permission bits the bot needs. */
export const BOT_PERMISSIONS = '1374725568'

export function botInviteUrl(guildId: string): string | null {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
  if (!clientId) return null

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'bot',
    permissions: BOT_PERMISSIONS,
    guild_id: guildId,
    disable_guild_select: 'true',
    response_type: 'code',
    redirect_uri: `${window.location.origin}/bot/callback`,
  })

  return `https://discord.com/oauth2/authorize?${params.toString()}`
}
