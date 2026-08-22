import { GAME_COUNT } from '../../data/games'
import { SOURCE_TOOLS_IMPLEMENTED } from '../../data/external'
import { TOOL_CATEGORY_COUNT, TOOL_ENTRY_TOTAL } from '../../data/tools'
import { useReveal } from '../../lib/useReveal'

/**
 * Figures from the Tools & Games project.
 *
 * Every number here is computed from the data files — none is typed as a string —
 * so the site cannot advertise a count that no longer matches its own catalogue.
 *
 * The fourth stat is the honest one, and it stays: of 283 catalogue entries, 53
 * are wired to real browser-side logic. Publishing "283 tools" without it would
 * imply 283 finished utilities.
 */
const stats = [
  { value: TOOL_CATEGORY_COUNT, label: 'Tool categories' },
  { value: TOOL_ENTRY_TOTAL, label: 'Catalogue entries' },
  { value: GAME_COUNT, label: 'Games listed' },
  { value: SOURCE_TOOLS_IMPLEMENTED, label: 'Tools wired up so far' },
]

export function Stats() {
  const revealRef = useReveal<HTMLDivElement>()

  return (
    <div ref={revealRef} className="reveal">
      <dl className="panel grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col bg-[var(--c-glass-1)] px-5 py-6 text-center"
          >
            {/* dt precedes dd in the DOM (as it must), and `order` flips them
                visually so the number reads first. */}
            <dt className="text-faint order-2 mt-1 text-xs">{stat.label}</dt>
            <dd className="font-display text-3xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
