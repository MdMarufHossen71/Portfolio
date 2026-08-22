import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'

interface DisclosureProps {
  /** Label for the collapsed state, e.g. "More links". */
  summary: string
  /** Optional count appended to the label. */
  count?: number
  children: ReactNode
  className?: string
}

/**
 * Show/hide region.
 *
 * Built from a <button> plus `aria-expanded` / `aria-controls` rather than
 * <details>, because the content needs the site's own transition and because
 * <details> styling is still inconsistent across engines.
 *
 * The panel is unmounted when collapsed, so its links are genuinely out of the
 * tab order — a `display:none` panel that still holds focusable children is a
 * common keyboard trap.
 */
export function Disclosure({ summary, count, children, className = '' }: DisclosureProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className={className}>
      <button
        type="button"
        className="btn btn--quiet"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          {summary}
          {count === undefined ? null : ` (${count})`}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <div id={panelId} className="mt-4">
          {children}
        </div>
      ) : null}
    </div>
  )
}
