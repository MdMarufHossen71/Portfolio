import { siGithub } from 'simple-icons'
import type { BrandMark } from '../types/content'

/**
 * Brand marks used outside the social-links list.
 *
 * `lucide-react` v1 removed every brand icon, so brand glyphs come from
 * `simple-icons` (CC0-1.0 — public domain, no attribution burden). Re-exported
 * here so components import a plain `BrandMark` and never depend on that
 * package's export shape directly.
 */
export const githubMark: BrandMark = siGithub
