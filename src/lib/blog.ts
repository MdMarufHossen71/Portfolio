import type { BlogFrontmatter, BlogPost } from '../types/content'
import { readingMinutes, renderMarkdown } from './markdown'

/**
 * Blog loader.
 *
 * ─── HOW TO ADD A POST ───────────────────────────────────────────────────────
 * Drop a `.md` file into `src/content/blog/`. The filename becomes the URL slug
 * (`hello-world.md` → `/blog/hello-world`). Start it with frontmatter:
 *
 *     ---
 *     title: A clear, specific title
 *     description: One or two sentences for cards and search results.
 *     date: 2026-08-22
 *     tags: [Web, Design]
 *     published: true
 *     ---
 *
 * Optional keys: `cover` (image path) and `starter: true`.
 *
 * `published: false` hides a post everywhere, including the sitemap — use it for
 * drafts. `starter: true` marks template copy so the UI can label it as such
 * instead of presenting it as a personal account.
 *
 * Posts are bundled at build time by Vite's glob import, so there is no runtime
 * fetch, no loading spinner, and a broken post fails the build rather than the
 * visitor's page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const modules = import.meta.glob<string>('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

type ParsedValue = string | string[] | boolean

function stripQuotes(value: string): string {
  const trimmed = value.trim()
  if (trimmed.length >= 2) {
    const first = trimmed[0]
    const last = trimmed[trimmed.length - 1]
    if ((first === '"' || first === "'") && first === last) return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseScalar(raw: string): ParsedValue {
  const value = raw.trim()
  if (value === 'true') return true
  if (value === 'false') return false
  // Inline array: [a, b, 'c']
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map(stripQuotes)
      .filter((item) => item !== '')
  }
  return stripQuotes(value)
}

/**
 * Minimal YAML subset: `key: value`, inline arrays, and `- item` block lists.
 * Deliberately not a full YAML parser — a dependency for six keys is not worth
 * the bytes, and anything this cannot express does not belong in frontmatter.
 */
function parseFrontmatter(block: string): Record<string, ParsedValue> {
  const result: Record<string, ParsedValue> = {}
  const lines = block.split(/\r?\n/)
  let currentListKey: string | null = null

  for (const line of lines) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue

    const listItem = /^\s*-\s+(.*)$/.exec(line)
    if (listItem && currentListKey) {
      const list = result[currentListKey]
      if (Array.isArray(list)) list.push(stripQuotes(listItem[1]))
      continue
    }

    const pair = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line)
    if (!pair) continue

    const [, key, rawValue] = pair
    if (rawValue.trim() === '') {
      // A bare `key:` opens a block list on the following lines.
      result[key] = []
      currentListKey = key
      continue
    }

    result[key] = parseScalar(rawValue)
    currentListKey = null
  }

  return result
}

function asString(value: ParsedValue | undefined): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined
}

function asStringArray(value: ParsedValue | undefined): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value !== '') return [value]
  return []
}

function slugFromPath(path: string): string {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? path
}

function toPost(path: string, source: string): BlogPost | null {
  const slug = slugFromPath(path)
  const match = FRONTMATTER.exec(source)

  if (!match) {
    console.warn(`[blog] Skipping "${slug}": no frontmatter block found.`)
    return null
  }

  const fields = parseFrontmatter(match[1])
  const body = source.slice(match[0].length)

  const title = asString(fields.title)
  const description = asString(fields.description)
  const date = asString(fields.date)

  // Fail loudly in the console rather than rendering a card with holes in it.
  if (!title || !description || !date) {
    console.warn(`[blog] Skipping "${slug}": title, description and date are all required.`)
    return null
  }
  if (!ISO_DATE.test(date)) {
    console.warn(`[blog] Skipping "${slug}": date must be ISO format, e.g. 2026-08-22.`)
    return null
  }

  const frontmatter: BlogFrontmatter = {
    title,
    description,
    date,
    tags: asStringArray(fields.tags),
    cover: asString(fields.cover),
    // Absent `published` means published — opting *out* should be explicit.
    published: fields.published !== false,
    starter: fields.starter === true,
  }

  return {
    ...frontmatter,
    slug,
    html: renderMarkdown(body),
    readingMinutes: readingMinutes(body),
  }
}

/** Newest first; ties broken alphabetically so ordering is deterministic. */
function byNewest(a: BlogPost, b: BlogPost): number {
  return b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
}

const allParsed = Object.entries(modules)
  .map(([path, source]) => toPost(path, source))
  .filter((post): post is BlogPost => post !== null)

/** Everything visible on the site. Drafts are excluded here, once. */
export const posts: BlogPost[] = allParsed.filter((post) => post.published).sort(byNewest)

export const POST_COUNT = posts.length

export const postTags: string[] = Array.from(new Set(posts.flatMap((post) => post.tags))).sort(
  (a, b) => a.localeCompare(b),
)

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug)
}

export function postsWithTag(tag: string): BlogPost[] {
  return posts.filter((post) => post.tags.includes(tag))
}
