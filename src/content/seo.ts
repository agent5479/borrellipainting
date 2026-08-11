import { FACEBOOK_URL, FOUNDER, SITE_NAME, SITE_URL, absoluteUrl } from './site'

export interface PageSeo {
  path: string
  title: string
  description: string
  ogType?: 'website' | 'article'
}

export const PAGES: Record<string, PageSeo> = {
  '/': {
    path: '/',
    title: 'Borrelli Painting · Gianluca Borrelli | Golden Bay painter',
    description:
      'Borrelli Painting — Gianluca (Luca) Borrelli. Interior and exterior painting across Tākaka, Pōhara, Collingwood and Golden Bay. Ballpark quotes and quality finishes.',
  },
  '/quote/freshcoat': {
    path: '/quote/freshcoat',
    title: 'Fresh Coat ballpark quote | Borrelli Painting',
    description:
      'Step-through wall sizes, indoor or outdoor, paint system and a Golden Bay ballpark figure. One of two quote layouts from Borrelli Painting.',
  },
  '/quote/paintboard': {
    path: '/quote/paintboard',
    title: 'Paint Board ballpark quote | Borrelli Painting',
    description:
      'Pin wall cards and paint chips with a live ballpark column. Same quote math as Fresh Coat — a different layout from Borrelli Painting.',
  },
}

export function seoFor(path: string): PageSeo {
  return PAGES[path] ?? PAGES['/']
}

export function jsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HousePainter',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    image: [ogImageUrl(), iconUrl()],
    logo: iconUrl(),
    founder: { '@type': 'Person', name: FOUNDER },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Golden Bay',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Tasman, New Zealand' },
    },
    sameAs: [FACEBOOK_URL],
    telephone: '+64-22-086-1842',
  }
  return JSON.stringify(data)
}

/** Absolute OG image URL (painted house). */
export function ogImageUrl(): string {
  return `${SITE_URL}/images/gallery/exteriors/painted-house.jpg`
}

/** Square brand mark for search / social fallbacks that prefer icons. */
export function iconUrl(): string {
  return `${SITE_URL}/icon-192.png`
}

export function renderHead(path: string): string {
  const page = seoFor(path)
  const url = absoluteUrl(page.path)
  const image = ogImageUrl()
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="index,follow" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.ogType ?? 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="en_NZ" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${jsonLd()}</script>`,
  ]
  return tags.join('\n    ')
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
