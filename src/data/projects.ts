import { TOOLS_GAMES_LIVE_URL, TOOLS_GAMES_REPO_URL, TOOLS_GAMES_YEAR } from './external'
import type { Project } from '../types/content'

/**
 * Project catalogue.
 *
 * ─── HOW TO ADD A PROJECT ────────────────────────────────────────────────────
 * Copy one of the placeholder objects below and fill it in. Notes:
 *
 *   • `liveUrl`      — omit entirely if there is no live site. Never point it at
 *                      a URL that 404s; the card renders an honest pending state
 *                      when it is missing.
 *   • `liveUrlPending` — set true when a deployment is planned but not live yet.
 *   • `year`         — optional. Leave it out rather than guessing.
 *   • `accent`       — 'cyan' | 'violet' | 'blue'. Drives a generated gradient,
 *                      so no image file is needed.
 *   • `placeholder`  — set true while the entry is still a stub. Stubs are
 *                      visually marked as unfinished instead of pretending to be
 *                      real work.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  {
    id: 'tools-games',
    title: 'Tools & Games BD',
    summary:
      'A browser-based workbench that gathers everyday utilities, developer and data helpers, image, file and SEO tools, plus a mini-game catalogue, behind one searchable directory. Bilingual, themeable, and built so inputs stay in the visitor’s own browser with no account to create. The directory and data layer are complete; individual tools are still being filled in behind them.',
    role: 'Designer & builder',
    year: TOOLS_GAMES_YEAR,
    tech: ['React', 'TypeScript', 'Vite', 'Wouter', 'Tailwind CSS', 'Browser storage', 'File APIs'],
    repoUrl: TOOLS_GAMES_REPO_URL,
    // Verified serving on 2026-08-22. Kept in external.ts so every "live demo"
    // affordance on the site switches together if that ever changes.
    liveUrl: TOOLS_GAMES_LIVE_URL ?? undefined,
    liveUrlPending: TOOLS_GAMES_LIVE_URL === null,
    featured: true,
    accent: 'cyan',
    status: 'Open source · in progress',
  },

  // ── Placeholder: replace with a real project ────────────────────────────────
  // Everything below is a stub. Swap the copy for genuine details, set
  // `placeholder: false`, and add `repoUrl` / `liveUrl` only once they resolve.
  {
    id: 'placeholder-design',
    title: '[Add project title]',
    summary:
      '[Add project description — what the problem was, what you made, and what changed as a result. Two or three sentences is plenty.]',
    role: '[Add your role, e.g. Graphic designer]',
    tech: ['[Tool 1]', '[Tool 2]'],
    featured: false,
    accent: 'violet',
    placeholder: true,
  },
  {
    id: 'placeholder-marketing',
    title: '[Add project title]',
    summary:
      '[Add project description. Avoid metrics you cannot back up — describe the work itself instead.]',
    role: '[Add your role, e.g. Digital marketer]',
    tech: ['[Tool 1]', '[Tool 2]'],
    featured: false,
    accent: 'blue',
    placeholder: true,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

/** Unique tech tags across real (non-stub) projects, for the filter row. */
export const projectTechTags = Array.from(
  new Set(projects.filter((p) => !p.placeholder).flatMap((p) => p.tech)),
).sort((a, b) => a.localeCompare(b))
