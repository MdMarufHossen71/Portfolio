import { Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { mailto, site } from '../../config/site'
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
  const [scrolled, setScrolled] = useState(false)
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

  // Deepen the backdrop once the page moves, so the bar reads as a bar
  // rather than a floating strip. Passive + rAF-batched by the browser.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-scrolled={scrolled ? 'true' : 'false'}
      className="sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 data-[scrolled=false]:border-[var(--c-line)] data-[scrolled=false]:bg-[color-mix(in_oklab,var(--c-bg)_82%,transparent)] data-[scrolled=true]:border-[var(--c-line-strong)] data-[scrolled=true]:bg-[color-mix(in_oklab,var(--c-bg)_94%,transparent)] data-[scrolled=true]:shadow-[var(--sh-2)]"
    >
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
          <a href={mailto} className="btn btn--primary hidden !px-4 !py-2 !text-sm sm:inline-flex">
            Hire me
          </a>
          <button
            ref={triggerRef}
            type="button"
            className="text-muted hover:text-ink grid size-10 place-items-center rounded-full border border-[var(--c-line)] bg-[var(--c-glass-1)] transition-colors md:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X aria-hidden="true" className="size-[18px]" />
            ) : (
              <Menu aria-hidden="true" className="size-[18px]" />
            )}
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
            <a href={mailto} className="btn btn--primary mt-3 w-full">
              Hire me
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
