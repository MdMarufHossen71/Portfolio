# Md Maruf Hossen — Portfolio

Personal portfolio site: **Digital Marketer · Graphic Designer · Web Builder · Freelancer**, Gazipur, Dhaka, Bangladesh.

- **Canonical domain:** https://mdmarufhossen.link _(not yet pointed at this build — see [Deploying](#deploying))_
- **GitHub Pages URL:** https://MdMarufHossen71.github.io/Portfolio/
- **Contact:** maruf.112005@gmail.com

Dark-first, static, no backend, no analytics, no secrets. React + TypeScript + Vite + Tailwind CSS v4, deployable to GitHub Pages, Vercel or Netlify from the same commit.

---

## Quick start

Requires Node **≥ 20.19** (see `engines` in `package.json`; CI uses 22).

```bash
npm install
```

```bash
npm run dev
```

That serves http://localhost:5173. To check a production build locally:

```bash
npm run build && npm run preview
```

---

## Scripts

| Script                 | What it does                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `npm run dev`          | Vite dev server on port 5173.                                                           |
| `npm run build`        | Runs `seo` first (via `prebuild`), then builds to `dist/`.                              |
| `npm run preview`      | Serves the built `dist/` on port 4173.                                                  |
| `npm run seo`          | Regenerates the `<head>` block in `index.html`, plus `robots.txt` and `sitemap.xml`.    |
| `npm run typecheck`    | `tsc --noEmit` over both the app and the Node-side config/scripts.                      |
| `npm run lint`         | ESLint 10 flat config over the whole repo.                                              |
| `npm run lint:fix`     | Same, with autofix.                                                                     |
| `npm run format`       | Prettier write.                                                                         |
| `npm run format:check` | Prettier check — the one CI runs.                                                       |
| `npm run check`        | `format:check` → `lint` → `typecheck`. Run this before committing.                      |
| `npm run verify`       | `check` → `build`. The full gate; this is what the deploy workflow effectively mirrors. |

---

## Architecture

```
src/
  config/       site.config.json  ← single source of truth (name, URLs, email, theme colours)
                site.ts           ← typed accessors over it
  data/         profile · socialLinks · projects · tools · games · nav · external · brandMarks
  content/blog/ *.md              ← posts, frontmatter + markdown
  lib/          markdown · blog · seo · theme · motion · useTilt · useReveal · spaRedirect · format
  components/   layout/ · ui/ · cards/ · home/ · visuals/
  pages/        Home · About · Projects · Tools · Games · Blog · BlogPost · NotFound
  styles/       tokens.css · base.css · effects.css → index.css
scripts/
  generate-seo.mjs                ← writes index.html <head>, robots.txt, sitemap.xml
public/         404.html · favicon.svg · og-image.svg · robots.txt* · sitemap.xml*
deploy/         CNAME + instructions (deliberately inactive — see below)
```

`*` generated — do not hand-edit `public/robots.txt`, `public/sitemap.xml`, or the block between `<!-- SEO:START -->` and `<!-- SEO:END -->` in `index.html`. Change `src/config/site.config.json` and run `npm run seo`.

### Things worth knowing before editing

**Every published number is derived.** Tool, game, category and post counts come from `.length` / `.reduce()` on the data arrays, never from a string in copy. Add a game to `src/data/games.ts` and the Games page heading, the stats row and the filter chips all follow. This is deliberate: a hardcoded "33 games" is a claim that silently goes stale, and one already had to be corrected (see `CONTENT_TODO.md`).

**One knob for the base path.** `VITE_BASE_PATH` → Vite `base` → `import.meta.env.BASE_URL` → the router's `basename` and every asset URL. Nothing else hardcodes a prefix.

**The 3D is CSS only.** No WebGL, no three.js, no canvas. `perspective` + `transform-style: preserve-3d` + `translateZ` layers, with pointer tilt fed through CSS custom properties (`--rx`, `--ry`, `--lift`) in `src/lib/useTilt.ts`. Tilt is gated to fine pointers, and `prefers-reduced-motion: reduce` disables motion globally in `src/styles/base.css` — check both before adding animation.

**Markdown is rendered at build time, not fetched.** `src/lib/blog.ts` uses Vite's `import.meta.glob` with `?raw`, parses frontmatter, and runs the body through the configured `marked` instance in `src/lib/markdown.ts`, which escapes raw HTML and allow-lists link schemes. That is why `BlogPost.tsx` can use `dangerouslySetInnerHTML` on trusted, locally-authored content.

**Brand icons come from `simple-icons` (CC0-1.0)**, wrapped by `src/components/ui/BrandIcon.tsx`. `lucide-react` v1 removed all brand marks, so do not reach for it for logos.

### Adding content

