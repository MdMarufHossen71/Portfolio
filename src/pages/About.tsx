import { Mail } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Section } from '../components/ui/Section'
import { ButtonAnchor } from '../components/ui/Button'
import { BrandIcon } from '../components/ui/BrandIcon'
import { ExternalLink } from '../components/ui/ExternalLink'
import { TiltCard } from '../components/visuals/TiltCard'
import { mailto, site } from '../config/site'
import { background, bio, capabilities, learning, toolkit } from '../data/profile'
import { socialLinks } from '../data/socialLinks'
import { useSeo } from '../lib/seo'

export function About() {
  useSeo({
    title: 'About',
    description: `About ${site.name} — a first-year Mathematics student, freelance graphic designer and digital marketer from ${site.location}.`,
    path: '/about',
  })

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Early in the work, serious about it"
        intro={bio}
        action={
          <ButtonAnchor href={mailto} variant="primary">
            <Mail aria-hidden="true" className="size-4" />
            Email me
          </ButtonAnchor>
        }
      />

      <Section
        id="background"
        eyebrow="Background"
        title="Where I am right now"
        intro="Facts, not a career narrative — I am about six months into freelancing and still studying."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {background.map((item) => {
            const Icon = item.icon
            return (
              <TiltCard key={item.id} as="li" className="flex gap-4 p-5" max={4} lift={5}>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-[var(--r-sm)] border border-[var(--c-line)] bg-[var(--c-glass-1)] text-[var(--c-accent)]"
                >
                  <Icon className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="eyebrow text-[0.625rem]">{item.label}</p>
                  <p className="mt-1 font-medium">{item.value}</p>
                  {item.detail ? (
                    <p className="text-muted mt-1 text-sm leading-relaxed">{item.detail}</p>
                  ) : null}
                </div>
              </TiltCard>
            )
          })}
        </ul>
      </Section>

      <Section
        id="capabilities-detail"
        eyebrow="Capabilities"
        title="What I can take on"
        intro="Described as what the work involves rather than as years of seniority."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {capabilities.map((capability) => (
            <div key={capability.id} className="panel p-6">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {capability.title}
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{capability.description}</p>
              <ul className="text-faint mt-4 space-y-1.5 border-t border-[var(--c-line)] pt-3 text-sm">
                {capability.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="panel p-6">
            <h3 className="font-display text-base font-semibold">Tools I work in</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {toolkit.map((tool) => (
                <li key={tool} className="chip">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <h3 className="font-display text-base font-semibold">Currently learning</h3>
            <ul className="text-muted mt-3 space-y-2 text-sm">
              {learning.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-[var(--c-accent)]">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="elsewhere"
        eyebrow="Elsewhere"
        title="Find me online"
        intro="Every profile listed here is one I actually keep. Nothing is guessed from a username pattern."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {socialLinks.map((link) => (
            <li key={link.id}>
              <ExternalLink
                href={link.url}
                className="panel panel--interactive text-muted hover:text-ink flex w-full items-center gap-3 px-4 py-3"
                hideIcon
              >
                <span className="text-faint grid size-8 shrink-0 place-items-center">
                  <BrandIcon mark={link.mark} glyph={link.glyph} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{link.label}</span>
                  <span className="text-faint block truncate text-xs">{link.handle}</span>
                </span>
              </ExternalLink>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
