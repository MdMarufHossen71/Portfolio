import { FIELD, fieldFade, fieldHeight } from '../../lib/waveField'

/**
 * Static stand-in for the WebGL hero.
 *
 * Not a grey box and not a screenshot: this plots the *same* function as the
 * shader, at t = 0, through the same camera. It is what a visitor sees while the
 * 3D chunk downloads, if WebGL is unavailable, and — importantly — instead of the
 * animation when they have asked the OS to reduce motion. Reduced motion should
 * mean a still frame of the real thing, not a downgrade to nothing.
 *
 * Drawn as contour rows rather than a full mesh so it reads as a plotted surface.
 * Colours come from the `--c-field-*` tokens, so it re-tints with the theme.
 */

const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 620

/**
 * Camera, matched to `HeroScene`: same eye position and same vertical field of
 * view, so the poster and the live scene frame the surface identically and the
 * swap between them is not a jump.
 */
const EYE_HEIGHT = 2.35
const EYE_DISTANCE = 8.4
const FOV_DEGREES = 38
/** Vertical offset applied to the group in the live scene. */
const GROUP_Y = -0.35

const PITCH = Math.atan2(EYE_HEIGHT, EYE_DISTANCE)
const SIN_PITCH = Math.sin(PITCH)
const COS_PITCH = Math.cos(PITCH)
const FOCAL = 1 / Math.tan((FOV_DEGREES / 2) * (Math.PI / 180))
const ASPECT = VIEW_WIDTH / VIEW_HEIGHT

const ROWS = 22
const SAMPLES = 46

/** World point to viewBox coordinates, through a pinhole camera. */
function project(x: number, height: number, z: number): [number, number] | null {
  const vx = x
  const vy = height + GROUP_Y - EYE_HEIGHT
  const vz = z - EYE_DISTANCE

  // Camera basis: pitched down by PITCH, so up = (0, cos, sin) and the camera's
  // own +z (behind it) = (0, sin, cos).
  const yView = vy * COS_PITCH + vz * SIN_PITCH
  const zView = vy * SIN_PITCH + vz * COS_PITCH
  if (zView > -0.05) return null // behind the camera

  const depth = -zView
  const ndcX = (FOCAL * vx) / depth / ASPECT
  const ndcY = (FOCAL * yView) / depth

  return [VIEW_WIDTH / 2 + ndcX * (VIEW_WIDTH / 2), VIEW_HEIGHT / 2 - ndcY * (VIEW_HEIGHT / 2)]
}

/** One polyline per constant-z row, with the row's own opacity from the fade. */
function buildRows() {
  const rows: { points: string; opacity: number }[] = []
  const step = (FIELD.extent * 2) / (ROWS - 1)
  const sampleStep = (FIELD.extent * 2) / (SAMPLES - 1)

  for (let row = 0; row < ROWS; row += 1) {
    const z = -FIELD.extent + row * step
    const opacity = fieldFade(0, z)
    if (opacity < 0.03) continue

    const parts: string[] = []
    for (let sample = 0; sample < SAMPLES; sample += 1) {
      const x = -FIELD.extent + sample * sampleStep
      const projected = project(x, fieldHeight(x, z), z)
      if (!projected) continue
      parts.push(`${projected[0].toFixed(1)},${projected[1].toFixed(1)}`)
    }
    if (parts.length > 1) rows.push({ points: parts.join(' '), opacity })
  }
  return rows
}

// Computed once at module load: the geometry never changes.
const ROWS_DATA = buildRows()

export function HeroPoster() {
  return (
    <svg
      className="field-poster"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="field-poster-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        {/* Mirrors the shader's radial fade so the plane has no hard edge. */}
        <radialGradient id="field-poster-fade" cx="50%" cy="62%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="field-poster-mask">
          <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="url(#field-poster-fade)" />
        </mask>

        <g id="field-poster-mesh" fill="none" strokeWidth="1.4" strokeLinecap="round">
          {ROWS_DATA.map((row) => (
            <polyline
              key={row.points.slice(0, 24)}
              points={row.points}
              stroke="var(--c-field-line)"
              strokeOpacity={(row.opacity * 0.5).toFixed(3)}
            />
          ))}
        </g>
      </defs>

      <g mask="url(#field-poster-mask)">
        {/* Same paths twice via <use>: one blurred for bloom, one crisp. */}
        <use href="#field-poster-mesh" filter="url(#field-poster-glow)" opacity="0.85" />
        <use href="#field-poster-mesh" />
      </g>
    </svg>
  )
}
