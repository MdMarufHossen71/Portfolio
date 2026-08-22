import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { mailto, site } from '../../config/site'
import { bioShort, toolkit } from '../../data/profile'
import { useTilt } from '../../lib/useTilt'
import { ButtonAnchor, ButtonLink } from '../ui/Button'
import { Monogram } from '../ui/Monogram'

/**
 * The floating identity card.
 *
 * This is where the 3D idea is stated most plainly: a glass slab in perspective,
 * with its contents at three different `translateZ` depths, so tilting produces
 * genuine parallax between the monogram, the text and the chips rather than a flat
 * image being skewed.
 *
 * All of it is decoration layered *over* content that is already complete without
 * it — the name, role and bio to the left are the actual page.
 */
function HeroCard() {
  const tiltRef = useTilt<HTMLDivElement>({ max: 9, lift: 14 })

  return (
    <div className="tilt-wrap mx-auto w-full max-w-sm lg:max-w-none">
      <div ref={tiltRef} className="tilt panel panel--interactive p-8">
        <div className="layer-3 flex items-center gap-4">
          <Monogram size={64} />
          <div>
            <p className="font-display text-lg leading-tight font-semibold">{site.shortName}</p>
            <p className="text-faint text-sm">{site.location}</p>
          </div>
        </div>

        <div className="layer-2 mt-7 space-y-3">
          {[
            { label: 'Design', value: 'Brand & social visuals' },
            { label: 'Marketing', value: 'Content and page growth' },
            { label: 'Web', value: 'React + TypeScript builds' },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 rounded-[var(--r-sm)] border border-[var(--c-line)] bg-[var(--c-glass-1)] px-3.5 py-2.5"
            >
              <span className="eyebrow text-[0.625rem]">{row.label}</span>
              <span className="text-muted text-xs">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="layer-1 mt-7">
          <p className="text-faint mb-2 text-[0.6875rem] tracking-[0.14em] uppercase">Works in</p>
          <ul className="flex flex-wrap gap-1.5">
            {toolkit.map((tool) => (
              <li key={tool} className="chip text-[0.6875rem]">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Home hero.
 *
 * The <h1> is the name — one per page, and the thing this site is actually about.
 * The role sits in a paragraph beneath it rather than being crammed into the
 * heading, so the document outline stays meaningful.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="grid gap-14 py-16 lg:grid-cols-2 lg:py-24">
      <div className="flex flex-col justify-center">
        <p className="eyebrow">{site.eyebrow}</p>

        <h1
          id="hero-heading"
          className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.03] font-semibold tracking-tight"
        >
          {site.name}
        </h1>

        <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed">{bioShort}</p>

        <p className="text-faint mt-5 inline-flex items-center gap-2 text-sm">
          <MapPin aria-hidden="true" className="size-4" />
          {site.location}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink to="/projects" variant="primary">
            View projects
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
          <ButtonLink to="/tools">Explore the tools</ButtonLink>
          <ButtonAnchor href={mailto} variant="quiet">
            <Mail aria-hidden="true" className="size-4" />
            Get in touch
          </ButtonAnchor>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <HeroCard />
      </div>
    </section>
  )
}
