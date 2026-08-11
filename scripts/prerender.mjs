import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const template = readFileSync(join(root, 'dist/index.html'), 'utf8')
const serverEntry = join(root, 'dist/server/entry-server.js')
const { render } = await import(pathToFileURL(serverEntry).href)

const SITE = 'https://borrellipainting.nz'

const routes = [
  { path: '/', file: 'dist/index.html' },
  { path: '/quote/freshcoat', file: 'dist/quote/freshcoat/index.html' },
  { path: '/quote/paintboard', file: 'dist/quote/paintboard/index.html' },
]

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

writeFileSync(join(root, 'dist/404.html'), readFileSync(join(root, 'dist/index.html'), 'utf8'))

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE}/quote/freshcoat/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE}/quote/paintboard/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`
writeFileSync(join(root, 'dist/sitemap.xml'), sitemap)
console.log('wrote dist/sitemap.xml')

rmSync(join(root, 'dist/server'), { recursive: true, force: true })
console.log('prerender done')
