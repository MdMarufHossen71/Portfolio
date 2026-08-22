import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: string
  title: string
  intro?: ReactNode
  action?: ReactNode
}

/**
 * Page title block.
 *
 * Holds the single <h1> for every route except the home page (whose <h1> is the
 * name in the hero). Sections below use <h2>, keeping one clean outline per page
 * for screen-reader navigation.
 */
export function PageHeader({ eyebrow, title, intro, action }: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--c-line)] py-14 sm:py-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.05] font-semibold tracking-tight">
        {title}
      </h1>
      {intro ? <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed">{intro}</p> : null}
      {action ? <div className="mt-8 flex flex-wrap gap-3">{action}</div> : null}
    </header>
  )
}
