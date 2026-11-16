import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev only: an in-memory stand-in for the Vercel function at /api/stats,
 * so the like button and visitor count work under plain `vite`.
 * Production (and `vercel dev`) use api/stats.ts with Upstash.
 */
const mockStats = (): Plugin => {
  const state = { views: 1204, likes: 87, liked: false }
  return {
    name: 'mock-api-stats',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/stats', (req, res) => {
        const reply = () => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(state))
        }
        if (req.method !== 'POST') return reply()
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', () => {
          const action = (() => {
            try {
              return JSON.parse(body).action
            } catch {
              return null
            }
          })()
          if (action === 'view') state.views += 1
          if (action === 'like' && !state.liked) Object.assign(state, { liked: true, likes: state.likes + 1 })
          if (action === 'unlike' && state.liked) Object.assign(state, { liked: false, likes: state.likes - 1 })
          reply()
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockStats()],
})
