import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  Color,
  Group,
  NormalBlending,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from 'three'
import { FIELD_GLSL } from '../../../lib/waveField'
import { gridLinePositions, gridPointPositions } from './fieldGeometry'

/**
 * The plotted field: a point cloud and a set of contour lines over the same
 * surface.
 *
 * Both share one displacement function, injected from `waveField.ts`, so there is
 * exactly one definition of the shape on screen. The CPU uploads two flat buffers
 * once and never touches them again — every frame is a uniform update, which is
 * why this stays cheap enough to run on a phone.
 *
 * Colours arrive as CSS strings read off the document, not as literals, so the
 * theme toggle re-tints the WebGL exactly like it re-tints everything else.
 */

const VERTEX = /* glsl */ `
uniform float uTime;
uniform vec2 uProbePoint;
uniform float uProbeAmount;
uniform float uSize;
uniform float uPixelRatio;

varying float vFade;
varying float vLight;
varying float vHeight;

${FIELD_GLSL}

void main() {
  vec2 q = vec2(position.x, position.z);
  float h = fieldHeight(q, uTime, uProbePoint, uProbeAmount);

  // `normal` is already declared as an attribute by three's shader prefix, so the
  // local gets its own name rather than shadowing it.
  vec3 surfaceNormal = fieldNormal(q, uTime, uProbePoint, uProbeAmount);
  vLight = clamp(dot(surfaceNormal, FIELD_LIGHT), 0.0, 1.0);
  vFade = fieldFade(q);
  vHeight = h;

  vec4 viewPosition = modelViewMatrix * vec4(q.x, h, q.y, 1.0);
  gl_Position = projectionMatrix * viewPosition;

  // Perspective-correct point size: nearer points read larger, so the cloud has
  // real depth instead of looking like a flat sprite sheet.
  gl_PointSize = uSize * uPixelRatio * (7.0 / max(-viewPosition.z, 0.001));
}
`

const POINT_FRAGMENT = /* glsl */ `
uniform vec3 uLow;
uniform vec3 uHigh;
uniform float uAlpha;

varying float vFade;
varying float vLight;
varying float vHeight;

void main() {
  // Round off the square point sprite, with a soft edge so nothing aliases.
  float dist = length(gl_PointCoord - 0.5);
  if (dist > 0.5) discard;
  float soft = 1.0 - smoothstep(0.12, 0.5, dist);

  float lit = 0.28 + 0.72 * vLight;
  vec3 tint = mix(uLow, uHigh, clamp(vHeight * 0.75 + 0.42, 0.0, 1.0));

  gl_FragColor = vec4(tint * lit, soft * vFade * uAlpha);
  #include <colorspace_fragment>
}
`

const LINE_FRAGMENT = /* glsl */ `
uniform vec3 uLine;
uniform float uAlpha;

varying float vFade;
varying float vLight;
varying float vHeight;

void main() {
  float lit = 0.16 + 0.84 * vLight;
  gl_FragColor = vec4(uLine, vFade * uAlpha * lit * 0.42);
  #include <colorspace_fragment>
}
`

export interface FieldColors {
  low: string
  high: string
  line: string
  alpha: number
  /**
   * Additive blending makes the field glow on ink; on the light theme it would
   * wash out to white, so that palette composites normally instead. Set per theme
   * by the `--c-field-blend` token.
   */
  additive: boolean
}

export interface WaveFieldProps {
  /** Cells per axis for the point cloud. Lower on small or low-power devices. */
  pointSegments: number
  /** Cells per axis for the contour lines. */
  lineSegments: number
  colors: FieldColors
  /** True while the pointer is over the canvas, which raises the probe bump. */
  probeActive: boolean
}

export function WaveField({ pointSegments, lineSegments, colors, probeActive }: WaveFieldProps) {
  const groupRef = useRef<Group>(null)
  const camera = useThree((state) => state.camera)
  const pointer = useThree((state) => state.pointer)
  const gl = useThree((state) => state.gl)

  const pointPositions = useMemo(() => gridPointPositions(pointSegments), [pointSegments])
  const linePositions = useMemo(() => gridLinePositions(lineSegments), [lineSegments])

  // One uniforms object, shared by both materials: the surface must be identical
  // in the points and the lines, and sharing the uniforms makes that structural.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProbePoint: { value: new Vector2(0, 0) },
      uProbeAmount: { value: 0 },
      uSize: { value: 2.6 },
      uPixelRatio: { value: 1 },
      uLow: { value: new Color('#ffffff') },
      uHigh: { value: new Color('#ffffff') },
      uLine: { value: new Color('#ffffff') },
      uAlpha: { value: 1 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uLow.value.set(colors.low)
    uniforms.uHigh.value.set(colors.high)
    uniforms.uLine.value.set(colors.line)
    uniforms.uAlpha.value = colors.alpha
  }, [colors, uniforms])

  // Reused across frames — allocating a Raycaster per frame would churn the GC.
  const probe = useMemo(
    () => ({
      raycaster: new Raycaster(),
      plane: new Plane(new Vector3(0, 1, 0), 0),
      hit: new Vector3(),
    }),
    [],
  )

  useFrame((state, delta) => {
    // Cap the step so a backgrounded tab returning to focus cannot jump the
    // easing to its target in one frame.
    const step = Math.min(delta, 1 / 30)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPixelRatio.value = gl.getPixelRatio()

    const target = probeActive ? 1 : 0
    uniforms.uProbeAmount.value += (target - uniforms.uProbeAmount.value) * Math.min(1, step * 5)

    // Where the pointer actually meets the y = 0 plane, so the bump sits under
    // the cursor rather than at a guessed screen-space offset.
    if (uniforms.uProbeAmount.value > 0.002) {
      probe.raycaster.setFromCamera(pointer, camera)
      if (probe.raycaster.ray.intersectPlane(probe.plane, probe.hit)) {
        const to = uniforms.uProbePoint.value
        to.x += (probe.hit.x - to.x) * Math.min(1, step * 8)
        to.y += (probe.hit.z - to.y) * Math.min(1, step * 8)
      }
    }

    const group = groupRef.current
    if (group) {
      // Slow sway plus a little pointer parallax. Deliberately small: the field
      // should feel like it has mass, not like it is spinning for attention.
      const t = state.clock.elapsedTime
      group.rotation.y = 0.055 * Math.sin(t * 0.11) + pointer.x * 0.05
      group.rotation.x = 0.02 * Math.sin(t * 0.09) - pointer.y * 0.02
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      {/* Displacement happens in the shader, so the CPU-side bounding box is a
          flat plane and frustum culling would be wrong at the edges. */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX}
          fragmentShader={LINE_FRAGMENT}
          transparent
          depthWrite={false}
          blending={colors.additive ? AdditiveBlending : NormalBlending}
        />
      </lineSegments>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX}
          fragmentShader={POINT_FRAGMENT}
          transparent
          depthWrite={false}
          blending={colors.additive ? AdditiveBlending : NormalBlending}
        />
      </points>
    </group>
  )
}
