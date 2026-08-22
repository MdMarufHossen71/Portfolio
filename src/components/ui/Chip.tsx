interface ChipProps {
  label: string
  /** Item count shown after the label, when known. */
  count?: number
  active: boolean
  onToggle: () => void
}

/**
 * Filter chip.
 *
 * A real <button> with `aria-pressed`, not a checkbox styled as a pill: pressed
 * state is exactly what `aria-pressed` describes, and it keeps the control
 * operable by keyboard and announced correctly without extra wiring.
 *
 * The count is inside the button's accessible name on purpose — "Puzzle, 11 items"
 * is more useful than a bare number floating beside the label. It is split into a
 * screen-reader phrase and an `aria-hidden` digit rather than one shared node,
 * because a lone number appended to the label announces as "Puzzle11".
 */
export function Chip({ label, count, active, onToggle }: ChipProps) {
  return (
    <button type="button" className="chip" aria-pressed={active} onClick={onToggle}>
      <span>{label}</span>
      {count === undefined ? null : (
        <>
          <span className="sr-only">, {count === 1 ? '1 item' : `${count} items`}</span>
          <span aria-hidden="true" className="text-faint text-[0.6875rem] tabular-nums">
            {count}
          </span>
        </>
      )}
    </button>
  )
}
