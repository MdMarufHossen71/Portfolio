/**
 * Skip link.
 *
 * First focusable element on the page, so a keyboard user can jump past the
 * header instead of tabbing through the whole navigation on every route. Hidden
 * off-screen until focused (see `.skip-link` in `base.css`) rather than
 * `display: none`, which would remove it from the tab order entirely and defeat
 * the point.
 */
export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to main content
    </a>
  )
}
