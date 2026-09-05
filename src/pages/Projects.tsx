import { useMemo, useState } from 'react'
import { ProjectCard } from '../components/cards/ProjectCard'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { projects, projectCategories, projectTechTags } from '../data/projects'
import { projectJsonLd, useJsonLd, useSeo } from '../lib/seo'

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

  // Structured data for real projects only — stubs describe nothing yet.
  const realProjects = projects.filter((p) => !p.placeholder)
  useJsonLd(
    'projects-jsonld',
    realProjects.map((p) =>
      projectJsonLd({
        title: p.title,
        description: p.summary,
        tech: p.tech,
        url: p.liveUrl,
        repoUrl: p.repoUrl,
        year: p.year,
      }),
    ),
  )

  const [activeTags, setActiveTags] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const visible = useMemo(() => {
    return projects.filter((project) => {
      // Every selected tag must be present, so stacking filters narrows results.
      const matchesTags =
        activeTags.length === 0 || activeTags.every((tag) => project.tech.includes(tag))
      const matchesCategory = activeCategory === null || project.category === activeCategory
      return matchesTags && matchesCategory
    })
  }, [activeTags, activeCategory])

  const toggleTag = (tag: string) => {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    )
  }

  const clearAll = () => {
    setActiveTags([])
    setActiveCategory(null)
  }
  const filtersActive = activeTags.length > 0 || activeCategory !== null

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things I have designed and built"
        intro="One substantial project so far, plus space held for work still being written up. Filter by what it was built with."
      />

      <div className="py-10">
        {projectCategories.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-faint mr-1 text-xs tracking-[0.14em] uppercase">Category</span>
            {projectCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                count={projects.filter((p) => p.category === category).length}
                active={activeCategory === category}
                // Single-select: categories are broad buckets, and stacking two
                // of them across a small catalogue would only empty the list.
                onToggle={() =>
                  setActiveCategory((current) => (current === category ? null : category))
                }
              />
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-faint mr-1 text-xs tracking-[0.14em] uppercase">Built with</span>
          {projectTechTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              active={activeTags.includes(tag)}
              onToggle={() => toggleTag(tag)}
            />
          ))}
          {filtersActive ? (
            <Button variant="quiet" onClick={clearAll}>
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
              description="Try removing a tag or category — the filters narrow results rather than widening them."
              action={
                <Button variant="ghost" onClick={clearAll}>
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
