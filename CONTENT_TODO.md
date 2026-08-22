# Content TODO

Everything on the site that is **a placeholder, an unverified claim, or an action only you can take**. Nothing here is a bug — each item is a place where inventing an answer would have meant fabricating something, so an honest gap was shipped instead.

Work top to bottom: the first section blocks a public launch, the rest can land afterwards.

---

## 1. Before publishing

### 1.1 Export `og-image.svg` to PNG — **required for social sharing**

`public/og-image.svg` is referenced as `og:image`, and **Facebook, X/Twitter and LinkedIn do not render SVG previews**. Right now, a shared link will show no image on any of them.

Fix: export at **1200 × 630** to `public/og-image.png`, then set `"ogImage": "/og-image.png"` in `src/config/site.config.json` and run:

```bash
npm run seo
```

Keep the SVG — it is the editable source. Any tool works (Inkscape, Figma, Canva, or a headless browser screenshot); nothing needs installing into this repo.

### 1.2 Enable GitHub Pages — **your action, not something this repo can do**

**Settings → Pages → Build and deployment → Source: _GitHub Actions_.**

The workflow at `.github/workflows/deploy-pages.yml` is complete and will run on push to `main`, but it cannot change repository settings and nothing here has been published. Until you flip that switch, no deploy happens.

### 1.3 Point the domain at it — separate, later step

`https://mdmarufhossen.link` is the canonical URL in the metadata, but it is **not yet serving this build**. `deploy/CNAME` is parked on purpose: activating it before DNS is configured would break `https://MdMarufHossen71.github.io/Portfolio/` without giving you a working custom domain.

DNS records and the one-line activation command are in [`deploy/README.md`](deploy/README.md). Do the DNS half first.

> Also note: the old `mdmarufhossen71.site` domain is dead and is referenced nowhere in this repo. Keep it that way.

---

## 2. Missing information — needs you

### 2.1 Facebook link

**Omitted from the live site entirely.** No verified personal Facebook profile URL has been provided, and guessing one would risk linking a stranger's account.

