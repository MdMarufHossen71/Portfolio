import { useMemo, useState } from 'react'
import { PostCard } from '../components/cards/PostCard'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
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

  const visible = useMemo(() => (activeTag === null ? posts : postsWithTag(activeTag)), [activeTag])

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
            {postTags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
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

            <p aria-live="polite" className="text-faint mt-3 text-xs">
              {visible.length} of {POST_COUNT} {POST_COUNT === 1 ? 'post' : 'posts'} shown
            </p>

            <div className="mt-8">
              {visible.length > 0 ? (
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {visible.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="Nothing tagged that way yet"
                  description="Pick another topic, or clear the filter to see everything."
                  action={
                    <Button variant="ghost" onClick={() => setActiveTag(null)}>
                      Clear filter
                    </Button>
                  }
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
