import { site } from '../../config/site'

interface MonogramProps {
  /** Rendered size in pixels. */
  size?: number
  className?: string
}

/**
 * Monogram avatar.
 *
 * Stands in for a photograph deliberately: no personal photo has been provided or
 * approved for publication, and using one found elsewhere would not be ours to
 * publish. Drop a real image into `public/` and swap this component's usage when
 * one is approved — see CONTENT_TODO.md.
 *
 * `aria-hidden` because it sits beside the name in every place it appears;
 * announcing "MH" after "Md Maruf Hossen" is noise.
 */
export function Monogram({ size = 48, className = '' }: MonogramProps) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`font-display inline-grid shrink-0 place-items-center rounded-[28%] border border-[var(--c-line-strong)] bg-[linear-gradient(140deg,var(--c-accent),var(--c-accent-2))] font-bold tracking-tight text-[var(--c-on-accent)] shadow-[var(--sh-2)] ${className}`}
    >
      {site.monogram}
    </span>
  )
}
