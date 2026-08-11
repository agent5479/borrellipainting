import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import { renderHead } from './content/seo'

export function render(path: string) {
  const html = renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>,
  )
  return { html, head: renderHead(path) }
}
