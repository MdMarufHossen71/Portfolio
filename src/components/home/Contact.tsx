import { Check, Copy, Mail, MapPin } from 'lucide-react'
import { useState } from 'react'
import { mailto, site } from '../../config/site'
import { primarySocialLinks } from '../../data/socialLinks'
import { Section } from '../ui/Section'
import { BrandIcon } from '../ui/BrandIcon'
import { ButtonAnchor } from '../ui/Button'

/**
 * Contact section.
 *
 * Deliberately CTA-based, not a form: there is no backend on this static site,
 * and a form that posts nowhere would be a lie. Email opens the visitor's own
 * mail app; the copy button keeps the address handy with an announced
 * confirmation. No secrets, no third-party calls, no tracking.
 */
export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard unavailable (permissions, old browser): the visible address
      // next to the button is still selectable by hand.
      setCopied(false)
    }
  }

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's work together"
      intro="Currently open for freelance — vectors, brand visuals, social design and small websites. Email is the fastest way to reach me."
      action={
        <ButtonAnchor href={mailto} variant="primary">
          <Mail aria-hidden="true" className="size-4" />
          Email me
        </ButtonAnchor>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="panel p-6 sm:p-8">
          <p className="eyebrow text-[0.625rem]">Email</p>
          <p className="font-display mt-2 text-xl font-semibold tracking-tight break-all sm:text-2xl">
            {site.email}
          </p>
          <p className="text-muted mt-3 flex items-center gap-2 text-sm">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            {site.location}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonAnchor href={mailto} variant="primary">
              <Mail aria-hidden="true" className="size-4" />
              Start a project
            </ButtonAnchor>
            <button type="button" onClick={copyEmail} className="btn btn--ghost">
              {copied ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <Copy aria-hidden="true" className="size-4" />
              )}
              {copied ? 'Copied' : 'Copy email'}
            </button>
          </div>
          <p aria-live="polite" className="text-faint mt-3 min-h-5 text-xs">
            {copied ? 'Email address copied to your clipboard.' : ''}
          </p>
          <p className="text-faint mt-2 text-sm leading-relaxed">
            Mention which service you need and anything you already have — sketches, references,
            deadlines. I reply personally.
          </p>
        </div>

        <div className="panel p-6 sm:p-8">
          <h3 className="font-display text-base font-semibold">Elsewhere</h3>
          <p className="text-muted mt-1.5 text-sm">
            Fastest responses on email — these for the rest.
          </p>
          <ul className="mt-5 grid gap-2.5">
            {primarySocialLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-muted hover:text-ink flex items-center gap-3 rounded-[var(--r-sm)] border border-[var(--c-line)] bg-[var(--c-glass-1)] px-4 py-2.5 text-sm transition-colors hover:border-[var(--c-accent)]"
                >
                  <span className="text-faint grid size-8 shrink-0 place-items-center">
                    <BrandIcon mark={link.mark} glyph={link.glyph} />
                  </span>
                  <span className="font-medium">{link.label}</span>
                  <span className="text-faint ml-auto truncate text-xs">{link.handle}</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
