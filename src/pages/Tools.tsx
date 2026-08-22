import { ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ToolCategoryCard } from '../components/cards/ToolCategoryCard'
import { Badge } from '../components/ui/Badge'
import { ButtonExternal } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchInput } from '../components/ui/SearchInput'
import { Section } from '../components/ui/Section'
import { githubMark } from '../data/brandMarks'
import { BrandIcon } from '../components/ui/BrandIcon'
import {
  PRIVACY_CAVEATS,
  PRIVACY_STATEMENT,
  TOOLS_GAMES_HIGHLIGHTS,
  TOOLS_GAMES_LIVE_URL,
  TOOLS_GAMES_REPO_URL,
} from '../data/external'
import {
  FEATURED_TOOL_COUNT,
  TOOL_CATEGORY_COUNT,
  TOOL_ENTRY_TOTAL,
  categoryName,
  featuredTools,
  toolCategories,
} from '../data/tools'
import { useSeo } from '../lib/seo'
import type { AccentKey } from '../types/content'

const ACCENTS: AccentKey[] = ['cyan', 'violet', 'blue']

/**
 * Tools showcase.
 *
 * This page describes a *separate* project and says so repeatedly — in the intro,
 * on the buttons, and in the note above the grid. Nothing here runs inside the
 * portfolio, and the copy never implies otherwise.
 *
 * The privacy claim is stated with its exceptions immediately beside it. A
 * privacy promise with hidden asterisks is worse than a modest, complete one.
 */
export function Tools() {
  useSeo({
    title: 'Tools',
    description: `A browser-based workbench of ${TOOL_ENTRY_TOTAL} catalogue entries across ${TOOL_CATEGORY_COUNT} categories — utilities that run in your own browser.`,
    path: '/tools',
  })

  const [query, setQuery] = useState('')
  const normalised = query.trim().toLowerCase()

  const { categories, matchedTools } = useMemo(() => {
    if (!normalised) return { categories: toolCategories, matchedTools: featuredTools }

    const matchedTools = featuredTools.filter((tool) =>
      tool.name.toLowerCase().includes(normalised),
    )
    const idsFromTools = new Set(matchedTools.map((tool) => tool.categoryId))

    const categories = toolCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(normalised) ||
        category.blurb.toLowerCase().includes(normalised) ||
        idsFromTools.has(category.id),
    )

    return { categories, matchedTools }
  }, [normalised])

  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="A browser workbench"
        intro={`Tools & Games BD is a separate open-source project of mine: ${TOOL_ENTRY_TOTAL} catalogue entries across ${TOOL_CATEGORY_COUNT} categories, from text and image utilities to developer helpers. It opens in its own site — nothing on this page runs here.`}
        action={
          <>
            {TOOLS_GAMES_LIVE_URL ? (
              <ButtonExternal href={TOOLS_GAMES_LIVE_URL} variant="primary" context="Tools & Games">
                Open the workbench
              </ButtonExternal>
            ) : null}
            <ButtonExternal href={TOOLS_GAMES_REPO_URL} context="Tools & Games">
              <BrandIcon mark={githubMark} className="size-4" />
              Source code
            </ButtonExternal>
          </>
        }
      />

      <Section
        id="privacy"
        eyebrow="How it handles your data"
        title="Built to keep your input on your machine"
        intro={PRIVACY_STATEMENT}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="panel p-6">
            <h3 className="font-display flex items-center gap-2 text-base font-semibold">
              <ShieldCheck aria-hidden="true" className="size-[18px] text-[var(--c-accent)]" />
              What that means in practice
            </h3>
            <ul className="text-muted mt-4 space-y-2.5 text-sm">
              {TOOLS_GAMES_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-[var(--c-accent)]">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* The small print, in the open. */}
          <div className="panel p-6">
            <h3 className="font-display text-base font-semibold">The exceptions, stated plainly</h3>
            <ul className="text-muted mt-4 space-y-2.5 text-sm">
              {PRIVACY_CAVEATS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-faint">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="categories"
        eyebrow="Categories"
        title="Browse by what you need"
        intro={`Counts are catalogue entries — named, routed slots in the project. The tools behind them are being filled in over time, so treat these as the shape of the project rather than ${TOOL_ENTRY_TOTAL} finished utilities.`}
      >
        <div className="max-w-md">
          <SearchInput
            value={query}
            onChange={setQuery}
            label="Search tool categories and tools"
            placeholder="Search categories or tools…"
            resultSummary={
              normalised
                ? `${categories.length} of ${TOOL_CATEGORY_COUNT} categories match`
                : `${TOOL_CATEGORY_COUNT} categories, ${FEATURED_TOOL_COUNT} sample tools listed`
            }
          />
        </div>

        <div className="mt-8">
          {categories.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <ToolCategoryCard
                  key={category.id}
                  category={category}
                  accent={ACCENTS[index % ACCENTS.length]}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Nothing matches that search"
              description="This page lists categories and a sample of tools, not the whole catalogue — the full set is searchable inside the project itself."
            />
          )}
        </div>

        {normalised && matchedTools.length > 0 ? (
          <div className="mt-8">
            <h3 className="font-display text-sm font-semibold">Matching tools</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {matchedTools.map((tool) => (
                <li key={tool.name} className="chip">
                  {tool.name}
                  <span className="text-faint">· {categoryName(tool.categoryId)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section
        id="tools-sample"
        eyebrow="A sample"
        title="Some of the tools in there"
        intro={`${FEATURED_TOOL_COUNT} representative tools, chosen to show the range. Not a complete index.`}
        action={<Badge>External project</Badge>}
      >
        <ul className="flex flex-wrap gap-2">
          {featuredTools.map((tool) => (
            <li key={tool.name} className="chip">
              {tool.name}
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
