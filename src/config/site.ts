import raw from './site.config.json'

/**
 * Site-wide identity and metadata.
 *
 * `site.config.json` is the single source of truth: `scripts/generate-seo.mjs`
 * reads the same file to produce robots.txt, sitemap.xml and the static <head>
 * block in index.html, so nothing can drift between the app and its metadata.
 */
export interface SiteConfig {
  name: string
  shortName: string
  monogram: string
  role: string
  eyebrow: string
  location: string
  locality: string
  region: string
  country: string
  email: string
  siteUrl: string
  title: string
  description: string
  twitterHandle: string
  locale: string
  themeColorDark: string
  themeColorLight: string
  ogImage: string
}

export const site: SiteConfig = raw

/**
 * Public base path, injected by Vite from `base` in vite.config.ts.
 * "/" for the custom domain, "/Portfolio/" for a GitHub Pages project site.
 */
export const BASE_URL: string = import.meta.env.BASE_URL

/** Absolute canonical URL for a route path, for <link rel="canonical"> and OG tags. */
export function absoluteUrl(path = '/'): string {
  const origin = site.siteUrl.replace(/\/+$/, '')
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${origin}${clean === '/' ? '/' : clean.replace(/\/+$/, '')}`
}

export const mailto = `mailto:${site.email}`
