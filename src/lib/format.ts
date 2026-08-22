/**
 * Formats an ISO `YYYY-MM-DD` date for display.
 *
 * Pinned to UTC deliberately. A bare date string is parsed as midnight UTC, so
 * formatting it in a negative-offset timezone would render the *previous* day —
 * a post dated the 5th showing as the 4th for readers in the Americas.
 */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/** Joins parts with a middot, skipping empties so no stray separators appear. */
export function metaLine(...parts: Array<string | number | false | null | undefined>): string {
  return parts.filter(Boolean).join(' · ')
}
