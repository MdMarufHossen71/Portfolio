import { ArrowUpRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface ExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  children: ReactNode
  /** Hides the trailing arrow when the surrounding design already implies it. */
  hideIcon?: boolean
  /**
   * Extra words appended to the accessible name, e.g. the project title, so a
   * screen-reader user hitting five "GitHub" links can tell them apart.
   */
  context?: string
}

/**
 * Outbound link.
 *
 * `rel="noopener noreferrer"` on every one: `noopener` because `target="_blank"`
 * otherwise hands the new tab a reference back to this window, and `noreferrer`
 * so the destination is not told which page the visitor came from.
 *
 * The arrow is `aria-hidden`; "opens in a new tab" is added to the accessible
 * name instead, because a decorative glyph is not an announcement.
 */
export function ExternalLink({
  href,
  children,
  hideIcon = false,
  context,
  className = '',
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/link inline-flex items-center gap-1.5 ${className}`}
      {...rest}
    >
      {children}
      {context ? <span className="sr-only"> — {context}</span> : null}
      <span className="sr-only"> (opens in a new tab)</span>
      {hideIcon ? null : (
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
        />
      )}
    </a>
  )
}
