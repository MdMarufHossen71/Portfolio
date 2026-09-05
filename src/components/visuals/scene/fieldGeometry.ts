import { FIELD } from '../../../lib/waveField'

/**
 * Flat grid geometry for the hero field.
 *
 * Both builders lay vertices out on the y = 0 plane and let the vertex shader
 * lift them — the CPU never touches a height. That means animating the surface
 * costs no buffer uploads at all, and the same two buffers serve every frame.
 *
 * `segments` counts cells per axis, so a value of 8 produces a 9 × 9 lattice.
 */

/** One vertex per lattice intersection, for the point cloud. */
export function gridPointPositions(segments: number): Float32Array {
  const side = segments + 1
  const positions = new Float32Array(side * side * 3)
  const step = (FIELD.extent * 2) / segments

  let i = 0
  for (let row = 0; row < side; row += 1) {
    for (let column = 0; column < side; column += 1) {
      positions[i] = -FIELD.extent + column * step
      positions[i + 1] = 0
      positions[i + 2] = -FIELD.extent + row * step
      i += 3
    }
  }
  return positions
}

/**
 * Endpoint pairs for the contour lines.
 *
 * Lines run along one axis only. A full mesh grid draws twice as many segments
 * for a busier, more generic "wireframe" look; single-direction rows read as a
 * plotted surface, which is what the caption claims it is.
 */
export function gridLinePositions(segments: number): Float32Array {
  const side = segments + 1
  // segments spans per row, two endpoints each, three floats per endpoint.
  const positions = new Float32Array(side * segments * 2 * 3)
  const step = (FIELD.extent * 2) / segments

  let i = 0
  for (let row = 0; row < side; row += 1) {
    const z = -FIELD.extent + row * step
    for (let column = 0; column < segments; column += 1) {
      const x0 = -FIELD.extent + column * step
      positions[i] = x0
      positions[i + 1] = 0
      positions[i + 2] = z
      positions[i + 3] = x0 + step
      positions[i + 4] = 0
      positions[i + 5] = z
      i += 6
    }
  }
  return positions
}
