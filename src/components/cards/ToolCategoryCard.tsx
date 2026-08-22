import { ACCENT_GRADIENT } from '../../lib/accents'
import { toolsInCategory } from '../../data/tools'
import type { AccentKey, ToolCategory } from '../../types/content'
import { TiltCard } from '../visuals/TiltCard'

interface ToolCategoryCardProps {
  category: ToolCategory
  accent: AccentKey
}

/**
 * One tool category from the external workbench.
 *
 * The count is labelled "entries", not "tools", because that is what it is: named
 * slots in the source project's catalogue, some already implemented and some still
 * being built. Calling them finished tools would overstate the project.
 *
 * Categories with no representative sample yet say so rather than showing an empty
 * space that reads as a rendering bug.
 */
export function ToolCategoryCard({ category, accent }: ToolCategoryCardProps) {
  const { name, icon: Icon, blurb, sourceCount } = category
  const samples = toolsInCategory(category.id)

  return (
    <TiltCard as="li" className="flex flex-col p-6" max={5} lift={6}>
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-[var(--r-sm)] text-[var(--c-on-accent)] shadow-[var(--sh-1)]"
          style={{ background: ACCENT_GRADIENT[accent] }}
        >
          <Icon className="size-5" />
        </span>
        <span className="text-faint font-mono text-xs tabular-nums">
          {sourceCount}
          <span className="sr-only"> catalogue entries</span>
        </span>
      </div>

      <h3 className="font-display layer-1 mt-4 text-base font-semibold tracking-tight">{name}</h3>
      <p className="text-muted mt-1.5 flex-1 text-sm leading-relaxed">{blurb}</p>

      {samples.length > 0 ? (
        <ul className="text-faint mt-4 space-y-1 border-t border-[var(--c-line)] pt-3 text-xs">
          {samples.slice(0, 4).map((tool) => (
            <li key={tool.name} className="truncate">
              {tool.name}
            </li>
          ))}
          {samples.length > 4 ? <li>+{samples.length - 4} more listed</li> : null}
        </ul>
      ) : (
        <p className="text-faint mt-4 border-t border-[var(--c-line)] pt-3 text-xs">
          No sample listed here yet — browse the project to see this category.
        </p>
      )}
    </TiltCard>
  )
}
