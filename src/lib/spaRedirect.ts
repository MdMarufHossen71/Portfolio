/**
 * GitHub Pages SPA fallback — receiving half.
 *
 * Pages serves 404.html for any path that isn't a real file, so a deep link
 * like /projects never reaches index.html. public/404.html stashes the intended
 * path and bounces to the app root; this restores it before React Router reads
 * the location, so the correct route renders and the URL stays clean.
 *
 * Harmless on hosts that don't need it (Vercel/Netlify rewrite server-side, so
 * the key is simply never set).
 */

const KEY = 'spa:redirect'

/** Reads and clears the stash in one go. Returns null if storage is unavailable. */
function takeStashedPath(): string | null {
  try {
    const value = sessionStorage.getItem(KEY)
    if (value) sessionStorage.removeItem(KEY)
    return value
  } catch {
    // Storage unavailable (private mode). Nothing to restore.
    return null
  }
}

export function restoreSpaRedirect(): void {
  const stashed = takeStashedPath()
  if (!stashed) return

  // Reject anything that could jump origin: protocol-relative or absolute URLs.
  if (stashed.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(stashed)) return

  const base = import.meta.env.BASE_URL // "/" or "/Portfolio/"
  const target = base.replace(/\/$/, '') + '/' + stashed.replace(/^\//, '')

  window.history.replaceState(null, '', target)
}
