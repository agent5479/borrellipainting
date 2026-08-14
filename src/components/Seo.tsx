import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl } from '../content/site'
import { seoFor } from '../content/seo'

function ensureMeta(attr: 'name' | 'property', key: string): HTMLMetaElement {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  return el
}

export function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const page = seoFor(pathname)
    const robots = page.robots ?? 'index,follow'
    const isPublic = !(robots.includes('noindex'))
    const url = absoluteUrl(isPublic ? pathname : '/')
    document.title = page.title

    ensureMeta('name', 'description').setAttribute('content', page.description)
    ensureMeta('name', 'robots').setAttribute('content', robots)

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!isPublic) {
      canonical?.remove()
    } else {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', absoluteUrl(pathname))
    }

    ensureMeta('property', 'og:title').setAttribute('content', page.title)
    ensureMeta('property', 'og:description').setAttribute('content', page.description)
    ensureMeta('property', 'og:url').setAttribute('content', url)
    ensureMeta('name', 'twitter:title').setAttribute('content', page.title)
    ensureMeta('name', 'twitter:description').setAttribute('content', page.description)
  }, [pathname])
  return null
}
