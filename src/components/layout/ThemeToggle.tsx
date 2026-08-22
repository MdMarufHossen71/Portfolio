import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../lib/themeContext'

/**
 * Theme toggle.
 *
 * The accessible name states the *action* ("Switch to light theme"), not the
 * current state — a button named "Dark theme" leaves a screen-reader user
 * guessing whether pressing it turns dark on or off.
 *
 * Both icons are rendered and cross-faded so the button never changes size
 * mid-interaction and the pointer does not slip off it.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const goingTo = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${goingTo} theme`}
      className="text-muted hover:text-ink relative grid size-10 place-items-center rounded-full border border-[var(--c-line)] bg-[var(--c-glass-1)] transition-colors hover:border-[var(--c-line-strong)]"
    >
      <Sun
        aria-hidden="true"
        className={`absolute size-[18px] transition-all duration-300 ${
          theme === 'dark' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      />
      <Moon
        aria-hidden="true"
        className={`absolute size-[18px] transition-all duration-300 ${
          theme === 'dark' ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
        }`}
      />
      <span className="sr-only">Switch to {goingTo} theme</span>
    </button>
  )
}
