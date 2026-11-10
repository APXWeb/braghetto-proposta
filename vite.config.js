import { defineConfig } from 'vite'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

// Preenche cada {{chave}} dos HTML com os blocos de src/render.js (que lê src/data/*).
// Os dados são reimportados a cada requisição, então edições aparecem no dev sem reiniciar.
function siteData() {
  const renderUrl = pathToFileURL(resolve('src/render.js')).href
  return {
    name: 'site-data',
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        const { blocks } = await import(`${renderUrl}?t=${Date.now()}`)
        const page = ctx.path.replace(/^\//, '') || 'index.html'
        const map = blocks(page)
        return html.replace(/\{\{([\w-]+)\}\}/g, (_, key) => {
          if (!(key in map)) throw new Error(`${page} usa {{${key}}}, que não existe em src/render.js`)
          return map[key]
        })
      },
    },
    async generateBundle() {
      const { sitemap, robots } = await import(`${renderUrl}?t=${Date.now()}`)
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots() })
    },
    handleHotUpdate({ file, server }) {
      if (/src[\\/](data[\\/]|render\.js)/.test(file)) server.ws.send({ type: 'full-reload' })
    },
  }
}

// Pré-carrega as fontes da abertura para o título não trocar de face depois do primeiro desenho.
function preloadFonts() {
  return {
    name: 'preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const files = Object.keys(ctx.bundle).filter((f) =>
          /(vollkorn-latin-wght-normal|vollkorn-latin-wght-italic|instrument-sans-latin-wght-normal)-.*\.woff2$/.test(f),
        )
        const tags = files.map((f) => `  <link rel="preload" as="font" type="font/woff2" href="./${f}" crossorigin>\n`).join('')
        return html.replace('</head>', `${tags}</head>`)
      },
    },
  }
}

export default defineConfig({
  // Base relativa: o build funciona em /, em /<repo>/ no GitHub Pages ou em qualquer subpasta.
  base: './',
  plugins: [siteData(), preloadFonts()],
  server: { port: 5194 },
  preview: { port: 4181 },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        cardapio: resolve('cardapio.html'),
        encomendas: resolve('encomendas.html'),
      },
    },
  },
})
