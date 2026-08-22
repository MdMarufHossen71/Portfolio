import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { formatDate } from '../lib/format'
import { getPost, posts } from '../lib/blog'
import { articleJsonLd, useJsonLd, useSeo } from '../lib/seo'

/**
 * A single post.
 *
 * `dangerouslySetInnerHTML` is safe here for two compounding reasons: the markdown
 * is authored in this repository and bundled at build time (never fetched, never
 * user-submitted), and `lib/markdown.ts` escapes raw HTML blocks and allow-lists
 * link schemes anyway. The second reason is the one that matters — it holds even
 * if the first stops being true.
 */
export function BlogPost() {
  const { slug = '' } = useParams()
  const post = getPost(slug)

  // A miss lands here rather than on the shared 404 so the visitor keeps the blog
  // context and gets a route straight back to the index.
  if (!post) return <PostNotFound slug={slug} />

  const index = posts.findIndex((item) => item.slug === post.slug)
  const newer = index > 0 ? posts[index - 1] : null
  const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null

  return <PostBody post={post} newer={newer} older={older} />
}

type Post = NonNullable<ReturnType<typeof getPost>>

function PostBody({ post, newer, older }: { post: Post; newer: Post | null; older: Post | null }) {
  useSeo({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.date,
    tags: post.tags,
  })

  useJsonLd(
    'article-jsonld',
    articleJsonLd({
      title: post.title,
      description: post.description,
      date: post.date,
      slug: post.slug,
      tags: post.tags,
    }),
  )

  return (
    <article className="py-12 sm:py-16">
      <Link
        to="/blog"
        className="text-faint hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All posts
      </Link>

      <header className="mt-8 border-b border-[var(--c-line)] pb-10">
        <div className="flex flex-wrap items-center gap-2">
          {post.starter ? <Badge>Starter draft</Badge> : null}
          <Badge icon={Clock}>{post.readingMinutes} min read</Badge>
        </div>

        <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] font-semibold tracking-tight">
          {post.title}
        </h1>

        <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed">{post.description}</p>

        <p className="text-faint mt-6 text-sm">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>

        {post.tags.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {post.starter ? (
        <aside className="panel mt-10 border-dashed p-5">
          <p className="text-muted text-sm leading-relaxed">
            <strong className="text-ink font-semibold">This is a starter draft.</strong> It sets out
            the shape of the piece and the points I want to make, and it will be rewritten with
            specifics as the work it describes progresses. Nothing in it is presented as a finished
            account.
          </p>
        </aside>
      ) : null}

      {/* Rendered from markdown at build time — see the note at the top of this file. */}
      <div className="prose mt-12" dangerouslySetInnerHTML={{ __html: post.html }} />

      {newer || older ? (
        <nav
          aria-label="More posts"
          className="mt-16 grid gap-4 border-t border-[var(--c-line)] pt-10 sm:grid-cols-2"
        >
          {older ? (
            <PostLink post={older} direction="older" />
          ) : (
            <span className="hidden sm:block" />
          )}
          {newer ? <PostLink post={newer} direction="newer" /> : null}
        </nav>
      ) : null}
    </article>
  )
}

function PostLink({ post, direction }: { post: Post; direction: 'older' | 'newer' }) {
  const isNewer = direction === 'newer'
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`panel panel--interactive group flex flex-col gap-1 p-5 ${
        isNewer ? 'sm:items-end sm:text-right' : ''
      }`}
    >
      <span className="text-faint flex items-center gap-1.5 text-xs tracking-[0.14em] uppercase">
        {isNewer ? null : <ArrowLeft aria-hidden="true" className="size-3.5" />}
        {isNewer ? 'Newer post' : 'Older post'}
        {isNewer ? <ArrowRight aria-hidden="true" className="size-3.5" /> : null}
      </span>
      <span className="font-display group-hover:text-[var(--c-accent)] font-medium transition-colors">
        {post.title}
      </span>
    </Link>
  )
}

function PostNotFound({ slug }: { slug: string }) {
  useSeo({
    title: 'Post not found',
    description: 'That post does not exist.',
    path: `/blog/${slug}`,
    noindex: true,
  })

  return (
    <div className="flex flex-col items-start py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        That post does not exist
      </h1>
      <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed">
        The link may be out of date, or the post may have been renamed. The index has everything
        that is published.
      </p>
      <div className="mt-8">
        <ButtonLink to="/blog" variant="primary">
          Back to the blog
        </ButtonLink>
      </div>
    </div>
  )
}
