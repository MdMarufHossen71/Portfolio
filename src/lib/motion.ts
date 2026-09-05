import { useCallback, useSyncExternalStore } from 'react'

/**
 * Motion policy helpers.
 *
 * The rule across this site: depth is always visible, movement is optional.
 * Gradients, layered shadows and perspective stay put under reduced motion —
 * they carry no animation. Anything that actually moves is gated behind these
 * hooks *and* behind the global `prefers-reduced-motion` block in `base.css`, so
 * a missed check in a component still fails safe.
 */

/**
 * `matchMedia` as an external store.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: a media query *is*
 * an external store, and reading it through the store API means the first render
 * already has the real value — no state update on mount, and therefore no flash of
 * the fallback for anyone who has asked the OS to reduce motion.
 *
 * The snapshot is a boolean, so referential stability is not a concern.
 */
function useMediaQuery(query: string, fallback: boolean): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onStoreChange)
      return () => list.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return fallback
    return window.matchMedia(query).matches
  }, [fallback, query])

  return useSyncExternalStore(subscribe, getSnapshot, () => fallback)
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', false)
}

/**
 * True only for precise pointers (mouse, trackpad, stylus).
 *
 * Pointer-driven tilt is meaningless on touch — there is no hover state to
 * follow, and reacting to taps would make cards feel unstable while scrolling.
 */
export function useFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)', false)
}

/**
 * True from the `md` breakpoint up.
 *
 * Used to pick a quality tier for the WebGL hero rather than to lay anything
 * out — layout stays in CSS, where it belongs. The pixel value matches Tailwind's
 * `md`, so the scene steps up at the same width the grid does.
 */
export function useWideViewport(): boolean {
  return useMediaQuery('(min-width: 768px)', true)
}

/**
 * True when the tab is visible.
 *
 * A hidden tab still runs `requestAnimationFrame` in some browsers, and a WebGL
 * loop that keeps drawing to a tab nobody is looking at is pure battery cost.
 */
export function usePageVisible(): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof document === 'undefined') return () => {}
    document.addEventListener('visibilitychange', onStoreChange)
    return () => document.removeEventListener('visibilitychange', onStoreChange)
  }, [])

  const getSnapshot = useCallback(() => {
    if (typeof document === 'undefined') return true
    return document.visibilityState !== 'hidden'
  }, [])

  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}
