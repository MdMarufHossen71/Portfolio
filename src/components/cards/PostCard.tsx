import { ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../lib/format'
import type { BlogPost } from '../../types/content'
import { Badge } from '../ui/Badge'
import { TiltCard } from '../visuals/TiltCard'

/**
 * Blog listing card.
 *
 * The whole card is not a link — the heading is. A card-sized <a> wrapping tags
 * and metadata gives screen readers one enormous, unhelpful link name, and it
 * makes selecting text impossible. Instead the heading link is stretched over the
 * card with a pseudo-element for pointer users, which keeps the accessible name
 * short and the click target large.
 *
 * `starter: true` posts are badged as starter content. They are honest templates
 * to build on, not accounts of things that happened.
 */
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <TiltCard as="li" className="group relative flex flex-col p-6" max={4} lift={6}>
      <div className="flex flex-wrap items-center gap-2">
        {post.starter ? <Badge>Starter draft</Badge> : null}
        <Badge icon={Clock}>{post.readingMinutes} min read</Badge>
      </div>

      <h3 className="font-display layer-1 mt-3 text-lg font-semibold tracking-tight">
        <Link
          to={`/blog/${post.slug}`}
          className="before:absolute before:inset-0 before:content-['']"
        >
          {post.title}
        </Link>
      </h3>

      <p className="text-faint mt-1 text-xs">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>

      <p className="text-muted mt-3 flex-1 text-sm leading-relaxed">{post.description}</p>

      {post.tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--c-accent)]">
        Read
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </TiltCard>
  )
}
