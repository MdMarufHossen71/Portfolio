import { Outlet } from 'react-router-dom'
import { siteJsonLd, useJsonLd } from '../../lib/seo'
import { AmbientBackground } from '../visuals/AmbientBackground'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'
import { SkipLink } from './SkipLink'

/**
 * App shell shared by every route.
 *
 * `<main id="main" tabIndex={-1}>` is the target for both the skip link and the
 * post-navigation focus move in `ScrollToTop`. `tabIndex={-1}` makes it focusable
 * programmatically without adding a tab stop.
 *
 * Site-level structured data is injected here, once, rather than per page — it
 * describes the person and the site, which do not change between routes.
 */
export function Layout() {
  useJsonLd('site-jsonld', siteJsonLd())

  return (
    <>
      <SkipLink />
      <AmbientBackground />
      <ScrollToTop />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <Header />
        <main id="main" tabIndex={-1} className="shell flex-1 focus-visible:outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
