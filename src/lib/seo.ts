import { useEffect } from 'react'
import { BASE_URL, absoluteUrl, site } from '../config/site'
import { socialProfileUrls } from '../data/socialLinks'

/**
 * Per-route metadata.
 *
 * `index.html` ships a complete static <head> — generated from `site.config.json`
 * by `scripts/generate-seo.mjs` — so crawlers and link unfurlers that do not run
 * JavaScript still get correct tags for the home page. These hooks then keep the
 * same tags accurate as the visitor navigates the SPA.
 *
 * Canonical URLs always point at the custom domain (`site.siteUrl`), never at the
 * current host. That is deliberate: the same build is served from GitHub Pages
 * under a project path, and duplicate hosts should both defer to one canonical.
 */

export interface SeoInput {
  /** Page title without the site suffix. Leave empty for the home page. */
  title?: string
  description?: string
  /** Route path, e.g. `/projects`. */
  path: string
  type?: 'website' | 'article'
  /** Absolute or site-relative image URL. Falls back to the default OG image. */
  image?: string
  /** ISO date, for article pages. */
  publishedTime?: string
  tags?: string[]
  /** Set for pages that should stay out of search results, e.g. 404. */
  noindex?: boolean
}

function upsertMeta(key: 'name' | 'property', value: string, content: string): void {
  const selector = `meta[${key}="${value}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(key, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(key: 'name' | 'property', value: string): void {
  document.head.querySelector(`meta[${key}="${value}"]`)?.remove()
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/** Resolves an image reference to an absolute URL on the canonical domain. */
function resolveImage(image?: string): string {
  const raw = image ?? site.ogImage
  if (/^https?:\/\//i.test(raw)) return raw
  return absoluteUrl(raw)
}

export function useSeo({
  title,
  description,
  path,
  type = 'website',
  image,
  publishedTime,
  tags,
  noindex = false,
}: SeoInput): void {
  // Joined so a freshly-built array literal from a caller does not re-run this.
  const tagKey = tags?.join('|') ?? ''

  useEffect(() => {
    const fullTitle = title ? `${title} — ${site.name}` : site.title
    const desc = description ?? site.description
    const url = absoluteUrl(path)
    const imageUrl = resolveImage(image)

    document.title = fullTitle
    upsertMeta('name', 'description', desc)
    upsertCanonical(url)

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, follow')
    } else {
      removeMeta('name', 'robots')
    }

    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:site_name', site.name)
    upsertMeta('property', 'og:locale', site.locale)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', desc)
    upsertMeta('name', 'twitter:image', imageUrl)

    // Article-only tags: clear them again on non-article routes so a blog post's
    // publish date cannot linger on the next page the visitor opens.
    if (type === 'article' && publishedTime) {
      upsertMeta('property', 'article:published_time', publishedTime)
      upsertMeta('property', 'article:author', site.name)
    } else {
      removeMeta('property', 'article:published_time')
      removeMeta('property', 'article:author')
    }

    document.head.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove())
    if (type === 'article' && tagKey) {
      for (const tag of tagKey.split('|')) {
        const el = document.createElement('meta')
        el.setAttribute('property', 'article:tag')
        el.setAttribute('content', tag)
        document.head.appendChild(el)
      }
    }
  }, [description, image, noindex, path, publishedTime, tagKey, title, type])
}

/**
 * Injects a JSON-LD block, replacing any previous block with the same id.
 * Removed on unmount so structured data never describes the wrong page.
 */
export function useJsonLd(id: string, data: unknown): void {
  // Serialise outside the effect so the dependency is a stable string. Callers
  // build these objects inline during render; depending on the object itself
  // would re-inject the block on every render.
  const json = JSON.stringify(data)
  useEffect(() => {
    document.getElementById(id)?.remove()
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    el.textContent = json
    document.head.appendChild(el)
    return () => el.remove()
  }, [id, json])
}

/**
 * Site-level structured data: who this is and what the site is.
 *
 * `sameAs` is fed from the verified social links only — the same single source of
 * truth the footer renders — so search engines never see a profile URL the site
 * itself will not link to.
 */
export function siteJsonLd() {
  const personId = `${absoluteUrl('/')}#person`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: site.name,
        url: absoluteUrl('/'),
        email: `mailto:${site.email}`,
        jobTitle: site.role,
        description: site.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.locality,
          addressRegion: site.region,
          addressCountry: site.country,
        },
        sameAs: socialProfileUrls,
      },
      {
        '@type': 'WebSite',
        '@id': `${absoluteUrl('/')}#website`,
        url: absoluteUrl('/'),
        name: site.title,
        description: site.description,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
    ],
  }
}

/** Structured data for a single blog post. */
export function articleJsonLd(input: {
  title: string
  description: string
  date: string
  slug: string
  tags: string[]
}) {
  const url = absoluteUrl(`/blog/${input.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    // No dateModified: it has not been tracked, and inventing one would be a
    // fabricated fact in machine-readable form.
    author: { '@type': 'Person', name: site.name, url: absoluteUrl('/') },
    publisher: { '@type': 'Person', name: site.name, url: absoluteUrl('/') },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    keywords: input.tags.join(', '),
    inLanguage: 'en',
  }
}

/**
 * Structured data for a real (non-placeholder) project.
 *
 * Only honest fields: nothing here claims users, revenue or awards. Omit the
 * entry entirely rather than filling a field with a guess.
 */
export function projectJsonLd(input: {
  title: string
  description: string
  tech: string[]
  url?: string
  repoUrl?: string
  year?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.title,
    description: input.description,
    author: { '@type': 'Person', name: site.name, url: absoluteUrl('/') },
    ...(input.url ? { url: input.url } : {}),
    ...(input.repoUrl ? { codeRepository: input.repoUrl } : {}),
    ...(input.year ? { dateCreated: input.year } : {}),
    keywords: input.tech.join(', '),
    inLanguage: 'en',
  }
}

/**
 * Prefixes a path with the deploy base path, for assets referenced from JS.
 * Router links must NOT use this — the router already applies its basename.
 */
export function asset(path: string): string {
  return `${BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
