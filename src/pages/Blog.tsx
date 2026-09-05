import { useMemo, useState } from 'react'
import { PostCard } from '../components/cards/PostCard'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchInput } from '../components/ui/SearchInput'
import { POST_COUNT, posts, postTags, postsWithTag } from '../lib/blog'
import { useSeo } from '../lib/seo'

/**
 * Blog index.
 *
 * Posts are markdown files in `src/content/blog/` — see `lib/blog.ts` for the
 * frontmatter contract. Tags here are derived from the posts themselves, so this
 * list can never offer a filter that matches nothing.
 *
 * The starting posts are marked `starter: true` and are labelled as drafts in the
 * UI. They are scaffolding written to be replaced, not accounts of things that
 * happened, and the labelling is what keeps that honest.
 */
export function Blog() {
  useSeo({
    title: 'Blog',
    description:
      'Notes on building for the web, designing digital tools, and what I am learning along the way.',
    path: '/blog',
  })

  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const base = activeTag === null ? posts : postsWithTag(activeTag)
    const normalised = query.trim().toLowerCase()
    if (!normalised) return base
    return base.filter(
      (post) =>
        post.title.toLowerCase().includes(normalised) ||
        post.description.toLowerCase().includes(normalised) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalised)),
    )
  }, [activeTag, query])

  const filtersActive = activeTag !== null || query.trim() !== ''

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Writing, in progress"
        intro="Short pieces on what I am building and learning. Everything here is a starter draft I am filling in as the work goes — each one says so on the page."
      />

      <div className="py-10">
        {POST_COUNT === 0 ? (
          <EmptyState
            title="No posts yet"
            description="The first pieces are being written. Add a markdown file to src/content/blog/ to publish one."
          />
        ) : (
          <>
            <div className="max-w-md">
              <SearchInput
                value={query}
                onChange={setQuery}
                label="Search posts by title, description or tag"
                placeholder="Search posts…"
                resultSummary={`${visible.length} of ${POST_COUNT} ${POST_COUNT === 1 ? 'post' : 'posts'} shown`}
              />
            </div>

            {postTags.length > 0 ? (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-faint mr-1 text-xs tracking-[0.14em] uppercase">Topics</span>
                {postTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    count={postsWithTag(tag).length}
                    active={activeTag === tag}
                    // Single-select: tags here are broad topics, and stacking two
                    // of them across three posts would only ever empty the list.
                    onToggle={() => setActiveTag((current) => (current === tag ? null : tag))}
                  />
                ))}
                {activeTag !== null ? (
                  <Button variant="quiet" onClick={() => setActiveTag(null)}>
                    Clear
                  </Button>
                ) : null}
              </div>
            ) : null}

            {visible.length > 0 ? (
              <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </ul>
            ) : (
              <EmptyState
                title={
                  filtersActive ? 'Nothing matches that search' : 'Nothing tagged that way yet'
                }
                description="Try different words, pick another topic, or clear the filters to see everything."
                action={
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setActiveTag(null)
                      setQuery('')
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
