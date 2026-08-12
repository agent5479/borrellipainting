export type DemoImageId = 'freshcoat' | 'paintboard'

const CARD_WIDTHS = [480, 800, 1200] as const
const TILE_WIDTHS = [360, 720] as const
export const DEMO_TILE_COUNT = 4

export function demoAssetBase(id: DemoImageId): string {
  return `${import.meta.env.BASE_URL}images/demos/${id}`
}

function srcset(base: string, kind: string, widths: readonly number[], ext: 'jpg' | 'webp') {
  return widths.map((w) => `${base}/${kind}-${w}.${ext} ${w}w`).join(', ')
}

export function demoCardSources(id: DemoImageId, base = demoAssetBase(id)) {
  return {
    webpSrcSet: srcset(base, 'card', CARD_WIDTHS, 'webp'),
    jpgSrcSet: srcset(base, 'card', CARD_WIDTHS, 'jpg'),
    fallback: `${base}/card-800.jpg`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 360px',
    width: 800,
    height: 533,
  }
}

export function demoTileSources(id: DemoImageId, index: number, base = demoAssetBase(id)) {
  const kind = `tile-${index}`
  return {
    webpSrcSet: srcset(base, kind, TILE_WIDTHS, 'webp'),
    jpgSrcSet: srcset(base, kind, TILE_WIDTHS, 'jpg'),
    fallback: `${base}/${kind}-720.jpg`,
    sizes: '(max-width: 640px) 45vw, (max-width: 1100px) 22vw, 250px',
    width: 720,
    height: 720,
  }
}

export function demoTileList(id: DemoImageId, base = demoAssetBase(id)) {
  return Array.from({ length: DEMO_TILE_COUNT }, (_, i) => demoTileSources(id, i, base))
}

export const DEMO_META: Record<DemoImageId, { title: string; alt: string }> = {
  freshcoat: { title: 'Indoor walls & ceilings', alt: 'Interior wall being painted with a roller' },
  paintboard: {
    title: 'Weatherboards, corrugate & roof',
    alt: 'Exterior weatherboards mid-paint job',
  },
}
