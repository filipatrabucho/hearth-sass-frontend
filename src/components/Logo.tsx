import { clsx } from 'clsx'

/** The HearthGG mark: a small flame inside a circular gradient badge. */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={clsx('shrink-0', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="hearthgg-logo-g" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a78bff" />
          <stop offset="1" stopColor="#5b32d6" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#hearthgg-logo-g)" />
      <path
        d="M16 7.2c-3.6 4.4-5.8 7.9-5.8 11a5.8 5.8 0 1 0 11.6 0c0-3.1-2.2-6.6-5.8-11Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M16 15.4c-1.4 1.9-2.1 3.3-2.1 4.4a2.1 2.1 0 1 0 4.2 0c0-1.1-.7-2.5-2.1-4.4Z"
        fill="#5b32d6"
      />
    </svg>
  )
}
