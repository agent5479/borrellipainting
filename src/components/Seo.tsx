import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { seoFor } from '../content/seo'

export function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const page = seoFor(pathname)
    document.title = page.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', page.description)
  }, [pathname])
  return null
}
