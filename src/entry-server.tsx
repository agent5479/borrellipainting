import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import { renderHead } from './content/seo'

const basename = '/borrellipainting'

export function render(path: string) {
  const location = path === '/' ? `${basename}/` : `${basename}${path}`
  const html = renderToString(
    <StaticRouter basename={basename} location={location}>
      <App />
    </StaticRouter>,
  )
  return { html, head: renderHead(path) }
}
