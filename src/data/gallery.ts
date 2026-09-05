import type { AccentKey, GalleryItem } from '../types/content'

/**
 * Design showcase.
 *
 * ─── HONEST PLACEHOLDERS ───────────────────────────────────────────────────
 * No finished artwork files have been supplied, so these entries hold the
 * *shape* of the gallery — categories, tools, layout — with generated gradient
 * tiles instead of images. Each is flagged `placeholder: true` and the UI marks
 * it as awaiting artwork rather than presenting it as finished work.
 *
 * To publish a piece: add the file to `public/gallery/` (landscape or square,
 * WebP or JPEG, width ≤ 1600px), set `imageSrc` to `/gallery/<file>`,
 * describe it in one line, and drop `placeholder`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const galleryItems: GalleryItem[] = [
  {
    id: 'brand-mark-study',
    title: 'Brand mark study',
    description: 'Sample slot — a logo or monogram piece will be shown here.',
    category: 'Logo & brand',
    tools: ['Adobe Illustrator'],
    accent: 'cyan',
    placeholder: true,
  },
  {
    id: 'social-campaign-set',
    title: 'Social campaign set',
    description: 'Sample slot — a coordinated set of social posts will be shown here.',
    category: 'Social media',
    tools: ['Canva', 'Adobe Illustrator'],
    accent: 'violet',
    placeholder: true,
  },
  {
    id: 'vector-illustration',
    title: 'Vector illustration',
    description: 'Sample slot — a finished illustration will be shown here.',
    category: 'Illustration',
    tools: ['Adobe Illustrator'],
    accent: 'blue',
    placeholder: true,
  },
  {
    id: 'typographic-poster',
    title: 'Typographic poster',
    description: 'Sample slot — an educational or poster layout will be shown here.',
    category: 'Typography',
    tools: ['Adobe Illustrator', 'Canva'],
    accent: 'cyan',
    placeholder: true,
  },
  {
    id: 'raster-to-vector-sample',
    title: 'Raster to vector rebuild',
    description: 'Sample slot — a before/after rebuild will be shown here.',
    category: 'Vector rebuild',
    tools: ['Adobe Illustrator'],
    accent: 'violet',
    placeholder: true,
  },
  {
    id: 'web-visual',
    title: 'Web visual',
    description: 'Sample slot — interface or site artwork will be shown here.',
    category: 'Web',
    tools: ['Canva'],
    accent: 'blue',
    placeholder: true,
  },
]

/** Category filter order, derived from the items so it cannot go stale. */
export const galleryCategories: string[] = Array.from(
  new Set(galleryItems.map((item) => item.category)),
).sort((a, b) => a.localeCompare(b))

export const GALLERY_COUNT = galleryItems.length

const ACCENT_CYCLE: AccentKey[] = ['cyan', 'violet', 'blue']

export function galleryAccent(item: GalleryItem, index: number): AccentKey {
  return item.accent ?? ACCENT_CYCLE[index % ACCENT_CYCLE.length]
}
