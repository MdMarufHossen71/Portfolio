import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ExternalLink } from './ExternalLink'

export type ButtonVariant = 'primary' | 'ghost' | 'quiet'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn btn--primary',
  ghost: 'btn btn--ghost',
  quiet: 'btn btn--quiet',
}

/**
 * Buttons come in three shapes because the underlying element must match the
 * behaviour, not the styling:
 *
 *   <Button>          → a real <button>, for actions in the page
 *   <ButtonLink>      → a router <Link>, for navigation within the site
 *   <ButtonExternal>  → an <a target="_blank">, for leaving the site
 *
 * Styling a <div> as a button, or a button as a link, breaks keyboard use and
 * middle-click, so the choice is made explicit at the call site.
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ variant = 'ghost', className = '', children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={`${VARIANT_CLASS[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

interface ButtonLinkProps {
  to: string
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  'aria-label'?: string
}

export function ButtonLink({ to, variant = 'ghost', className = '', ...rest }: ButtonLinkProps) {
  return <Link to={to} className={`${VARIANT_CLASS[variant]} ${className}`} {...rest} />
}

interface ButtonExternalProps {
  href: string
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  context?: string
  hideIcon?: boolean
}

export function ButtonExternal({
  href,
  variant = 'ghost',
  className = '',
  ...rest
}: ButtonExternalProps) {
  return <ExternalLink href={href} className={`${VARIANT_CLASS[variant]} ${className}`} {...rest} />
}

interface ButtonAnchorProps {
  href: string
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  'aria-label'?: string
}

/**
 * For `mailto:` and `tel:` links. Same tab, and no "opens in a new tab" note —
 * these hand off to a mail or phone app, which is not a new tab, and saying so
 * would be inaccurate.
 */
export function ButtonAnchor({
  href,
  variant = 'ghost',
  className = '',
  ...rest
}: ButtonAnchorProps) {
  return <a href={href} className={`${VARIANT_CLASS[variant]} ${className}`} {...rest} />
}
