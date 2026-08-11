import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './styles/site.css'
import './styles/quotes.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined
const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Missing #root')

const tree = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, tree)
} else {
  createRoot(rootEl).render(tree)
}
