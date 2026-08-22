import { Search, X } from 'lucide-react'
import { useId } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  /** Visible label. Never omitted — a placeholder is not a label. */
  label: string
  placeholder?: string
  /** Live-region text, e.g. "12 of 32 shown". */
  resultSummary?: string
}

/**
 * Search field.
 *
 * Accessibility notes:
 *   • A real <label>, visually hidden but present. Placeholders disappear on the
 *     first keystroke, so they cannot do a label's job.
 *   • `type="search"` gets the platform's clear affordance and keyboard.
 *   • The result count lives in an `aria-live="polite"` region so filtering is
 *     announced instead of silently changing the page under a screen reader.
 *   • The clear button is only rendered when there is something to clear, and it
 *     is a button — not an icon with a click handler.
 */
export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
  resultSummary,
}: SearchInputProps) {
  const id = useId()

  return (
    <div className="w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="panel flex items-center gap-2 px-4 py-2.5 focus-within:border-[var(--c-accent)]">
        <Search aria-hidden="true" className="text-faint size-4 shrink-0" />
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="placeholder:text-faint w-full bg-transparent text-sm outline-none"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-faint hover:text-ink rounded-full p-1 transition-colors"
          >
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">Clear search</span>
          </button>
        ) : null}
      </div>
      <p aria-live="polite" className="text-faint mt-2 min-h-5 text-xs">
        {resultSummary}
      </p>
    </div>
  )
}
