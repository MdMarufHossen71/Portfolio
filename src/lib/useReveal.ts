import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './motion'

/**
 * Scroll reveal.
 *
 * One shared `IntersectionObserver` for the whole page rather than one per card —
 * hundreds of cards would otherwise mean hundreds of observers. Elements register
 * on mount and unregister on unmount.
 *
 * Content is never hidden from assistive technology or from users who never
 * scroll: `.reveal` only shifts opacity and offset, and the global
 * `prefers-reduced-motion` rule in `effects.css` neutralises it. Under reduced
 * motion this hook also marks elements visible immediately without observing
 * anything, so nothing can get stuck invisible.
 */

const VISIBLE_CLASS = 'is-in'

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add(VISIBLE_CLASS)
        // Reveal is one-way: once seen, stop watching.
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  )
  return observer
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(enabled = true) {
  const ref = useRef<T | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!enabled || reducedMotion) {
      el.classList.add(VISIBLE_CLASS)
      return
    }

    const io = getObserver()
    if (!io) {
      // No IntersectionObserver (very old browser): show everything.
      el.classList.add(VISIBLE_CLASS)
      return
    }

    io.observe(el)
    return () => io.unobserve(el)
  }, [enabled, reducedMotion])

  return ref
}
