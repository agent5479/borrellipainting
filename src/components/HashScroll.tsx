import { useLayoutEffect } from 'react'
import { Link, useLocation, type LinkProps } from 'react-router-dom'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToHash(hash: string, behavior?: ScrollBehavior) {
  if (!hash || hash === '#') return false
  const id = decodeURIComponent(hash.startsWith('#') ? hash.slice(1) : hash)
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({
    behavior: behavior ?? (prefersReducedMotion() ? 'auto' : 'smooth'),
    block: 'start',
  })
  return true
}

function hashFromTo(to: LinkProps['to']): string {
  if (typeof to === 'string') {
    const i = to.indexOf('#')
    return i === -1 ? '' : to.slice(i)
  }
  if (typeof to === 'object' && to && 'hash' in to && to.hash) {
    return to.hash.startsWith('#') ? to.hash : `#${to.hash}`
  }
  return ''
}

/** Scrolls to `#section` after route changes, including back/forward and first load. */
export function HashScroll() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) return

    if (scrollToHash(hash)) return

    let inner = 0
    const outer = requestAnimationFrame(() => {
      if (scrollToHash(hash)) return
      inner = requestAnimationFrame(() => {
        scrollToHash(hash)
      })
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [pathname, hash])

  return null
}

/** Link that still scrolls when the hash (or path+hash) is already the current URL. */
export function HashLink({ to, onClick, ...rest }: LinkProps) {
  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        const hash = hashFromTo(to)
        if (!hash) return
        requestAnimationFrame(() => scrollToHash(hash))
      }}
      {...rest}
    />
  )
}