| To add…       | Edit                             | Notes                                                                                         |
| ------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| a project     | `src/data/projects.ts`           | Copy a placeholder object; the file's header comment documents each field.                    |
| a blog post   | new `src/content/blog/<slug>.md` | Frontmatter: `title`, `description`, `date` (ISO), `tags`, `published`. Filename is the slug. |
| a social link | `src/data/socialLinks.ts`        | Needs a matching entry in `src/data/brandMarks.ts`.                                           |
| a nav item    | `src/data/nav.ts`                | Header, footer, 404 page **and** `sitemap.xml` all read this one array.                       |

After adding or removing a page or post, run `npm run seo` so the sitemap matches.

---

## Accessibility

Checked in-browser on this build: one `<h1>` per route; skip link to a focusable `#main`; landmark structure (1 header / 1 main / 1 footer / 2 nav); every `<section>` labelled; every button named; decorative SVGs `aria-hidden`; filter state on real buttons with `aria-pressed` and an `aria-live` result summary; the mobile panel traps nothing but does lock body scroll, closes on Escape, and returns focus to its trigger; no horizontal overflow at 320 / 375 / 768 / 1024 / 1440 px; no hover-only content; all external links carry `rel="noopener noreferrer"`.

Keep these when editing. If you add a control, give it a name that describes the action ("Switch to light theme"), not the state.

---

## SEO

`npm run seo` reads `src/config/site.config.json` and writes:

- the `<head>` block in `index.html` — title, description, canonical, Open Graph, Twitter card, and a **single** `theme-color` meta with no `media` attribute (the theme provider needs to be able to override the OS preference; a `media` attribute would outrank a content change);
- `public/robots.txt`;
- `public/sitemap.xml` — routes parsed out of `src/data/nav.ts` plus published posts, with `<lastmod>` on posts only.

It also fails the build if the theme colours in `index.html`'s pre-paint script drift from the config, and it formats its own output with Prettier so `npm run format:check` stays green.

Per-page metadata is applied at runtime by `useSeo` / `useJsonLd` in `src/lib/seo.ts`.

> **Known limitation:** `og:image` is an SVG. Facebook, X and LinkedIn do not render SVG previews — a PNG export is required before sharing. Tracked in `CONTENT_TODO.md`.

---

## Deploying

**Nothing in this repo publishes anything on its own.** The Pages workflow exists but needs one manual switch; the Vercel and Netlify configs do nothing until a project is linked. Enabling any of it is a decision for the repository owner.

### GitHub Pages (primary)

One manual step: **Settings → Pages → Build and deployment → Source: _GitHub Actions_**.

After that, `.github/workflows/deploy-pages.yml` builds and deploys on every push to `main` (or on manual dispatch). It resolves the base path itself:

1. the `PAGES_BASE_PATH` repository variable, if set;
2. otherwise `/` when `public/CNAME` exists;
3. otherwise `/<repo-name>/` — i.e. `/Portfolio/`.

To build a Pages-shaped bundle locally:

```bash
VITE_BASE_PATH=/Portfolio/ npm run build
```

Deep links work through `public/404.html`, which stashes the requested route in `sessionStorage` and redirects to the base; `restoreSpaRedirect()` in `src/lib/spaRedirect.ts` replays it before the router mounts.

### Custom domain (`mdmarufhossen.link`)

`deploy/CNAME` is ready but **not** in `public/`, on purpose: dropping it in flips the workflow's base path to `/` and tells Pages to expect the custom domain, which would break the `github.io/Portfolio/` URL before DNS is configured. Do the DNS half first — full instructions and the required records are in [`deploy/README.md`](deploy/README.md).

### Vercel / Netlify

`vercel.json` and `netlify.toml` are committed and complete: SPA fallback (status 200, so the URL survives for the router), immutable caching for hashed `/assets/*`, `must-revalidate` on `index.html`, and `nosniff` / `Referrer-Policy` / `X-Frame-Options` headers. Base path stays `/` — both serve from a domain root, so no override is needed.

### Secrets

None. This is a static site with no backend, no API keys and no environment variables beyond the optional `VITE_BASE_PATH`. If a future change seems to need a secret, it needs a backend instead — do not put one in the bundle, where it would be public.

---

## Content status

Some copy is intentionally an editable placeholder rather than an invented claim — two stub projects, the blog posts (starter drafts), the avatar (a monogram). Every one of them, plus the pending owner actions, is listed in **[`CONTENT_TODO.md`](CONTENT_TODO.md)**. Read that before publishing.

---

## License

Code is GPL-3.0-only (`LICENSE`). Personal content — name, biography, images, written posts — is not covered by that grant and remains the author's.

Third-party assets: brand marks from [simple-icons](https://github.com/simple-icons/simple-icons) (CC0-1.0), UI icons from [Lucide](https://lucide.dev) (ISC), and Inter / Space Grotesk / JetBrains Mono via Fontsource (SIL OFL 1.1).
