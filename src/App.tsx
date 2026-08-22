import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { BASE_URL } from './config/site'
import { ThemeProvider } from './lib/theme'
import { About } from './pages/About'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Games } from './pages/Games'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Projects } from './pages/Projects'
import { Tools } from './pages/Tools'

/**
 * Router.
 *
 * `basename` comes from Vite's `BASE_URL`, which is set once by `VITE_BASE_PATH`
 * at build time. That single knob is what lets the same source serve from
 * `https://mdmarufhossen.link/` and from `https://<user>.github.io/Portfolio/`
 * without editing a single link — every route below stays written as a plain
 * site-root path.
 *
 * Trailing slash is trimmed because React Router wants `/Portfolio`, not
 * `/Portfolio/`, while Vite's BASE_URL always ends in a slash.
 *
 * `Layout` is a pathless parent route rather than a wrapper around `<Routes>`, so
 * the shell stays mounted across navigations — the header, the ambient background
 * and the theme all survive a route change instead of remounting.
 *
 * Routes are eagerly imported. The whole site is a handful of small pages and one
 * bundle of markdown; code-splitting six routes would trade a fast first paint for
 * a spinner on every click.
 */
const basename = BASE_URL.replace(/\/+$/, '')

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tools" element={<Tools />} />
            <Route path="games" element={<Games />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            {/* Catch-all inside the layout, so a 404 still has the site's nav. */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
