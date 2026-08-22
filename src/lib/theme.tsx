import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { site } from '../config/site'
import { THEME_STORAGE_KEY, ThemeContext } from './themeContext'
import type { Theme, ThemeContextValue } from './themeContext'

/**
 * Theme provider.
 *
 * Design notes:
 *   • Dark is the default identity, but light is a real, fully-tokenised palette
 *     rather than an afterthought.
 *   • The choice persists in localStorage under the same key the inline script in
 *     `index.html` reads, so there is no flash of the wrong theme on reload.
 *   • Until the visitor makes an explicit choice, the OS preference is followed
 *     live — flipping the system setting flips the site.
 *   • Every read/write of storage is guarded: private-mode browsers throw on
 *     `localStorage` access, and that must not take the site down.
 */

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Theme | null>(() => readStoredTheme())
  const [system, setSystem] = useState<Theme>(() => systemTheme())

  const theme: Theme = stored ?? system

  // Follow the OS while no explicit choice has been made.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (event: MediaQueryListEvent) => setSystem(event.matches ? 'light' : 'dark')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Reflect the theme onto the document and the browser chrome.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta) {
      meta.content = theme === 'light' ? site.themeColorLight : site.themeColorDark
    }
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setStored(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage unavailable (private mode, blocked cookies). The choice still
      // applies for this session; it simply will not survive a reload.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme, isSystem: stored === null }),
    [theme, setTheme, toggleTheme, stored],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
