import { Marked } from 'marked'

/**
 * Markdown → HTML for blog posts.
 *
 * Safety model, stated plainly because this output is injected with
 * `dangerouslySetInnerHTML`:
 *
 *   • Raw HTML in markdown is ESCAPED, not passed through. Posts are authored in
 *     this repository, but escaping removes the whole class of injection bugs
 *     rather than relying on every future author being careful. If a post ever
 *     genuinely needs an embed, add a narrow, reviewed shortcode — do not switch
 *     this back to passing HTML through.
 *   • URLs are validated against an allow-list of schemes, so a `javascript:`
 *     link in a post body cannot become an executable link.
 *   • Every attribute value is escaped on the way out.
 *
 * A dedicated `Marked` instance is used instead of the global `marked` singleton
 * so these overrides cannot leak into, or be clobbered by, anything else.
 */

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)
}

/** Schemes that may appear in a rendered link or image. */
const SAFE_SCHEME = /^(https?:|mailto:)/i
/** Anything that looks like `scheme:` and is not allow-listed is rejected. */
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i

/**
 * Returns an escaped, renderable URL, or null when it should not become a link.
 * Relative paths and in-page anchors are always fine.
 */
function safeUrl(href: string | null | undefined): string | null {
  if (!href) return null
  const trimmed = href.trim()
  if (trimmed === '') return null
  // Protocol-relative URLs hide their scheme; treat them as external https.
  if (trimmed.startsWith('//')) return null
  if (HAS_SCHEME.test(trimmed) && !SAFE_SCHEME.test(trimmed)) return null
  return escapeHtml(trimmed)
}

function isExternal(href: string): boolean {
  return /^https?:/i.test(href)
}

const renderer = new Marked({ gfm: true, breaks: false })

renderer.use({
  renderer: {
    // Block-level and inline raw HTML both route through here.
    html({ text }) {
      return escapeHtml(text)
    },

    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens)
      const url = safeUrl(href)
      // Unsafe or empty target: keep the words, drop the link.
      if (!url) return label

      const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
      const external = isExternal(url) ? ' target="_blank" rel="noopener noreferrer external"' : ''
      return `<a href="${url}"${titleAttr}${external}>${label}</a>`
    },

    image({ href, title, text }) {
      const url = safeUrl(href)
      const alt = escapeHtml(text ?? '')
      // No usable source: fall back to the alt text so meaning is not lost.
      if (!url) return alt

      const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
      return `<img src="${url}" alt="${alt}"${titleAttr} loading="lazy" decoding="async" />`
    },
  },
})

/** Renders a markdown body to HTML. Synchronous by construction. */
export function renderMarkdown(markdown: string): string {
  const html = renderer.parse(markdown, { async: false })
  return typeof html === 'string' ? html : ''
}

/**
 * Reading time in whole minutes, at 200 words per minute — a conventional
 * average. Always at least 1, so a short post never reads "0 min".
 */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
