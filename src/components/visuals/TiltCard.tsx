import type { ReactNode } from 'react'
import { useTilt } from '../../lib/useTilt'

interface TiltCardProps {
  children: ReactNode
  /** Extra classes on the tilting panel itself. */
  className?: string
  /** Maximum rotation in degrees. Larger cards want smaller angles. */
  max?: number
  /** How far the card lifts toward the viewer, in pixels. */
  lift?: number
  /** Renders as a list item, for card grids inside <ul>. */
  as?: 'div' | 'li'
}

/**
 * A glass panel that tilts toward the pointer.
 *
 * Structure matters here: the outer element owns `perspective` and the inner one
 * owns the rotation. Putting both on one element makes the perspective origin
 * follow the rotation and the whole thing warps.
 *
 * `useTilt` handles every guard — reduced motion, coarse pointers, frame batching
 * — so a card only has to say how far it may move. With movement off, the panel
 * keeps its shadows, edge light and layering, which is what carries the depth.
 */
export function TiltCard({
  children,
  className = '',
  max = 6,
  lift = 8,
  as: Wrapper = 'div',
}: TiltCardProps) {
  const tiltRef = useTilt<HTMLDivElement>({ max, lift })

  return (
    <Wrapper className="tilt-wrap h-full">
      <div ref={tiltRef} className={`tilt panel panel--interactive h-full ${className}`}>
        {children}
      </div>
    </Wrapper>
  )
}
