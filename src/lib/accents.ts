import type { AccentKey } from '../types/content'

/**
 * Accent mapping.
 *
 * Cards get their colour from a token, never a hardcoded hex, so both themes stay
 * correct from one definition — the light palette darkens these accents for
 * contrast and every card follows automatically.
 *
 * Gradients also mean zero image requests: card artwork is generated in CSS.
 */

export const ACCENT_VAR: Record<AccentKey, string> = {
  cyan: 'var(--c-accent)',
  violet: 'var(--c-accent-2)',
  blue: 'var(--c-accent-3)',
}

export const ACCENT_GRADIENT: Record<AccentKey, string> = {
  cyan: 'linear-gradient(135deg, var(--c-accent), var(--c-accent-3))',
  violet: 'linear-gradient(135deg, var(--c-accent-2), var(--c-accent))',
  blue: 'linear-gradient(135deg, var(--c-accent-3), var(--c-accent-2))',
}

/** Very low-alpha wash for card backgrounds. */
export function accentWash(accent: AccentKey): string {
  return `color-mix(in oklab, ${ACCENT_VAR[accent]} 12%, transparent)`
}
