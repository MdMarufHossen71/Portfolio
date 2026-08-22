import type { LucideIcon } from 'lucide-react'

/**
 * Shared content models.
 *
 * Every section of the site reads from a typed data file rather than inlining
 * copy into JSX, so content can be edited without touching components.
 */

/**
 * A brand glyph, structurally compatible with a `simple-icons` export.
 *
 * Declared locally rather than importing simple-icons' own type so the data
 * layer keeps compiling if that package reshuffles its type exports.
 */
export interface BrandMark {
  title: string
  path: string
  hex: string
}

export type SocialGroup = 'primary' | 'more'

export interface SocialLink {
  id: string
  /** Human-readable platform name, used for the accessible label. */
  label: string
  url: string
  /** Displayed next to the label in the extended list. */
  handle: string
  /** Vetted brand mark, or null when none is available. */
  mark: BrandMark | null
  /**
   * Fallback shown when `mark` is null. A short in-house glyph beats drawing an
   * inaccurate brand logo from memory.
   */
  glyph?: string
  group: SocialGroup
}

export type AccentKey = 'cyan' | 'violet' | 'blue'

export interface Project {
  id: string
  title: string
  summary: string
  role: string
  /** Omit rather than guess — an unverified year is a fabricated fact. */
  year?: string
  tech: string[]
  /** Omit when there is no repository to link. */
  repoUrl?: string
  /** Omit when no live URL exists — the card then shows an honest pending state. */
  liveUrl?: string
  /** True when a live deployment is planned but not yet available. */
  liveUrlPending?: boolean
  featured: boolean
  /** Drives the generated gradient; no image assets required. */
  accent: AccentKey
  /** Optional short status line, e.g. "Actively maintained". */
  status?: string
  /** Set for entries the owner still needs to fill in. */
  placeholder?: boolean
}

export interface ToolCategory {
  id: string
  name: string
  icon: LucideIcon
  blurb: string
  /**
   * How many entries this category holds in the source project's catalogue.
   * Counts catalogue entries, not finished features — see `data/external.ts`.
   */
  sourceCount: number
}

export interface ToolItem {
  name: string
  categoryId: string
}

export type GameGenre =
  | 'Arcade'
  | 'Puzzle'
  | 'Shooter'
  | 'Runner'
  | 'Logic'
  | 'Memory'
  | 'Board'
  | 'Word'
  | 'Quiz'
  | 'Strategy'
  | 'Physics'
  | 'Maze'
  | 'Action'
  | 'Typing'

export interface Game {
  name: string
  /**
   * Editorial grouping applied here in the portfolio, not a field copied from
   * the source project.
   */
  genres: GameGenre[]
  featured?: boolean
  accent?: AccentKey
}

export interface BlogFrontmatter {
  title: string
  description: string
  /** ISO `YYYY-MM-DD`. */
  date: string
  tags: string[]
  cover?: string
  published: boolean
  /** Marks template/starter copy so it is never passed off as a personal account. */
  starter?: boolean
}

export interface BlogPost extends BlogFrontmatter {
  slug: string
  /** Rendered HTML from the markdown body. */
  html: string
  readingMinutes: number
}
