import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  icon?: LucideIcon
  className?: string
  /** Adds a title attribute for extra context on hover. Never the only source. */
  title?: string
}

/** Small uppercase monospace label. Decorative icons are hidden from AT. */
export function Badge({ children, icon: Icon, className = '', title }: BadgeProps) {
  return (
    <span className={`badge ${className}`} title={title}>
      {Icon ? <Icon aria-hidden="true" className="size-3" /> : null}
      {children}
    </span>
  )
}
