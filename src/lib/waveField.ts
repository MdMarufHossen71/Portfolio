/**
 * The hero's function.
 *
 * The 3D hero is not a stock floating blob — it plots a real, named surface: a
 * damped radial wave with a Gaussian probe that follows the pointer. That choice
 * is deliberate. The site belongs to a first-year Mathematics student who says he
 * explores generative art, so the signature moment is a plotted function rather
 * than a decorative object that would suit any brief.
 *
 *   z(x, y, t) = A·sin(k·r − ω·t)·exp(−λ·r) + P·exp(−τ·d²)
 *   r = ‖(x, y)‖            d = ‖(x, y) − p‖        p = pointer
 *
 * Every number below is used in three places — the GLSL that displaces the
 * vertices, the TypeScript twin that draws the static poster, and the caption
 * printed beside the canvas. All three read these constants, so the equation on
 * screen is the equation being drawn. Change a value here and the caption changes
 * with the geometry; there is no separate string to forget.
 *
 * The formula itself is written out twice (once in GLSL, once in TypeScript)
 * because a shader and a poster cannot share code. Keep them in step — the poster
 * is what reduced-motion visitors see instead of the animation, and it should be
 * the same surface.
 */

export const FIELD = {
  /** Half-width of the plotted plane, in world units. */
  extent: 6.5,
  /** A — wave height. */
  amplitude: 0.62,
  /** k — spatial frequency: how tightly the ripples are packed. */
  waveNumber: 1.15,
  /** ω — angular speed. Low on purpose; fast motion reads as cheap. */
  angularSpeed: 0.85,
  /** λ — radial damping, so the ripples die away from the origin. */
  damping: 0.16,
  /** P — height of the bump under the pointer. */
  probeAmplitude: 0.85,
  /** τ — how tightly that bump is focused. */
  probeTightness: 1.25,
  /** Radius where the plot starts fading out, so the plane has no hard edge. */
  fadeInner: 3.2,
  /** Radius where it has faded completely. */
  fadeOuter: 6.4,
} as const

/**
 * The site's one light source, as a direction vector: up, from the left, slightly
 * toward the camera. This is the same top-left warm light every CSS shadow in
 * `tokens.css` obeys — the field is lit by it rather than shaded by height, which
 * is what keeps the 3D consistent with the flat surfaces around it.
 */
export const LIGHT_DIRECTION = [-0.55, 0.78, 0.32] as const

/** GLSL needs `0.62`, never `1` — a bare integer is an int and will not compile. */
const g = (value: number) => value.toFixed(3)

/**
 * Shared shader chunk: the surface, plus its normal by central difference.
 *
 * The normal is what lets the field obey the site's single light source instead
 * of faking depth with a height gradient. Four extra evaluations per vertex is
 * cheap next to the fill cost of the points themselves.
 */
export const FIELD_GLSL = /* glsl */ `
const vec3 FIELD_LIGHT = normalize(vec3(${g(LIGHT_DIRECTION[0])}, ${g(LIGHT_DIRECTION[1])}, ${g(LIGHT_DIRECTION[2])}));

float fieldHeight(vec2 q, float t, vec2 probePoint, float probeAmount) {
  float r = length(q);
  float wave = ${g(FIELD.amplitude)} * sin(${g(FIELD.waveNumber)} * r - ${g(FIELD.angularSpeed)} * t)
             * exp(-${g(FIELD.damping)} * r);
  float d = length(q - probePoint);
  float probe = ${g(FIELD.probeAmplitude)} * exp(-${g(FIELD.probeTightness)} * d * d) * probeAmount;
  return wave + probe;
}

vec3 fieldNormal(vec2 q, float t, vec2 probePoint, float probeAmount) {
  float e = 0.055;
  float hx0 = fieldHeight(q - vec2(e, 0.0), t, probePoint, probeAmount);
  float hx1 = fieldHeight(q + vec2(e, 0.0), t, probePoint, probeAmount);
  float hy0 = fieldHeight(q - vec2(0.0, e), t, probePoint, probeAmount);
  float hy1 = fieldHeight(q + vec2(0.0, e), t, probePoint, probeAmount);
  return normalize(vec3(hx0 - hx1, 2.0 * e, hy0 - hy1));
}

float fieldFade(vec2 q) {
  return 1.0 - smoothstep(${g(FIELD.fadeInner)}, ${g(FIELD.fadeOuter)}, length(q));
}
`

/**
 * TypeScript twin of `fieldHeight`, for the static poster.
 *
 * Same constants, same formula. No pointer term: the poster is a still frame and
 * there is no pointer to follow.
 */
export function fieldHeight(x: number, y: number, t = 0): number {
  const r = Math.hypot(x, y)
  return (
    FIELD.amplitude *
    Math.sin(FIELD.waveNumber * r - FIELD.angularSpeed * t) *
    Math.exp(-FIELD.damping * r)
  )
}

/** Matches `fieldFade` in the shader: smoothstep between the two radii. */
export function fieldFade(x: number, y: number): number {
  const r = Math.hypot(x, y)
  const t = Math.min(Math.max((r - FIELD.fadeInner) / (FIELD.fadeOuter - FIELD.fadeInner), 0), 1)
  return 1 - t * t * (3 - 2 * t)
}

/** Trims a trailing zero so the caption reads `0.62`, not `0.620`. */
const c = (value: number) => String(value)

/**
 * The caption printed beside the canvas, built from the constants above.
 *
 * Hidden from screen readers (see `HeroStage`): read aloud, this is symbol soup.
 * An honest plain-language description is exposed instead.
 */
export const FIELD_EQUATION_LINES = [
  `z = ${c(FIELD.amplitude)} sin(${c(FIELD.waveNumber)}r − ${c(FIELD.angularSpeed)}t) exp(−${c(FIELD.damping)}r)`,
  `    + ${c(FIELD.probeAmplitude)} exp(−${c(FIELD.probeTightness)}d²)`,
  `r = ‖(x, y)‖      d = ‖(x, y) − p‖`,
] as const

/** Short label for the caption. `p` is the only symbol a reader cannot infer. */
export const FIELD_EQUATION_NOTE = 'damped radial wave · p = pointer'
