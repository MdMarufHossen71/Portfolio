import type { BrandMark } from '../../types/content'

interface BrandIconProps {
  mark: BrandMark | null
  /** Shown when no vetted brand mark exists, e.g. "in". */
  glyph?: string
  className?: string
}

/**
 * Brand mark for a social link.
 *
 * Two deliberate choices:
 *
 * 1. `fill="currentColor"`, not the brand's own hex. Marks sit in a row of muted
 *    icons that brighten on hover; twelve saturated brand colours would fight the
 *    page and several would fail contrast against the dark surface.
 *
 * 2. When `mark` is null we render a short text glyph instead of an icon. Some
 *    platforms have no freely-usable mark available (LinkedIn is the case here),
 *    and drawing one from memory produces a *nearly* right logo — which is worse
 *    than an honest two-letter badge.
 *
 * Always `aria-hidden`: the link around it carries the accessible name.
 */
export function BrandIcon({ mark, glyph, className = 'size-[18px]' }: BrandIconProps) {
  if (!mark) {
    return (
      <span
        aria-hidden="true"
        className={`grid place-items-center text-[0.6875rem] leading-none font-bold tracking-tight ${className}`}
      >
        {glyph ?? '·'}
      </span>
    )
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d={mark.path} />
    </svg>
  )
}
