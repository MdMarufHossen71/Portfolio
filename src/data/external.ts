/**
 * Facts about the external Tools & Games project.
 *
 * ─── BOUNDARY ────────────────────────────────────────────────────────────────
 * That project lives in its own repository and is NOT vendored into this site:
 *   • No source file from it is copied here.
 *   • It is treated as read-only; this project never modifies it.
 *   • The listings in `tools.ts` / `games.ts` are a curated showcase, not the app.
 *
 * ─── PROVENANCE ──────────────────────────────────────────────────────────────
 * Everything below was checked against the public repository and the live build
 * on 2026-08-22. Where a claim is qualified, the qualification is load-bearing —
 * please do not "tidy" the hedges away. Re-verify before changing a figure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const TOOLS_GAMES_REPO_URL = 'https://github.com/MdMarufHossen71/Tools-Games'

/**
 * Live demo. Verified serving HTTP 200 on 2026-08-22.
 *
 * Note for future editors: the repository's own `homepage` field is still empty,
 * so this URL cannot be read from repo metadata — it is recorded here by hand
 * after checking it resolves. If it ever 404s, set this back to `null` and every
 * "live demo" affordance across the site turns off at once.
 */
export const TOOLS_GAMES_LIVE_URL: string | null = 'https://mdmarufhossen71.github.io/Tools-Games/'

/** First commit landed 2026-08-14, so the project dates to 2026. */
export const TOOLS_GAMES_YEAR = '2026'

/**
 * Catalogue sizes, counted from the source project's own data files.
 *
 * These count CATALOGUE ENTRIES — routes with a name, a slug and a home in the
 * information architecture. They are not a count of finished features, and the
 * copy on the Tools and Games pages says so.
 */
export const SOURCE_TOOL_ENTRIES = 283
export const SOURCE_GAME_ENTRIES = 32
/** Of the 283 tool entries, this many are wired to real browser-side logic. */
export const SOURCE_TOOLS_IMPLEMENTED = 53

/**
 * How the project is honestly described: complete information architecture,
 * work still in progress behind it.
 */
export const TOOLS_GAMES_STATUS =
  'In progress — the directory, routing, theming and data layer are complete; individual tools are being filled in behind them.'

/**
 * Privacy posture.
 *
 * Worded as a design posture, not a guarantee, because that is exactly what the
 * evidence supports. Do NOT upgrade this to "100% private", "nothing ever leaves
 * your device", or "fully offline" — see PRIVACY_CAVEATS for why each of those
 * would be false.
 */
export const PRIVACY_STATEMENT =
  'Built privacy-first: tool inputs, preferences, drafts and saved progress stay in the visitor’s own browser, there is no account to create, and no tracking or analytics code ships with the app.'

/**
 * The honest small print. Surfaced in the UI rather than buried, because a
 * privacy claim with hidden exceptions is worse than a modest one.
 */
export const PRIVACY_CAVEATS = [
  'Sensitive fields — generated passwords, encryption text, TOTP seeds, JWT payloads and secret tokens — are deliberately excluded from the per-tool input memory.',
  'AI features are bring-your-own-key: if you supply a key, those requests go to that provider from your browser.',
  'The file-sharing tool pairs two browsers through a third-party signalling service before data moves directly between them.',
]

/** Verified feature highlights, each traceable to the source project. */
export const TOOLS_GAMES_HIGHLIGHTS = [
  'One searchable directory across every tool and game',
  'Bilingual interface — English and Bangla',
  '12 built-in themes plus a custom theme builder',
  'Export, import or clear all of your saved data as a single JSON file',
]
