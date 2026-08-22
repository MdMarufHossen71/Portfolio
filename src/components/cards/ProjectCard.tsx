import { Clock, Sparkles } from 'lucide-react'
import { githubMark } from '../../data/brandMarks'
import { ACCENT_GRADIENT, accentWash } from '../../lib/accents'
import type { Project } from '../../types/content'
import { Badge } from '../ui/Badge'
import { BrandIcon } from '../ui/BrandIcon'
import { ExternalLink } from '../ui/ExternalLink'
import { TiltCard } from '../visuals/TiltCard'

/**
 * Project card.
 *
 * Artwork is a CSS gradient keyed to the project's accent — no image files, so
 * nothing to download and nothing to go stale.
 *
 * Two honesty rules are enforced here rather than left to whoever writes the copy:
 *   • A live link renders only when `liveUrl` exists. When it does not, the card
 *     says so instead of linking somewhere that 404s.
 *   • `placeholder` entries are visibly marked as unfinished. A stub that looks
 *     like real work is a fabricated project.
 */
export function ProjectCard({ project }: { project: Project }) {
  const {
    title,
    summary,
    role,
    year,
    tech,
    repoUrl,
    liveUrl,
    liveUrlPending,
    accent,
    status,
    placeholder,
  } = project

  return (
    <TiltCard as="li" className={`flex flex-col ${placeholder ? 'border-dashed opacity-80' : ''}`}>
      {/* Decorative gradient plate. The translateZ pushes it behind the text
          layer so tilting produces real parallax between the two. */}
      <div
        aria-hidden="true"
        className="h-28 rounded-t-[calc(var(--r-lg)-1px)] border-b border-[var(--c-line)]"
        style={{ background: ACCENT_GRADIENT[accent], opacity: 0.85 }}
      />

      <div className="layer-1 flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {placeholder ? <Badge icon={Sparkles}>Placeholder</Badge> : null}
          {status ? <Badge>{status}</Badge> : null}
          {year ? <Badge icon={Clock}>{year}</Badge> : null}
        </div>

        <h3 className="font-display mt-3 text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-faint mt-1 text-sm">{role}</p>
        <p className="text-muted mt-3 flex-1 text-sm leading-relaxed">{summary}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {tech.map((item) => (
            <li
              key={item}
              className="text-muted rounded-[var(--r-xs)] px-2 py-1 text-[0.6875rem] font-medium"
              style={{ background: accentWash(accent) }}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--c-line)] pt-4 text-sm">
          {liveUrl ? (
            <ExternalLink
              href={liveUrl}
              context={title}
              className="font-medium text-[var(--c-accent)]"
            >
              Live demo
            </ExternalLink>
          ) : null}

          {repoUrl ? (
            <ExternalLink href={repoUrl} context={title} className="text-muted hover:text-ink">
              <BrandIcon mark={githubMark} className="size-4" />
              Source
            </ExternalLink>
          ) : null}

          {!liveUrl && liveUrlPending ? (
            <span className="text-faint text-xs">Live demo not published yet</span>
          ) : null}

          {!liveUrl && !repoUrl && !liveUrlPending ? (
            <span className="text-faint text-xs">[Add a repository or live link]</span>
          ) : null}
        </div>
      </div>
    </TiltCard>
  )
}
