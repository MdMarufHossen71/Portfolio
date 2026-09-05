import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { mailto, site } from '../../config/site'
import { bioShort } from '../../data/profile'
import { primarySocialLinks } from '../../data/socialLinks'
import { useTilt } from '../../lib/useTilt'
import { ButtonAnchor, ButtonLink } from '../ui/Button'
import { BrandIcon } from '../ui/BrandIcon'
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
            {['Adobe Illustrator', 'Canva', 'Vector design', 'Raster → vector'].map((tool) => (
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
        <p className="eyebrow hero-enter">Graphic Designer &amp; Digital Creator</p>

        <h1
          id="hero-heading"
          className="hero-enter mt-4 text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.03] font-semibold tracking-tight"
        >
          {site.name}
        </h1>

        <p className="hero-enter mt-5 max-w-xl text-lg leading-relaxed font-medium text-[var(--c-text)]">
          I design logos, vectors and social visuals — and build fast websites to put them on.
        </p>

        <p className="text-muted hero-enter mt-3 max-w-xl leading-relaxed">{bioShort}</p>

        <ul aria-label="What I can help with" className="hero-enter mt-5 flex flex-wrap gap-1.5">
          {[
            'Graphic design',
            'Vector design',
            'Logo redrawing',
            'Social visuals',
            'Illustration',
            'Web builds',
            'Freelance work',
          ].map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>

        <p className="text-faint hero-enter mt-5 inline-flex items-center gap-2 text-sm">
          <MapPin aria-hidden="true" className="size-4" />
          {site.location} · Open for freelance
        </p>

        <div className="hero-enter mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink to="/projects" variant="primary">
            View my work
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
          <ButtonAnchor href={mailto} variant="ghost">
            <Mail aria-hidden="true" className="size-4" />
            Contact me
          </ButtonAnchor>
        </div>

        <ul aria-label="Profiles" className="hero-enter mt-7 flex flex-wrap items-center gap-2">
          {primarySocialLinks.map((link) => (
            <li key={link.id}>
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
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-enter flex items-center justify-center">
        <HeroCard />
      </div>
    </section>
  )
}
