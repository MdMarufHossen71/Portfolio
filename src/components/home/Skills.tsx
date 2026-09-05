import { Globe, Megaphone, Palette } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '../ui/Section'
import { TiltCard } from '../visuals/TiltCard'
import { currentlyLearning, skillGroups } from '../../data/skills'

const GROUP_ICON: Record<string, LucideIcon> = {
  design: Palette,
  web: Globe,
  marketing: Megaphone,
}

/**
 * Skills / expertise.
 *
 * Grouped lists drawn from `data/skills.ts` — which itself only contains tools
 * and practices already named elsewhere in the repo. No proficiency bars: a
 * percentage would be a fabricated statistic. The "currently learning" panel
 * reuses the same array the About page shows, so the two cannot disagree.
 */
export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="What I work with"
      intro="Grouped by discipline. The last panel is what I am studying next — framed as in progress, not mastered."
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {skillGroups.map((group) => {
          const Icon = GROUP_ICON[group.id] ?? Palette
          return (
            <TiltCard key={group.id} as="li" className="p-6" max={5} lift={6}>
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-[var(--r-sm)] border border-[var(--c-line)] bg-[var(--c-glass-1)] text-[var(--c-accent)]"
              >
                <Icon className="size-5" />
              </span>
              <h3 className="font-display layer-1 mt-4 text-lg font-semibold tracking-tight">
                {group.title}
              </h3>
              <p className="text-muted mt-1.5 text-sm leading-relaxed">{group.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--c-line)] pt-4">
                {group.skills.map((skill) => (
                  <li key={skill} className="chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </TiltCard>
          )
        })}
      </ul>

      <div className="panel mt-5 p-6">
        <h3 className="font-display text-base font-semibold">Currently learning</h3>
        <ul className="text-muted mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {currentlyLearning.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-[var(--c-accent)]">
                →
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