When you have the real URL, add one entry to `src/data/socialLinks.ts` (the file's header comment notes the absence) and the matching mark to `src/data/brandMarks.ts` — `simple-icons` already ships `siFacebook`. Header, footer and About all read that one array, so nothing else needs touching.

Currently **16** social links are live: GitHub, LinkedIn, X, WordPress, TikTok, Tumblr, Pinterest, Reddit, Dribbble, GitLab, Spotify, Telegram, ORCID, Wikipedia, Behance, Medium.

### 2.2 Two placeholder projects

`src/data/projects.ts` holds one real project (Tools & Games BD) and **two stubs** — one design, one marketing. They render with a visible "unfinished" treatment rather than pretending to be real work.

Each needs: `title`, `summary`, `role`, `tech` (currently `['[Tool 1]', '[Tool 2]']`), optionally `year`, and `repoUrl` / `liveUrl` **only if they actually resolve**. Then set `placeholder: false`.

A note on the summaries: describe the work — the problem, what you made, what changed. Avoid metrics ("+300% reach", "50k impressions") unless you can point at where the number came from. The file's header comment documents every field.

### 2.3 Profile photo

The site uses a generated **"MH" monogram** everywhere an avatar would go (`src/components/ui/Monogram.tsx`). No personal photo was downloaded or committed — that needed your approval.

To use a real photo: add it to `public/` (square, ideally ≥ 512 px, WebP or JPEG) and swap the `<Monogram>` usage on the About page and in the hero. The monogram is a fine permanent answer too; it is not a broken state.

### 2.4 "Info HUB" has no link

Listed on About as a side project by **name only** — no verified URL was supplied, so it is deliberately not clickable (`src/data/profile.ts:66`). Add the URL there if you want it linked.

---

## 3. Verified corrections and unverified claims

### 3.1 Game count is 32, not 33

The brief this catalogue came from labelled the list **"33 games"**, but it contains **32 names**. Checked against the source project on 2026-08-22: its own data file also holds exactly 32 entries, and "33" appears nowhere in it. So "33" was an off-by-one and **must not be published**.

Nothing needs fixing — every figure on screen derives from `games.length`, so the site already says 32 and will follow automatically if you add entries. This is recorded so the wrong number does not get reintroduced from the original brief.

### 3.2 Games are catalogue entries, not playable games

In the source project each of the 32 is a named, routed slot with the per-game implementation still being built. So the copy says **"listed"**, **"catalogue"**, **"entries"** — never "32 playable games" — and there is **no Play button anywhere** on the Games page, because nothing runs in the portfolio and a button that merely navigates away would misrepresent itself.

If those games ship for real, that wording can be upgraded — **after** checking the source project again, not before.

### 3.3 Per-game control schemes unverified

No keyboard/touch/gamepad badges are shown. Which games need a keyboard and which work on touch could not be verified per game, and a wrong badge is worse than no badge. Verify per game before adding them.

### 3.4 Tool counts: 283 entries, 53 implemented

`src/data/external.ts` records **283** tool entries across **12** categories, of which **53** are wired to real browser-side logic — so **230 are catalogue entries only**. Counted from the source project's data file on 2026-08-22.

The Tools page states this in plain words rather than implying 283 finished utilities. Re-count and update `SOURCE_TOOL_ENTRIES` / `SOURCE_TOOLS_IMPLEMENTED` (and the per-category `sourceCount` values in `src/data/tools.ts`) as the project fills in — if the per-category counts and the recorded total ever disagree, a dev-server console warning points it out.

### 3.5 Privacy wording is a posture, not a guarantee

`PRIVACY_STATEMENT` in `src/data/external.ts` is phrased as a design posture, and three genuine exceptions are surfaced in the UI rather than buried: sensitive fields excluded from input memory, bring-your-own-key AI requests going to that provider, and the file-sharing tool using a third-party signalling service.

**Do not upgrade this to "100% private", "nothing ever leaves your device" or "fully offline"** — each would be false as the project stands.

### 3.6 The Tools-Games repo `homepage` field is empty

The live demo at `https://mdmarufhossen71.github.io/Tools-Games/` was verified serving on 2026-08-22, but the repository's own `homepage` field is blank, so that URL cannot be read from repo metadata and is recorded by hand in `src/data/external.ts`.

Worth fixing in **that** repo (Settings → About → Website), which would also make the link discoverable to anyone landing there. Nothing in this repo touches it.

---

## 4. Blog: three starter drafts

`src/content/blog/` holds three posts, all dated **2026-08-22** (the day they were written — not a backdated publication date), each flagged `starter: true` and carrying a **visible on-page notice** that it is a starter draft:

- `building-a-privacy-first-browser-workbench.md`
- `what-i-am-learning-while-building-for-the-web.md`
- `designing-useful-digital-tools-with-a-human-interface.md`

They are written from what the code actually does and contain no invented personal anecdotes, client stories or results. Rewrite them in your own voice, then remove `starter: true` to drop the notice.

To unpublish one instead, set `published: false` — it disappears from the index and the sitemap. To add a post, drop a new `.md` in that folder and run `npm run seo`.

---

## 5. Nice to have

- **Real testimonials.** None are shown; there is no testimonials section at all, because inventing quotes was not an option. Add one with genuine, attributable quotes if you collect them.
- **A CV / résumé download.** No PDF is linked. Add to `public/` and link from About if you want one.
- **Case-study depth.** Projects are cards only. If a piece of work deserves a full write-up, a blog post is the cheapest route — no new route or template needed.
- **Analytics.** None ships, deliberately. If you add any, say so on the site; a privacy-first pitch beside silent tracking reads badly.

---

## Ground rules for whoever edits next

1. **Never hardcode a count in prose.** Every number on the site derives from a data array. Write "the catalogue" and let the component fill in the figure.
2. **Placeholders are better than plausible fiction.** `[Add project title]` is honest; a made-up client name is not.
3. **Do not remove the hedges.** Words like "listed", "entries", "in progress" and "built privacy-first" are load-bearing — they are what makes the claim true.
4. **Do not add a link you have not opened.** A 404 on a portfolio costs more than an absent link.
5. **Run `npm run check` before committing**, and `npm run seo` after adding or removing any page or post.
