import { GraduationCap, Palette, PenTool, Sparkles, Users, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Biography and background.
 *
 * Everything here is drawn from facts the site owner supplied. Nothing is
 * inflated: he is early-career (roughly six months freelancing), and the copy is
 * written to read that way rather than implying seniority.
 */

/** Primary bio, used on About and (trimmed) on the home page. */
export const bio =
  "I'm Md Maruf Hossen, a first-year Mathematics student, freelance graphic designer, and digital marketer from Gazipur, Bangladesh. I build things for the web, design visuals, and explore AI tools and generative art in my free time."

/** Shorter variant for the hero, where space is tight. */
export const bioShort =
  'A first-year Mathematics student who designs visuals, runs digital marketing, and builds for the web — currently exploring AI tools and generative art.'

export interface BackgroundItem {
  id: string
  label: string
  value: string
  detail?: string
  icon: LucideIcon
}

export const background: BackgroundItem[] = [
  {
    id: 'study',
    label: 'Studying',
    value: 'BSc (Honors) Mathematics, first year',
    detail:
      'Bhawal Badre Alom Govt. College (BBAGC), Gazipur — under National University of Bangladesh',
    icon: GraduationCap,
  },
  {
    id: 'cr',
    label: 'Department role',
    value: 'Class Representative (CR)',
    icon: Users,
  },
  {
    id: 'ambassador',
    label: 'Ambassador',
    value: 'Campus Ambassador, NUSDF Bangladesh',
    icon: Sparkles,
  },
  {
    id: 'freelance',
    label: 'Freelancing',
    value: 'About 6 months',
    detail: 'Graphic design and digital marketing',
    icon: PenTool,
  },
  {
    id: 'certification',
    label: 'Certified',
    value: 'NSDA Level-3',
    detail: 'Digital Marketing, and Graphic Design for Freelancing',
    icon: Wrench,
  },
  {
    id: 'infohub',
    label: 'Side project',
    value: 'Info HUB',
    // Deliberately not a link: no verified URL has been provided. See CONTENT_TODO.md.
    detail: 'An educational page covering jobs, scholarships and study resources',
    icon: Palette,
  },
]

export interface Capability {
  id: string
  title: string
  description: string
  items: string[]
  icon: LucideIcon
}

export const capabilities: Capability[] = [
  {
    id: 'design',
    title: 'Graphic design',
    description:
      'Visual work for social posts, brand assets and educational content — built to stay readable at small sizes.',
    items: ['Brand & social visuals', 'Layout and typography', 'Illustration with AI assistance'],
    icon: Palette,
  },
  {
    id: 'marketing',
    title: 'Digital marketing',
    description:
      'Planning and running content for pages and small brands, with an emphasis on clear messaging over volume.',
    items: ['Content planning', 'Page growth & engagement', 'Copy for social platforms'],
    icon: Sparkles,
  },
  {
    id: 'web',
    title: 'Web building',
    description:
      'Static, fast front-ends with React and TypeScript — the kind that deploy anywhere and need no backend.',
    items: ['React + TypeScript', 'Responsive, accessible layouts', 'Static hosting & deployment'],
    icon: Wrench,
  },
]

/** Tools used regularly. Kept to software actually named by the owner. */
export const toolkit = ['Canva', 'Recraft', 'Gamma AI', 'Adobe Illustrator']

/** Current direction of study — framed as in-progress, not mastered. */
export const learning = [
  'React and TypeScript patterns for building maintainable interfaces',
  'Accessible, responsive layout without heavy frameworks',
  'Generative and algorithmic art, and where AI tooling genuinely helps',
]
