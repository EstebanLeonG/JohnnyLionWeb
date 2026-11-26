import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Precarga la miniatura del reel para que aparezca antes de que arranque React.
function reelPosterPreload(): Plugin {
  return {
    name: 'reel-poster-preload',
    transformIndexHtml() {
      try {
        const videos = JSON.parse(readFileSync('src/data/videos.json', 'utf8')) as Array<{ category: string; thumbnail?: string }>
        const thumbnail = videos.find((v) => v.category === 'reel')?.thumbnail
        if (!thumbnail) return []
        return [{
          tag: 'link',
          attrs: { rel: 'preload', as: 'image', href: `${thumbnail}_1280x720`, fetchpriority: 'high' },
          injectTo: 'head',
        }]
      } catch {
        return []
      }
    },
  }
}

// Agrega canonical/og:url/og:image absolutos y genera robots.txt + sitemap.xml
// cuando VITE_SITE_URL está definida (ej: https://johnnyleon.com).
function seo(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/+$/, '')
  return {
    name: 'seo',
    transformIndexHtml() {
      if (!base) return []
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: `${base}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:url', content: `${base}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: `${base}/og-image.jpg` }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${base}/og-image.jpg` }, injectTo: 'head' },
      ]
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', base && `Sitemap: ${base}/sitemap.xml`].filter(Boolean).join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` })
      if (base) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n</urlset>\n`,
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    base: env.VITE_BASE || '/',
    plugins: [react(), reelPosterPreload(), seo(env.VITE_SITE_URL ?? '')],
  }
})
