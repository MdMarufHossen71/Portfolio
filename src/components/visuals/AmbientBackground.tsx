/**
 * The ambient stage: a receding grid "floor" and two drifting light halos.
 *
 * Rendered once, from the layout, and fixed behind every route — so navigating
 * does not restart the animations or re-paint the background.
 *
 * `aria-hidden` and `pointer-events: none` (set in CSS): it is pure decoration
 * and must never intercept a click or reach a screen reader. All movement here is
 * switched off by the reduced-motion block in `effects.css`, while the depth cues
 * — gradient, convergence, blur — remain.
 */
export function AmbientBackground() {
  return (
    <div className="stage" aria-hidden="true">
      <div className="stage__halo stage__halo--a" />
      <div className="stage__halo stage__halo--b" />
      <div className="stage__grid" />
    </div>
  )
}
