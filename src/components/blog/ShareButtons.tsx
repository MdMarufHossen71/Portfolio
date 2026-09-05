import { Check, Link2, Share2 } from 'lucide-react'
import { useState } from 'react'
import { absoluteUrl } from '../../config/site'

interface ShareButtonsProps {
  title: string
  path: string
  description: string
}

/**
 * Share controls for a blog post.
 *
 * Prefers the Web Share API where the platform offers it (one native sheet,
 * no trackers), and otherwise falls back to copying the canonical link plus
 * plain share-intent links for X, Facebook and LinkedIn. Everything points at
 * the canonical URL on the custom domain — never the current host.
 */
export function ShareButtons({ title, path, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const url = absoluteUrl(path)

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: description, url })
      setShared(true)
    } catch {
      // Dismissed or unavailable — staying silent is correct, it was cancelled.
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const intentLinks = [
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div className="panel mt-12 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-base font-semibold">Share this post</h2>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {canNativeShare ? (
            <button
              type="button"
              onClick={nativeShare}
              className="btn btn--ghost !px-4 !py-2 !text-sm"
            >
              <Share2 aria-hidden="true" className="size-4" />
              Share
            </button>
          ) : null}
          <button type="button" onClick={copyLink} className="btn btn--ghost !px-4 !py-2 !text-sm">
            {copied ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Link2 aria-hidden="true" className="size-4" />
            )}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
      <p aria-live="polite" className="text-faint mt-2 min-h-5 text-xs">
        {copied ? 'Link copied to your clipboard.' : shared ? 'Thanks for sharing.' : ''}
      </p>
      <ul className="mt-1 flex flex-wrap gap-2">
        {intentLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="chip hover:text-ink"
            >
              {link.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
