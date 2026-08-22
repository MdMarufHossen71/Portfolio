import type { ReactNode } from 'react'
import { useReveal } from '../../lib/useReveal'

interface SectionProps {
  /** Anchor target, also used for the heading's `aria-labelledby` wiring. */
  id: string
  eyebrow?: string
  title: ReactNode
  /** Lead paragraph under the heading. */
  intro?: ReactNode
  /** Rendered at the top-right on wide screens, e.g. a "view all" link. */
  action?: ReactNode
  children: ReactNode
  /** Renders an <h1> instead of <h2>. Exactly one per page should set this. */
  as?: 'h1' | 'h2'
  className?: string
}

/**
 * Standard page section: labelled landmark, consistent rhythm, one reveal.
 *
 * The <section> is labelled by its own heading rather than an `aria-label`
 * duplicate, so screen-reader users hear the heading text once.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  action,
  children,
  as: Heading = 'h2',
  className = '',
}: SectionProps) {
  const revealRef = useReveal<HTMLDivElement>()
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative py-16 sm:py-20 lg:py-24 ${className}`}
    >
      <div ref={revealRef} className="reveal">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
            <Heading
              id={headingId}
              className={
                Heading === 'h1'
                  ? 'text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl'
                  : 'text-3xl leading-tight font-semibold tracking-tight sm:text-4xl'
              }
            >
              {title}
            </Heading>
            {intro ? <p className="text-muted mt-4 text-base sm:text-lg">{intro}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
      <div className="mt-10 sm:mt-12">{children}</div>
    </section>
  )
}
