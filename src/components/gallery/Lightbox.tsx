import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { ACCENT_GRADIENT } from '../../lib/accents'
import type { GalleryItem } from '../../types/content'
import { Badge } from '../ui/Badge'

interface LightboxProps {
  items: GalleryItem[]
  index: number
  onSelect: (index: number) => void
  onClose: () => void
}

/**
 * Fullscreen gallery preview.
 *
 * Accessibility contract:
 *   • `role="dialog"` + `aria-modal` + a real accessible name.
 *   • ESC closes; ←/→ move between items.
 *   • Focus moves to the close button on open and returns to the invoking
 *     thumbnail on close; Tab cycles inside the dialog.
 *   • The page behind cannot scroll while open.
 *   • Decorative artwork is `aria-hidden`; the text beside it carries meaning.
 */
export function Lightbox({ items, index, onSelect, onClose }: LightboxProps) {
  const item = items[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<Element | null>(null)

  const go = useCallback(
    (delta: number) => {
      if (items.length < 2) return
      onSelect((index + delta + items.length) % items.length)
    },
    [index, items.length, onSelect],
  )

  useEffect(() => {
    openerRef.current = document.activeElement
    closeRef.current?.focus()

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        go(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        go(-1)
      } else if (event.key === 'Tab') {
        // Lightweight focus trap: cycle through the dialog's buttons.
        const dialog = dialogRef.current
        if (!dialog) return
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus()
    }
  }, [go, onClose])

  if (!item) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — preview ${index + 1} of ${items.length}`}
      className="lightbox"
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="lightbox__backdrop"
      />
      <div className="lightbox__panel">
        <div className="lightbox__art">
          {item.imageSrc ? (
            <img
              src={item.imageSrc}
              alt={item.imageAlt ?? item.title}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              aria-hidden="true"
              className="lightbox__tile"
              style={{ background: ACCENT_GRADIENT[item.accent] }}
            >
              <span>{item.title.slice(0, 1)}</span>
            </div>
          )}
        </div>

        <div className="lightbox__meta">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{item.category}</Badge>
            {item.placeholder ? <Badge>Awaiting artwork</Badge> : null}
          </div>
          <h3 className="font-display mt-3 text-xl font-semibold tracking-tight">{item.title}</h3>
          <p className="text-muted mt-2 text-sm leading-relaxed">{item.description}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {item.tools.map((tool) => (
              <li key={tool} className="chip">
                {tool}
              </li>
            ))}
          </ul>
          <p aria-live="polite" className="text-faint mt-4 text-xs tabular-nums">
            {index + 1} of {items.length}
          </p>
        </div>

        <div className="lightbox__controls">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close preview (Escape)"
            className="lightbox__btn"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous artwork"
                className="lightbox__btn"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next artwork"
                className="lightbox__btn"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
