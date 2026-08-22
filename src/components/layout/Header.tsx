import { Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../../config/site'
import { navItems } from '../../data/nav'
import { Monogram } from '../ui/Monogram'
import { ThemeToggle } from './ThemeToggle'

/**
 * Site header.
 *
 * Desktop: inline nav. Mobile: a disclosure panel driven by `aria-expanded` and
 * `aria-controls` on the trigger.
 *
 * The mobile panel is *unmounted* when closed rather than hidden, so its links are
 * genuinely out of the tab order — a visually hidden menu whose links are still
 * focusable is one of the most common keyboard traps on a mobile site.
 *
 * `NavLink` supplies `aria-current="page"`, so the active item is conveyed to
 * assistive technology and not only by colour.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  // Close on navigation: the panel covers the page the visitor just asked for.
  //
  // Adjusted during render rather than in an effect. React's own guidance for
  // "reset state when a value changes" — an effect here would paint the open panel
  // over the new route for one frame before closing it, and would queue a second
  // render on every single navigation whether the panel was open or not.
  const [panelRoute, setPanelRoute] = useState(pathname)
  if (panelRoute !== pathname) {
    setPanelRoute(pathname)
    if (open) setOpen(false)
  }

  // Escape closes and returns focus to the trigger, so the visitor is not left
  // focused on an element that no longer exists.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Prevent the page behind the open panel from scrolling.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--c-line)] bg-[color-mix(in_oklab,var(--c-bg)_82%,transparent)] backdrop-blur-xl">
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5" aria-label={`${site.name} — home`}>
          <Monogram size={34} />
          <span className="font-display text-[0.95rem] leading-tight font-semibold tracking-tight">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-ink bg-[var(--c-glass-2)]'
                    : 'text-muted hover:text-ink hover:bg-[var(--c-glass-1)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={triggerRef}
            type="button"
            className="text-muted hover:text-ink grid size-10 place-items-center rounded-full border border-[var(--c-line)] bg-[var(--c-glass-1)] transition-colors md:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X aria-hidden="true" className="size-[18px]" />
            ) : (
              <Menu aria-hidden="true" className="size-[18px]" />
            )}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={panelId}
          className="border-t border-[var(--c-line)] bg-[var(--c-surface)] md:hidden"
        >
          <nav aria-label="Main" className="shell flex flex-col py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-[var(--r-sm)] px-3 py-3 text-base font-medium transition-colors ${
                    isActive ? 'text-ink bg-[var(--c-glass-2)]' : 'text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
