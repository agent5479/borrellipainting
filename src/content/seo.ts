import { FACEBOOK_URL, FOUNDER, PHONE_TEL, SITE_NAME, SITE_URL, absoluteUrl } from './site'

export interface PageSeo {
  path: string
  title: string
  description: string
  ogType?: 'website' | 'article'
  robots?: string
}

export const PAGES: Record<string, PageSeo> = {
  '/': {
    path: '/',
    title: 'House Painter Golden Bay & Tākaka | Borrelli Painting',
    description:
      'Local house painter in Golden Bay — interiors, exteriors, weatherboards and character homes across Tākaka, Pōhara and Collingwood. Call Luca Borrelli for an on-site quote.',
  },
  '/estimates': {
    path: '/estimates',
    title: 'Painting estimates | Borrelli Painting',
    description:
      'Indoor and exterior ballpark estimate calculators for Golden Bay painting. Impression only — Luca confirms the real quote on site.',
  },
  '/estimates/indoor': {
    path: '/estimates/indoor',
    title: 'Indoor rooms calculator | Borrelli Painting',
    description:
      'Indoor room calculator — walls, ceilings, skirting, windows and trim for a Golden Bay ballpark figure. Impression only — not a confirmed quote.',
  },
  '/estimates/exterior': {
    path: '/estimates/exterior',
    title: 'Weatherboards, corrugate & roof calculator | Borrelli Painting',
    description:
      'Exterior calculator for weatherboards, corrugated cladding and roof iron. Corrugation, pitch and extra labour built in. Impression only.',
  },
  '/office': {
    path: '/office',
    title: 'Quote builder | Borrelli Painting',
    description: 'Internal quote builder for Borrelli Painting.',
    robots: 'noindex,nofollow',
  },
}

const NOT_FOUND: PageSeo = {
  path: '/404',
  title: 'Page not found | Borrelli Painting',
  description: 'That page does not exist on the Borrelli Painting site.',
  robots: 'noindex,follow',
}

export function seoFor(path: string): PageSeo {
  return PAGES[path] ?? { ...NOT_FOUND, path }
}

export function jsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HousePainter',
    name: SITE_NAME,
    alternateName: ['Luca Borrelli', FOUNDER, 'Borrelli Painting Golden Bay'],
    description:
      'Interior and exterior house painting across Golden Bay, Tākaka, Pōhara and Collingwood. On-site quotes with Gianluca (Luca) Borrelli.',
    url: `${SITE_URL}/`,
    image: [ogImageUrl(), iconUrl()],
    logo: iconUrl(),
    founder: { '@type': 'Person', name: FOUNDER, alternateName: 'Luca Borrelli' },
    telephone: PHONE_TEL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tākaka',
      addressRegion: 'Tasman',
      addressCountry: 'NZ',
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Golden Bay',
        containedInPlace: { '@type': 'AdministrativeArea', name: 'Tasman, New Zealand' },
      },
      { '@type': 'City', name: 'Tākaka' },
      { '@type': 'City', name: 'Pōhara' },
      { '@type': 'City', name: 'Collingwood' },
    ],
    serviceType: [
      'Interior painting',
      'Exterior painting',
      'Weatherboard painting',
      'Roof painting',
      'Character home painting',
      'Timber window restoration',
    ],
    knowsAbout: [
      'house painter Golden Bay',
      'painter Tākaka',
      'exterior house painting',
      'interior house painting',
    ],
    sameAs: [FACEBOOK_URL],
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
  const isPublic = path in PAGES && !(page.robots ?? '').includes('noindex')
  const url = absoluteUrl(path in PAGES ? page.path : '/')
  const image = ogImageUrl()
  const robots = page.robots ?? 'index,follow'
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    isPublic ? `<link rel="canonical" href="${url}" />` : null,
    `<meta name="author" content="${escapeHtml(FOUNDER)}" />`,
    `<meta name="geo.region" content="NZ-TAS" />`,
    `<meta name="geo.placename" content="Golden Bay, Tākaka" />`,
    `<meta property="og:type" content="${page.ogType ?? 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="en_NZ" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="Freshly painted weatherboard house by Borrelli Painting in Golden Bay" />`,
    `<meta property="og:image:width" content="960" />`,
    `<meta property="og:image:height" content="640" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    path === '/' ? `<script type="application/ld+json">${jsonLd()}</script>` : null,
  ].filter(Boolean)
  return tags.join('\n    ')
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
