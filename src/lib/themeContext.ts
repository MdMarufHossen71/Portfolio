import { createContext, useContext } from 'react'

export type Theme = 'dark' | 'light'

/**
 * Must stay in sync with the inline no-flash script in `index.html`, which reads
 * the same key before first paint so the page never flashes the wrong palette.
 */
export const THEME_STORAGE_KEY = 'theme'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  /** True when the visitor has never chosen, so the OS preference still wins. */
  isSystem: boolean
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>')
  return value
}
