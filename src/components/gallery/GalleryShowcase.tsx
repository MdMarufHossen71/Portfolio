import { Expand } from 'lucide-react'
import { useMemo, useState } from 'react'
import { GALLERY_COUNT, galleryCategories, galleryItems } from '../../data/gallery'
import { ACCENT_GRADIENT } from '../../lib/accents'
import type { GalleryItem } from '../../types/content'
import { Badge } from '../ui/Badge'
import { Chip } from '../ui/Chip'
import { EmptyState } from '../ui/EmptyState'
import { Section } from '../ui/Section'
import { Lightbox } from './Lightbox'

/**
 * Design showcase grid.
 *
 * Thumbnails open the accessible `Lightbox`; the grid itself stays honest —
 * every entry is flagged while it still awaits finished artwork, and the
 * section intro says so in plain words. Category chips derive from the items,
 * and the result count is announced through an `aria-live` region.
 */
export function GalleryShowcase() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const visible = useMemo(
    () =>
      activeCategory === null
        ? galleryItems
        : galleryItems.filter((i) => i.category === activeCategory),
    [activeCategory],
  )

  return (
    <Section
      id="gallery"
      eyebrow="Design showcase"
      title="Selected visual work"
      intro="A dedicated space for design pieces — logos, social sets, illustrations. Slots are staged and labelled while finished artwork is prepared."
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-faint mr-1 text-xs tracking-[0.14em] uppercase">Category</span>
        {galleryCategories.map((category) => (
          <Chip
            key={category}
            label={category}
            count={galleryItems.filter((i) => i.category === category).length}
            active={activeCategory === category}
            onToggle={() => setActiveCategory((c) => (c === category ? null : category))}
          />
        ))}
        {activeCategory !== null ? (
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="btn btn--quiet !px-3 !py-1.5 !text-sm"
          >
            Clear
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="text-faint mt-3 text-xs">
        {visible.length} of {GALLERY_COUNT} pieces shown
      </p>

      {visible.length > 0 ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onOpen={() =>
                setLightboxIndex(galleryItems.findIndex((entry) => entry.id === item.id))
              }
            />
          ))}
        </ul>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="Nothing in that category yet"
            description="Clear the filter to see every staged slot."
            action={
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="btn btn--ghost"
              >
                Clear filter
              </button>
            }
          />
        </div>
      )}

      {lightboxIndex !== null && lightboxIndex >= 0 ? (
        <Lightbox
          items={galleryItems}
          index={lightboxIndex}
          onSelect={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </Section>
  )
}

function GalleryCard({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  return (
    <li className="panel panel--interactive group flex flex-col overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Preview ${item.title} (${item.category})`}
        className="relative block aspect-[4/3] w-full overflow-hidden text-left"
      >
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-display grid h-full w-full place-items-center text-5xl font-bold text-[var(--c-on-accent)] transition-transform duration-300 group-hover:scale-[1.03]"
            style={{ background: ACCENT_GRADIENT[item.accent], opacity: 0.9 }}
          >
            {item.title.slice(0, 1)}
          </span>
        )}
        <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full border border-[var(--c-line)] bg-[color-mix(in_oklab,var(--c-bg)_70%,transparent)] backdrop-blur-md">
          <Expand aria-hidden="true" className="size-4" />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{item.category}</Badge>
          {item.placeholder ? <Badge>Awaiting artwork</Badge> : null}
        </div>
        <h3 className="font-display mt-3 text-base font-semibold tracking-tight">{item.title}</h3>
        <p className="text-muted mt-1.5 flex-1 text-sm leading-relaxed">{item.description}</p>
        <p className="text-faint mt-3 text-xs">{item.tools.join(' · ')}</p>
      </div>
    </li>
  )
}
