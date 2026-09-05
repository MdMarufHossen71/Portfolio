/**
 * Skills / expertise, grouped for display.
 *
 * Every entry is traceable to something already in this repository — the
 * toolkit and capabilities in `data/profile.ts`, or the tech stacks in
 * `data/projects.ts`. Nothing here claims a tool the owner has not named.
 *
 * Deliberately no proficiency bars or percentages: a "92% Photoshop" badge is
 * a fabricated statistic. Grouping ("what I work in" vs "what I am learning")
 * says everything a visitor needs without inventing precision.
 */
export interface SkillGroup {
  id: string
  title: string
  blurb: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'design',
    title: 'Graphic design',
    blurb: 'Visual work for social posts, brand assets and educational content.',
    skills: [
      'Adobe Illustrator',
      'Canva',
      'Vector design',
      'Logo redrawing',
      'Typography & layout',
      'Brand & social visuals',
      'AI-assisted illustration',
    ],
  },
  {
    id: 'web',
    title: 'Web & digital',
    blurb: 'Fast static front-ends that deploy anywhere with no backend.',
    skills: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'Responsive layouts',
      'Accessible interfaces',
      'GitHub & static hosting',
      'SEO basics',
    ],
  },
  {
    id: 'marketing',
    title: 'Digital marketing',
    blurb: 'Clear messaging for pages and small brands, over volume.',
    skills: ['Content planning', 'Social copy', 'Page growth & engagement'],
  },
]

/** In-progress study, shared with `data/profile.ts` rather than duplicated. */
export { learning as currentlyLearning } from './profile'
