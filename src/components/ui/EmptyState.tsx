import { SearchX } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  /** A way out — clearing a filter, or a link elsewhere. */
  action?: ReactNode
}

/**
 * Shown when a list has nothing in it.
 *
 * An empty grid with no explanation reads as a broken page, so every filterable
 * list on the site renders this instead, always with a route back out.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-14 text-center">
      <SearchX aria-hidden="true" className="text-faint size-7" />
      <p className="font-display text-lg font-semibold">{title}</p>
      {description ? <p className="text-muted max-w-md text-sm">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
