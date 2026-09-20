import { clsx } from 'clsx'
import { initials } from '@/lib/format'

export function Avatar({
  src,
  name,
  size = 36,
  className,
}: {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? ''}
        style={{ width: size, height: size }}
        className={clsx('shrink-0 rounded-full object-cover ring-1 ring-white/5', className)}
      />
    )
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full bg-brand-gradient font-semibold text-white ring-1 ring-white/5',
        className,
      )}
    >
      {initials(name)}
    </div>
  )
}

export function discordAvatarUrl(discordId: string, avatarHash?: string | null, size = 64): string | null {
  if (!avatarHash) return null
  const ext = avatarHash.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${ext}?size=${size}`
}
