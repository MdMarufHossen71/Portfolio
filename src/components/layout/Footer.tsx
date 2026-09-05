import { Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mailto, site } from '../../config/site'
import { navItems } from '../../data/nav'
import { moreSocialLinks, primarySocialLinks } from '../../data/socialLinks'
import type { SocialLink } from '../../types/content'
import { BrandIcon } from '../ui/BrandIcon'
import { Disclosure } from '../ui/Disclosure'
import { ExternalLink } from '../ui/ExternalLink'
import { Monogram } from '../ui/Monogram'

/**
 * Footer.
 *
 * Four verified profiles are surfaced directly; the remaining twelve live behind
 * a disclosure so the footer stays scannable without hiding anything.
 *
 * Note on what is absent: there is no Facebook link. No verified personal profile
 * URL has been provided, and guessing one would point visitors at a stranger. It
 * is logged in CONTENT_TODO.md and can be added to `socialLinks.ts` in one line
 * once confirmed.
 */

function SocialIconLink({ link }: { link: SocialLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="me noopener noreferrer"
      title={link.label}
      className="text-muted hover:text-ink grid size-10 place-items-center rounded-full border border-[var(--c-line)] bg-[var(--c-glass-1)] transition-colors hover:border-[var(--c-accent)]"
    >
      <BrandIcon mark={link.mark} glyph={link.glyph} />
      <span className="sr-only">{link.label} (opens in a new tab)</span>
    </a>
  )
}

export function Footer() {
  // Computed at render, so the notice never goes stale in a cached build.
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 mt-8 border-t border-[var(--c-line)] bg-[color-mix(in_oklab,var(--c-surface)_60%,transparent)]">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Monogram size={40} />
              <div>
                <p className="font-display leading-tight font-semibold">{site.name}</p>
                <p className="text-faint text-sm">{site.eyebrow}</p>
              </div>
            </div>

            <ul className="text-muted mt-5 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                <span>{site.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail aria-hidden="true" className="size-4 shrink-0" />
                <a href={mailto} className="hover:text-ink underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display mb-4 text-sm font-semibold">Pages</h2>
            <ul className="text-muted space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-ink underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display mb-4 text-sm font-semibold">Elsewhere</h2>
            <ul className="flex flex-wrap gap-2">
              {primarySocialLinks.map((link) => (
                <li key={link.id}>
                  <SocialIconLink link={link} />
                </li>
              ))}
            </ul>

            <Disclosure summary="More links" count={moreSocialLinks.length} className="mt-4 -ml-3">
              <ul className="space-y-1">
                {moreSocialLinks.map((link) => (
                  <li key={link.id}>
                    <ExternalLink
                      href={link.url}
                      hideIcon
                      className="text-muted hover:text-ink text-sm"
                    >
                      <BrandIcon
                        mark={link.mark}
                        glyph={link.glyph}
                        className="size-4 opacity-70"
                      />
                      {link.label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </Disclosure>
          </div>
        </div>

        <div className="text-faint mt-12 flex flex-col gap-2 border-t border-[var(--c-line)] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Source released under the GNU GPL v3.
          </p>
          <p>Built with React, TypeScript and Tailwind CSS. No trackers, no cookies.</p>
          <a href="#main" className="hover:text-ink underline-offset-4 hover:underline sm:ml-4">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
