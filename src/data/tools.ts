import {
  Braces,
  Calculator,
  Clock,
  Cpu,
  FileText,
  Globe,
  Image as ImageIcon,
  Palette,
  Shield,
  Sparkles,
  Type,
  Zap,
} from 'lucide-react'
import type { ToolCategory, ToolItem } from '../types/content'
import { SOURCE_TOOL_ENTRIES } from './external'

/**
 * Curated showcase of the external Tools & Games workbench.
 *
 * These are the twelve categories the source project organises its tools into —
 * verbatim, and exhaustive — plus a representative sample of individual tools.
 * The sample is NOT the full catalogue, and none of it is implemented here: every
 * affordance links out to the source project.
 *
 * `sourceCount` values were counted from the source project's own data file on
 * 2026-08-22 and total 283. They count catalogue ENTRIES — named, routed slots in
 * the information architecture — not finished features. The Tools page says as
 * much in plain words rather than implying 283 polished utilities.
 *
 * Every number the UI displays is derived from this file, so a figure on screen
 * cannot drift from the list underneath it.
 */
export const toolCategories: ToolCategory[] = [
  {
    id: 'text',
    name: 'Text & String',
    icon: Type,
    blurb: 'Counting, converting and reshaping text.',
    sourceCount: 44,
  },
  {
    id: 'crypto',
    name: 'Crypto & Security',
    icon: Shield,
    blurb: 'Hashing, encoding and token helpers.',
    sourceCount: 19,
  },
  {
    id: 'developer',
    name: 'Developer & Data',
    icon: Braces,
    blurb: 'Formatters, validators and minifiers.',
    sourceCount: 50,
  },
  {
    id: 'image',
    name: 'Image Studio',
    icon: ImageIcon,
    blurb: 'Resize, crop and compress images.',
    sourceCount: 45,
  },
  {
    id: 'color',
    name: 'Color Lab',
    icon: Palette,
    blurb: 'Pick colours and build gradients.',
    sourceCount: 17,
  },
  {
    id: 'calculators',
    name: 'Calculators',
    icon: Calculator,
    blurb: 'From scientific maths to everyday sums.',
    sourceCount: 27,
  },
  {
    id: 'datetime',
    name: 'Date & Time',
    icon: Clock,
    blurb: 'Timers, countdowns and date maths.',
    sourceCount: 11,
  },
  {
    id: 'generators',
    name: 'Random & Generators',
    icon: Sparkles,
    blurb: 'Codes, strings and QR generation.',
    sourceCount: 18,
  },
  {
    id: 'file',
    name: 'File & PDF',
    icon: FileText,
    blurb: 'Split and combine documents.',
    sourceCount: 17,
  },
  {
    id: 'seo',
    name: 'SEO & Web',
    icon: Globe,
    blurb: 'Helpers for pages and metadata.',
    sourceCount: 8,
  },
  {
    id: 'fun',
    name: 'Fun & Misc',
    icon: Zap,
    blurb: 'Small odds and ends.',
    sourceCount: 15,
  },
  {
    id: 'ai',
    name: 'AI Tools',
    icon: Cpu,
    blurb: 'Assisted writing, translation and code help.',
    sourceCount: 12,
  },
]

/**
 * Representative tools only — a sample chosen to show the range, not a complete
 * index. Some categories have no sample listed yet, and the UI says so plainly
 * rather than inventing entries to fill the grid.
 */
export const featuredTools: ToolItem[] = [
  { name: 'Word Counter', categoryId: 'text' },
  { name: 'Case Converter', categoryId: 'text' },
  { name: 'Base64 Text', categoryId: 'text' },
  { name: 'Markdown Editor', categoryId: 'text' },

  { name: 'JSON Formatter Validator', categoryId: 'developer' },
  { name: 'JSON Minifier', categoryId: 'developer' },
  { name: 'Regex Tester', categoryId: 'developer' },
  { name: 'HTML Minifier', categoryId: 'developer' },
  { name: 'CSS Minifier', categoryId: 'developer' },
  { name: 'JS Minifier', categoryId: 'developer' },

  { name: 'Image Resize', categoryId: 'image' },
  { name: 'Image Crop', categoryId: 'image' },
  { name: 'Image Compressor', categoryId: 'image' },

  { name: 'Color Picker', categoryId: 'color' },
  { name: 'Gradient Generator', categoryId: 'color' },

  { name: 'Scientific Calculator', categoryId: 'calculators' },
  { name: 'BMI Calculator', categoryId: 'calculators' },

  { name: 'Age Calculator', categoryId: 'datetime' },
  { name: 'Countdown Timer', categoryId: 'datetime' },
  { name: 'Pomodoro Timer', categoryId: 'datetime' },

  { name: 'QR Code Generator', categoryId: 'generators' },
  { name: 'Random String Generator', categoryId: 'generators' },

  { name: 'PDF Merge', categoryId: 'file' },
  { name: 'PDF Split', categoryId: 'file' },

  { name: 'AI Summarizer', categoryId: 'ai' },
  { name: 'AI Translator', categoryId: 'ai' },
  { name: 'AI Code Helper', categoryId: 'ai' },
]

/** Derived, never hardcoded in copy. */
export const TOOL_CATEGORY_COUNT = toolCategories.length
export const FEATURED_TOOL_COUNT = featuredTools.length

/**
 * Sum of the per-category counts. This is the figure the UI shows — always the
 * derived one, so a number on screen cannot disagree with the list above it.
 *
 * `SOURCE_TOOL_ENTRIES` in `external.ts` is an independently recorded total for
 * the same source project. If the two drift apart, one of them was edited without
 * re-counting; the warning below says so during development rather than leaving a
 * silent inconsistency between two files that are supposed to describe one thing.
 */
export const TOOL_ENTRY_TOTAL = toolCategories.reduce((sum, c) => sum + c.sourceCount, 0)
export const TOOL_COUNTS_AGREE = TOOL_ENTRY_TOTAL === SOURCE_TOOL_ENTRIES

if (import.meta.env.DEV && !TOOL_COUNTS_AGREE) {
  console.warn(
    `[tools] Category counts sum to ${TOOL_ENTRY_TOTAL}, but external.ts records ` +
      `${SOURCE_TOOL_ENTRIES}. Re-count against the source project and update both. ` +
      `The UI is showing ${TOOL_ENTRY_TOTAL}.`,
  )
}

export function toolsInCategory(categoryId: string): ToolItem[] {
  return featuredTools.filter((t) => t.categoryId === categoryId)
}

export function categoryName(categoryId: string): string {
  return toolCategories.find((c) => c.id === categoryId)?.name ?? categoryId
}
