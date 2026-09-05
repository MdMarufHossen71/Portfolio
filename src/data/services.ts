import { Brush, Globe, PenTool, ScanLine, Shapes, Share2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Services on offer.
 *
 * Each one maps to work the site already describes: vector and logo work to the
 * Illustrator-based design practice in `data/profile.ts`, social and
 * illustration work to the capabilities there, and basic web design to the
 * static React + TypeScript builds in `data/projects.ts`. Copy stays concrete —
 * what the client hands over and what they get back — instead of agency prose.
 */
export interface Service {
  id: string
  title: string
  description: string
  /** What the client provides, so the offer reads as actionable. */
  input: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    id: 'vector-tracing',
    title: 'Vector tracing',
    description:
      'Hand-drawn sketches, low-resolution graphics or rough drafts redrawn as clean, scalable vector artwork.',
    input: 'You send a sketch or image — you get an SVG / AI / EPS file.',
    icon: PenTool,
  },
  {
    id: 'raster-to-vector',
    title: 'Raster to vector conversion',
    description:
      'Pixelated logos and graphics rebuilt as sharp vectors that stay crisp at any size, from favicon to billboard.',
    input: 'You send a JPG / PNG — you get print-ready vectors.',
    icon: ScanLine,
  },
  {
    id: 'logo-redrawing',
    title: 'Logo redrawing',
    description:
      'Existing logos carefully recreated and tidied up — same identity, cleaner geometry, usable source files.',
    input: 'You send the current logo — you get a rebuilt master file.',
    icon: Shapes,
  },
  {
    id: 'social-design',
    title: 'Social media design',
    description:
      'Posts, covers and page assets that stay readable at small sizes and consistent across platforms.',
    input: 'You share the message — you get platform-ready visuals.',
    icon: Share2,
  },
  {
    id: 'illustration',
    title: 'Illustration',
    description:
      'Simple illustrations and educational visuals, drawn with AI assistance and finished by hand.',
    input: 'You describe the idea — you get a finished illustration.',
    icon: Brush,
  },
  {
    id: 'web-design',
    title: 'Basic web design',
    description:
      'Fast, responsive single-page sites with React and TypeScript — no backend to maintain, deployable anywhere.',
    input: 'You share content and references — you get a live static site.',
    icon: Globe,
  },
]
