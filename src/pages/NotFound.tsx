import { Home } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { ButtonLink } from '../components/ui/Button'
import { navItems } from '../data/nav'
import { useSeo } from '../lib/seo'

/**
 * 404.
 *
 * `noindex` on purpose: a static host with SPA fallback returns 200 for unknown
 * paths, so without this a crawler would happily index every typo as a real page.
 *
 * The full nav is repeated here because a 404 is often a visitor's first landing
 * from a stale link, and "go home" alone makes them start over.
 */
export function NotFound() {
  const { pathname } = useLocation()

  useSeo({
    title: 'Page not found',
    description: 'That page does not exist.',
    path: pathname,
    noindex: true,
  })

  return (
    <div className="flex flex-col items-start py-24 sm:py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-[clamp(2.25rem,7vw,4rem)] leading-[1.05] font-semibold tracking-tight">
        This page does not exist
      </h1>
      <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed">
        The address <code className="text-ink text-[0.9em] break-all">{pathname}</code> did not
        match anything on this site. It may be an old link, or a small typo.
      </p>

      <div className="mt-8">
        <ButtonLink to="/" variant="primary">
          <Home aria-hidden="true" className="size-4" />
          Back to the home page
        </ButtonLink>
      </div>

      <nav aria-label="Site sections" className="mt-12 w-full border-t border-[var(--c-line)] pt-8">
        <p className="text-faint text-xs tracking-[0.14em] uppercase">Or try one of these</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <ButtonLink to={item.to} variant="quiet">
                {item.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
