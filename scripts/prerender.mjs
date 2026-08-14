import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const template = readFileSync(join(root, 'dist/index.html'), 'utf8')
const serverEntry = join(root, 'dist/server/entry-server.js')
const { render } = await import(pathToFileURL(serverEntry).href)

const SITE = 'https://borrellipainting.nz'

const routes = [{ path: '/', file: 'dist/index.html' }]

for (const route of routes) {
  const { html, head } = render(route.path)
  const page = template
    .replace(/<title>[^<]*<\/title>\s*/i, '')
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html)
  const out = join(root, route.file)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, page)
  console.log(`prerendered ${route.path} → ${route.file}`)
}

// SPA shell for unknown paths on GitHub Pages — noindex so soft 404s stay out of search.
const notFound = render('/__not_found__')
const notFoundPage = template
  .replace(/<title>[^<]*<\/title>\s*/i, '')
  .replace('<!--app-head-->', notFound.head)
  .replace('<!--app-html-->', notFound.html)
writeFileSync(join(root, 'dist/404.html'), notFoundPage)
console.log('wrote dist/404.html (noindex)')

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
writeFileSync(join(root, 'dist/sitemap.xml'), sitemap)
console.log('wrote dist/sitemap.xml')

rmSync(join(root, 'dist/server'), { recursive: true, force: true })
console.log('prerender done')
