import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { usePageVisible, usePrefersReducedMotion } from '../../lib/motion'
import { FIELD_EQUATION_LINES, FIELD_EQUATION_NOTE } from '../../lib/waveField'
import { HeroPoster } from './HeroPoster'

/**
 * Decides what the hero visual actually is, and keeps the cost honest.
 *
 * The WebGL scene is a lazy chunk, so `three` and `@react-three/fiber` are never
 * in the main bundle. They are fetched only when all of these hold:
 *
 *   • the visitor has not asked the OS to reduce motion,
 *   • the browser can give us a WebGL context,
 *   • the scene has not already failed to load or initialise.
 *
 * Every other case renders `HeroPoster`, which plots the same function as a still
 * frame. So there is no state in which the hero is empty, and no state in which a
 * reduced-motion visitor is served an animation.
 *
 * The loop is also stopped — not throttled — whenever the hero scrolls out of
 * view or the tab is hidden.
 */

const HeroScene = lazy(() => import('./scene/HeroScene'))

/** Probed once and cached: creating a throwaway context per render is wasteful. */
let webglSupport: boolean | null = null

function supportsWebgl(): boolean {
  if (webglSupport !== null) return webglSupport
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    webglSupport = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    // Some hardened browsers throw rather than returning null.
    webglSupport = false
  }
  return webglSupport
}

interface SceneBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  onError: () => void
}

/**
 * Catches anything the 3D subtree throws — a failed chunk fetch, a context lost
 * on creation, a driver that rejects the shader — and hands the page back to the
 * poster. A hero that cannot render must never take the site down with it.
 */
class SceneBoundary extends Component<SceneBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** True while the element is at least partly on screen. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  // Starts true so the first paint does not wait a frame for the observer; the
  // observer corrects it immediately if the hero is in fact scrolled past.
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: '120px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}

export function HeroStage() {
  const reducedMotion = usePrefersReducedMotion()
  const pageVisible = usePageVisible()
  const { ref, inView } = useInView<HTMLDivElement>()
  const [sceneFailed, setSceneFailed] = useState(false)

  const animated = !reducedMotion && !sceneFailed && supportsWebgl()

  return (
    <div ref={ref} className="hero__stage">
      {/* Warm bloom on the horizon, from the same top-left light as every shadow
          on the site. CSS rather than a second WebGL pass. */}
      <div className="hero__horizon" aria-hidden="true" />

      {animated ? (
        <SceneBoundary fallback={<HeroPoster />} onError={() => setSceneFailed(true)}>
          <Suspense fallback={<HeroPoster />}>
            <HeroScene active={inView && pageVisible} />
          </Suspense>
        </SceneBoundary>
      ) : (
        <HeroPoster />
      )}

      <figure className="hero__equation">
        <pre aria-hidden="true">
          {FIELD_EQUATION_LINES.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </pre>
        {/* The symbols above are hidden from screen readers on purpose — read
            aloud they are noise. This is the honest description instead. */}
        <figcaption>
          <span aria-hidden="true">{FIELD_EQUATION_NOTE}</span>
          <span className="sr-only">
            Decorative background: a lattice of points plotting a damped radial wave, the equation
            shown alongside it. Moving the pointer across it raises a bump under the cursor.
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
