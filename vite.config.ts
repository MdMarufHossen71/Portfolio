import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Public base path.
 *
 * Single knob for every deploy target — nothing else in the codebase hardcodes a
 * path prefix. Router `basename`, asset URLs and the SPA fallback all derive from
 * `import.meta.env.BASE_URL`, which Vite populates from this value.
 *
 *   custom domain (mdmarufhossen.link) → "/"          (default)
 *   GitHub Pages project site          → "/Portfolio/"
 *   Vercel / Netlify                   → "/"          (default)
 *
 * Override without editing this file:  VITE_BASE_PATH=/Portfolio/ npm run build
 */
const basePath = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    target: 'es2022',
    // Keep the production bundle free of absolute local filesystem paths.
    sourcemap: false,
    cssMinify: true,
    reportCompressedSize: true,
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
})
