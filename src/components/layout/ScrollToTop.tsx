import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Restores scroll position and focus on navigation.
 *
 * A single-page app does not reload, so without this the visitor keeps whatever
 * scroll offset they had and — more importantly — keyboard focus stays on the
 * link they just clicked, which is now gone. Screen readers announce nothing at
 * all about the new page.
 *
 * So on every route change: jump to the top, then move focus to the <main>
 * landmark so the next Tab starts at the top of the new page and the page heading
 * is what gets read. The jump is instant, not smooth, for everyone: animating a
 * full-page scroll during navigation is disorienting rather than polished.
 *
 * `hash` navigations are left alone — the browser's own anchor scrolling is
 * correct there, and stealing focus would break in-page links.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return

    window.scrollTo(0, 0)

    const main = document.getElementById('main')
    if (!main) return
    // tabindex="-1" is set on <main> so it can receive focus without becoming a
    // tab stop. Focus is moved without scrolling, since we just scrolled.
    main.focus({ preventScroll: true })
  }, [hash, pathname])

  return null
}
