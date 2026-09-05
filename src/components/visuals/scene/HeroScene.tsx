import { Canvas } from '@react-three/fiber'
import { useCallback, useState, useSyncExternalStore } from 'react'
import { useWideViewport } from '../../../lib/motion'
import { WaveField } from './WaveField'
import type { FieldColors } from './WaveField'

/**
 * The WebGL hero, loaded on demand.
 *
 * This module is the code-split boundary: `three` and `@react-three/fiber` are
 * only fetched by the browser once `HeroStage` decides the visitor should get the
 * animated version. Nothing here is imported from the main bundle, so a phone on
 * a slow connection — or anyone who has asked for reduced motion — never pays for
 * the engine.
 *
 * Default export on purpose: it is the target of a `React.lazy` call.
 */

const FALLBACK_COLORS: FieldColors = {
  low: '#2f6f66',
  high: '#ffd28a',
  line: '#f0b558',
  alpha: 0.9,
  additive: true,
}

function readFieldColors(): FieldColors {
  if (typeof document === 'undefined') return FALLBACK_COLORS
  const style = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback
  const alpha = Number.parseFloat(read('--c-field-alpha', ''))
  return {
    low: read('--c-field-low', FALLBACK_COLORS.low),
    high: read('--c-field-high', FALLBACK_COLORS.high),
    line: read('--c-field-line', FALLBACK_COLORS.line),
    alpha: Number.isFinite(alpha) ? alpha : FALLBACK_COLORS.alpha,
    additive: read('--c-field-blend', 'additive') !== 'normal',
  }
}

function sameColors(a: FieldColors, b: FieldColors): boolean {
  return (
    a.low === b.low &&
    a.high === b.high &&
    a.line === b.line &&
    a.alpha === b.alpha &&
    a.additive === b.additive
  )
}

/**
 * Cached snapshot so `getSnapshot` can return a stable object identity.
 *
 * `useSyncExternalStore` re-renders whenever the snapshot's identity changes, so
 * handing it a fresh object every call would loop forever.
 */
let colorCache = FALLBACK_COLORS

function fieldColorSnapshot(): FieldColors {
  const next = readFieldColors()
  if (!sameColors(colorCache, next)) colorCache = next
  return colorCache
}

/**
 * The theme lives on `<html data-theme>`, so the palette is observed rather than
 * passed down.
 *
 * Reading it through a `MutationObserver` avoids depending on effect ordering: a
 * hook that read `getComputedStyle` in its own effect would run *before* the
 * provider's effect had written the new attribute, and would see the old palette
 * for one frame.
 */
function useFieldColors(): FieldColors {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof document === 'undefined') return () => {}
    const observer = new MutationObserver(onStoreChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return useSyncExternalStore(subscribe, fieldColorSnapshot, () => colorCache)
}

/** Rough low-power check. Absent on Safari, so a missing value means "assume fine". */
function isLowCoreDevice(): boolean {
  const cores = typeof navigator === 'undefined' ? undefined : navigator.hardwareConcurrency
  return typeof cores === 'number' && cores > 0 && cores <= 4
}

export interface HeroSceneProps {
  /**
   * False when the hero has scrolled away or the tab is hidden. The render loop
   * stops entirely rather than throttling — an off-screen canvas should cost
   * nothing.
   */
  active: boolean
}

export default function HeroScene({ active }: HeroSceneProps) {
  const colors = useFieldColors()
  const wide = useWideViewport()
  const [probeActive, setProbeActive] = useState(false)

  // Two knobs, one decision: a narrow viewport or a modest CPU gets a coarser
  // lattice and a lower pixel-ratio ceiling. The scene is the same; it is just
  // sampled less finely, which is a degrade rather than a different experience.
  const modest = !wide || isLowCoreDevice()
  const pointSegments = modest ? 84 : 132
  const lineSegments = modest ? 26 : 40

  return (
    <div
      className="field-canvas"
      onPointerEnter={() => setProbeActive(true)}
      onPointerLeave={() => setProbeActive(false)}
      onPointerCancel={() => setProbeActive(false)}
    >
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, modest ? 1.25 : 1.75]}
        camera={{ position: [0, 2.35, 8.4], fov: 38, near: 0.1, far: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <WaveField
          pointSegments={pointSegments}
          lineSegments={lineSegments}
          colors={colors}
          probeActive={probeActive}
        />
      </Canvas>
    </div>
  )
}
