import { ArrowRight, Gamepad2, Wrench } from 'lucide-react'
import { Hero } from '../components/home/Hero'
import { Stats } from '../components/home/Stats'
import { PostCard } from '../components/cards/PostCard'
import { ProjectCard } from '../components/cards/ProjectCard'
import { ToolCategoryCard } from '../components/cards/ToolCategoryCard'
import { Section } from '../components/ui/Section'
import { ButtonLink } from '../components/ui/Button'
import { TiltCard } from '../components/visuals/TiltCard'
import { capabilities } from '../data/profile'
import { featuredProjects } from '../data/projects'
import { toolCategories, TOOL_CATEGORY_COUNT, TOOL_ENTRY_TOTAL } from '../data/tools'
import { GAME_COUNT, GAME_GENRE_COUNT, featuredGames } from '../data/games'
import { posts } from '../lib/blog'
import { ACCENT_GRADIENT } from '../lib/accents'
import { useSeo } from '../lib/seo'
import type { AccentKey } from '../types/content'

const ACCENTS: AccentKey[] = ['cyan', 'violet', 'blue']

export function Home() {
  useSeo({ path: '/' })

  // Only the first few of each, so the home page stays a summary and the
  // dedicated pages remain the place to browse.
  const teaserCategories = toolCategories.slice(0, 3)
  const teaserPosts = posts.slice(0, 2)

  return (
    <>
      <Hero />
      <Stats />

      <Section
        id="capabilities"
        eyebrow="What I do"
        title="Three kinds of work, one way of working"
        intro="Design, marketing and web building overlap more than they look like they should. Each of these feeds the others."
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon
            const accent = ACCENTS[index % ACCENTS.length]
            return (
              <TiltCard key={capability.id} as="li" className="p-6" max={5} lift={6}>
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-[var(--r-sm)] text-[var(--c-on-accent)] shadow-[var(--sh-1)]"
                  style={{ background: ACCENT_GRADIENT[accent] }}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="font-display layer-1 mt-4 text-lg font-semibold tracking-tight">
                  {capability.title}
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">{capability.description}</p>
                <ul className="text-faint mt-4 space-y-1.5 border-t border-[var(--c-line)] pt-3 text-xs">
                  {capability.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </TiltCard>
            )
          })}
        </ul>
      </Section>

      <Section
        id="featured-work"
        eyebrow="Selected work"
        title="What I have been building"
        intro="One project in depth, with more to be added as they are ready."
        action={
          <ButtonLink to="/projects">
            All projects
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        }
      >
        <ul className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      </Section>

      <Section
        id="tools-preview"
        eyebrow="Tools"
        title="A browser workbench, not a download"
        intro={`${TOOL_CATEGORY_COUNT} categories and ${TOOL_ENTRY_TOTAL} catalogue entries in a separate open-source project — utilities that do their work in your own browser.`}
        action={
          <ButtonLink to="/tools">
            <Wrench aria-hidden="true" className="size-4" />
            Explore tools
          </ButtonLink>
        }
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teaserCategories.map((category, index) => (
            <ToolCategoryCard
              key={category.id}
              category={category}
              accent={ACCENTS[index % ACCENTS.length]}
            />
          ))}
        </ul>
      </Section>

      <Section
        id="games-preview"
        eyebrow="Games"
        title="A catalogue of small browser games"
        intro={`${GAME_COUNT} games listed across ${GAME_GENRE_COUNT} genres in the same project — arcade, puzzle, board and word games designed to load instantly.`}
        action={
          <ButtonLink to="/games">
            <Gamepad2 aria-hidden="true" className="size-4" />
            Browse games
          </ButtonLink>
        }
      >
        <ul className="flex flex-wrap gap-2">
          {featuredGames.map((game) => (
            <li key={game.name} className="chip">
              {game.name}
            </li>
          ))}
          <li className="chip text-faint">+{GAME_COUNT - featuredGames.length} more</li>
        </ul>
      </Section>

      {teaserPosts.length > 0 ? (
        <Section
          id="writing-preview"
          eyebrow="Writing"
          title="Notes while building"
          intro="Short pieces on the projects, the tools and what I am learning."
          action={
            <ButtonLink to="/blog">
              All posts
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          }
        >
          <ul className="grid gap-6 md:grid-cols-2">
            {teaserPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  )
}
