import { useEffect, useRef } from 'react'
import { useFinePointer, usePrefersReducedMotion } from './motion'

export interface TiltOptions {
  /** Maximum rotation on each axis, in degrees. */
  max?: number
  /** How far the card lifts toward the viewer, in pixels. */
  lift?: number
  /** Set false to opt an individual card out. */
  enabled?: boolean
}

/**
 * Pointer-driven 3D tilt, done entirely through CSS custom properties.
 *
 * The hook never writes a `transform`; it only updates `--rx`, `--ry` and
 * `--lift`, which the `.tilt` rule in `effects.css` composes into a single
 * transform. That keeps the visual definition in CSS where it can be overridden
 * or disabled by a media query, and keeps this file to pure arithmetic.
 *
 * Guards, in order:
 *   1. Off entirely under `prefers-reduced-motion`.
 *   2. Off for coarse pointers — no hover to follow on touch.
 *   3. Writes are batched into one `requestAnimationFrame` per frame, so a fast
 *      mouse cannot queue up hundreds of style recalculations.
 *   4. Nothing is *revealed* by tilting: it is decoration on top of content that
 *      is already fully readable at rest.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(options: TiltOptions = {}) {
  const { max = 7, lift = 10, enabled = true } = options
  const ref = useRef<T | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const finePointer = useFinePointer()

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || reducedMotion || !finePointer) return

    let frame = 0
    let nextX = 0
    let nextY = 0

    const apply = () => {
      frame = 0
      el.style.setProperty('--ry', `${(nextX * max).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${(-nextY * max).toFixed(2)}deg`)
      el.style.setProperty('--lift', `${lift}px`)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      // Normalised to -0.5 … 0.5 from the centre of the card.
      nextX = (event.clientX - rect.left) / rect.width - 0.5
      nextY = (event.clientY - rect.top) / rect.height - 0.5
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const reset = () => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--lift', '0px')
    }

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', reset)
    el.addEventListener('pointercancel', reset)
    // Keyboard users tabbing away should also settle the card.
    el.addEventListener('focusout', reset)

    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', reset)
      el.removeEventListener('pointercancel', reset)
      el.removeEventListener('focusout', reset)
      reset()
    }
  }, [enabled, finePointer, lift, max, reducedMotion])

  return ref
}
