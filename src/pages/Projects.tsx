import { useMemo, useState } from 'react'
import { ProjectCard } from '../components/cards/ProjectCard'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { projects, projectTechTags } from '../data/projects'
import { useSeo } from '../lib/seo'

/**
 * Projects.
 *
 * Filtering by tech tag is client-side and derived from the data — the tag list is
 * not maintained by hand, so it cannot list a tag no project has.
 *
 * Placeholder entries stay visible rather than being hidden until "ready". A
 * portfolio with two obvious gaps reads as honest; one that quietly shows a single
 * project reads as thin. They are labelled, so nothing is passed off as finished.
 */
export function Projects() {
  useSeo({
    title: 'Projects',
    description:
      'Projects built and designed by Md Maruf Hossen, including the Tools & Games browser workbench.',
    path: '/projects',
  })

  const [activeTags, setActiveTags] = useState<string[]>([])

  const visible = useMemo(() => {
    if (activeTags.length === 0) return projects
    // Every selected tag must be present, so stacking filters narrows results.
    return projects.filter((project) => activeTags.every((tag) => project.tech.includes(tag)))
  }, [activeTags])

  const toggleTag = (tag: string) => {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things I have designed and built"
        intro="One substantial project so far, plus space held for work still being written up. Filter by what it was built with."
      />

      <div className="py-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-faint mr-1 text-xs tracking-[0.14em] uppercase">Built with</span>
          {projectTechTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              active={activeTags.includes(tag)}
              onToggle={() => toggleTag(tag)}
            />
          ))}
          {activeTags.length > 0 ? (
            <Button variant="quiet" onClick={() => setActiveTags([])}>
              Clear
            </Button>
          ) : null}
        </div>

        <p aria-live="polite" className="text-faint mt-3 text-xs">
          {visible.length} of {projects.length} projects shown
        </p>

        <div className="mt-8">
          {visible.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No projects match those filters"
              description="Try removing a tag — the filters narrow results rather than widening them."
              action={
                <Button variant="ghost" onClick={() => setActiveTags([])}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </div>
    </>
  )
}
