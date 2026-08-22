import {
  siBehance,
  siDribbble,
  siGithub,
  siGitlab,
  siMedium,
  siOrcid,
  siPinterest,
  siReddit,
  siSpotify,
  siTelegram,
  siTiktok,
  siTumblr,
  siWikipedia,
  siWordpress,
  siX,
} from 'simple-icons'
import type { SocialLink } from '../types/content'

/**
 * Every social/professional profile, defined once.
 *
 * Header, Footer, About and Contact all read from here — add or remove a link in
 * this file and it updates everywhere.
 *
 * Two rules this list follows deliberately:
 *
 *  1. Only verified URLs appear. Nothing is guessed from a username pattern.
 *  2. LinkedIn has no `mark`, because simple-icons removed the LinkedIn logo and
 *     hand-drawing a brand mark from memory would produce a subtly wrong one. It
 *     renders an in-house "in" glyph instead — honest, and still recognisable.
 *
 * Facebook is intentionally absent: no verified profile URL has been supplied.
 * See CONTENT_TODO.md.
 */
export const socialLinks: SocialLink[] = [
  // ── Curated primary set, shown prominently ──────────────────
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/MdMarufHossen71',
    handle: 'MdMarufHossen71',
    mark: siGithub,
    group: 'primary',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mdmarufhossen71',
    handle: 'mdmarufhossen71',
    mark: null,
    glyph: 'in',
    group: 'primary',
  },
  {
    id: 'x',
    label: 'X',
    url: 'https://x.com/MdMarufHossen71',
    handle: '@MdMarufHossen71',
    mark: siX,
    group: 'primary',
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    url: 'https://dribbble.com/mdmarufhossen71',
    handle: 'mdmarufhossen71',
    mark: siDribbble,
    group: 'primary',
  },

  // ── Extended set, behind the "More links" disclosure ────────
  {
    id: 'behance',
    label: 'Behance',
    url: 'https://www.behance.net/mdmarufhossen71',
    handle: 'mdmarufhossen71',
    mark: siBehance,
    group: 'more',
  },
  {
    id: 'medium',
    label: 'Medium',
    url: 'https://medium.com/@mdmarufhossen71',
    handle: '@mdmarufhossen71',
    mark: siMedium,
    group: 'more',
  },
  {
    id: 'wordpress',
    label: 'WordPress',
    url: 'https://mdmarufhossen71.wordpress.com',
    handle: 'mdmarufhossen71.wordpress.com',
    mark: siWordpress,
    group: 'more',
  },
  {
    id: 'gitlab',
    label: 'GitLab',
    url: 'https://gitlab.com/MdMarufHossen71',
    handle: 'MdMarufHossen71',
    mark: siGitlab,
    group: 'more',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    url: 'https://tiktok.com/@mdmarufhossen.71',
    handle: '@mdmarufhossen.71',
    mark: siTiktok,
    group: 'more',
  },
  {
    id: 'tumblr',
    label: 'Tumblr',
    url: 'https://www.tumblr.com/mdmarufhossen71',
    handle: 'mdmarufhossen71',
    mark: siTumblr,
    group: 'more',
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    url: 'https://www.pinterest.com/mdmarufhossen71',
    handle: 'mdmarufhossen71',
    mark: siPinterest,
    group: 'more',
  },
  {
    id: 'reddit',
    label: 'Reddit',
    url: 'https://www.reddit.com/user/MdMarufHossen71',
    handle: 'u/MdMarufHossen71',
    mark: siReddit,
    group: 'more',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    url: 'https://t.me/mdmarufhossen71',
    handle: '@mdmarufhossen71',
    mark: siTelegram,
    group: 'more',
  },
  {
    id: 'spotify',
    label: 'Spotify',
    url: 'https://open.spotify.com/user/31uhpf6ippqdkny7j2t5zicppgeu',
    handle: 'Listening profile',
    mark: siSpotify,
    group: 'more',
  },
  {
    id: 'orcid',
    label: 'ORCID',
    url: 'https://orcid.org/0009-0003-1978-6752',
    handle: '0009-0003-1978-6752',
    mark: siOrcid,
    group: 'more',
  },
  {
    id: 'wikipedia',
    label: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/User:MdMarufHossen71',
    handle: 'User:MdMarufHossen71',
    mark: siWikipedia,
    group: 'more',
  },
]

export const primarySocialLinks = socialLinks.filter((l) => l.group === 'primary')
export const moreSocialLinks = socialLinks.filter((l) => l.group === 'more')

/** Convenience lookup for the footer/JSON-LD, which reference GitHub directly. */
export const githubUrl = 'https://github.com/MdMarufHossen71'

/** `sameAs` targets for the Person JSON-LD block. */
export const socialProfileUrls = socialLinks.map((l) => l.url)
