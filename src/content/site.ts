export const SITE_URL = 'https://borrellipainting.nz'
export const SITE_NAME = 'Borrelli Painting'
export const FOUNDER = 'Gianluca Borrelli'
export const PHONE_DISPLAY = '022 086 1842'
export const PHONE_TEL = '+64220861842'
export const FACEBOOK_URL = 'https://www.facebook.com/borrellipainting'
export const AREA = 'Golden Bay, Tasman, New Zealand'

export function asset(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}

export function absoluteUrl(path = '/'): string {
  const clean = path === '/' ? '/' : path.replace(/\/$/, '')
  return `${SITE_URL}${clean === '/' ? '/' : clean + '/'}`
}
