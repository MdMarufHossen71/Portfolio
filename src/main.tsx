import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted variable fonts. Bundled rather than pulled from a CDN so the site
// makes no third-party request to render text.
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'

import './styles/index.css'
import { App } from './App'
import { restoreSpaRedirect } from './lib/spaRedirect'

// Must run before the router reads window.location.
restoreSpaRedirect()

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
