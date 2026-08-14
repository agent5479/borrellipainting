export type CatalogCategory = 'labour' | 'services' | 'equipment' | 'materials'

export type CatalogUnit = 'hour' | 'm2' | 'each' | 'L' | 'day' | 'job' | 'lm'

export interface CatalogItem {
  id: string
  category: CatalogCategory
  name: string
  blurb: string
  unit: CatalogUnit
  /** Default NZD unit price (GST-exclusive). */
  defaultPrice: number
}

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  labour: 'Labour',
  services: 'Services',
  equipment: 'Equipment',
  materials: 'Materials & paint',
}

export const UNIT_LABELS: Record<CatalogUnit, string> = {
  hour: 'hr',
  m2: 'm²',
  each: 'ea',
  L: 'L',
  day: 'day',
  job: 'job',
  lm: 'lm',
}

/** Seed catalog — edit prices in the tool; overrides live in localStorage. */
export const QUOTE_CATALOG: CatalogItem[] = [
  // Labour
  {
    id: 'lab-prep-hour',
    category: 'labour',
    name: 'Surface prep',
    blurb: 'Scraping, filling, sanding, and making good before paint.',
    unit: 'hour',
    defaultPrice: 65,
  },
  {
    id: 'lab-cut-in',
    category: 'labour',
    name: 'Cut-in (brush)',
    blurb: 'Edges, corners, trim lines, and detail brush work.',
    unit: 'hour',
    defaultPrice: 65,
  },
  {
    id: 'lab-roll-walls',
    category: 'labour',
    name: 'Roll interior walls',
    blurb: 'Standard acrylic walls — measured paintable area.',
    unit: 'm2',
    defaultPrice: 18,
  },
  {
    id: 'lab-roll-ceilings',
    category: 'labour',
    name: 'Roll ceilings',
    blurb: 'Overhead rolling — slower than walls.',
    unit: 'm2',
    defaultPrice: 22,
  },
  {
    id: 'lab-weatherboard',
    category: 'labour',
    name: 'Paint weatherboards',
    blurb: 'Timber cladding including laps and edges.',
    unit: 'm2',
    defaultPrice: 34,
  },
  {
    id: 'lab-corrugate-wall',
    category: 'labour',
    name: 'Paint corrugated cladding',
    blurb: 'Wall iron — ridges and slow going.',
    unit: 'm2',
    defaultPrice: 36,
  },
  {
    id: 'lab-roof',
    category: 'labour',
    name: 'Paint corrugated roof',
    blurb: 'Roof iron — pitch, height, and access included in rate.',
    unit: 'm2',
    defaultPrice: 45,
  },
  {
    id: 'lab-fascia',
    category: 'labour',
    name: 'Fascia / soffit / barge',
    blurb: 'Eaves and trim boards.',
    unit: 'lm',
    defaultPrice: 28,
  },
  {
    id: 'lab-doors-trim',
    category: 'labour',
    name: 'Doors, frames & trim',
    blurb: 'Hard-wearing enamel or acrylic on joinery.',
    unit: 'hour',
    defaultPrice: 70,
  },
  {
    id: 'lab-windows',
    category: 'labour',
    name: 'Window frames / sills',
    blurb: 'Timber or aluminium joinery touch-up and repaint.',
    unit: 'hour',
    defaultPrice: 70,
  },
  {
    id: 'lab-spot-prime',
    category: 'labour',
    name: 'Spot priming',
    blurb: 'Bare patches, repairs, and stain treatment.',
    unit: 'hour',
    defaultPrice: 65,
  },
  {
    id: 'lab-sanding',
    category: 'labour',
    name: 'Sanding between coats',
    blurb: 'Light de-nib and dust-down.',
    unit: 'hour',
    defaultPrice: 60,
  },
  {
    id: 'lab-spray',
    category: 'labour',
    name: 'Spray application',
    blurb: 'Airless spray labour (equipment charged separately).',
    unit: 'hour',
    defaultPrice: 75,
  },
  {
    id: 'lab-general',
    category: 'labour',
    name: 'General labour',
    blurb: 'Catch-all painter time on site.',
    unit: 'hour',
    defaultPrice: 65,
  },

  // Services
  {
    id: 'svc-site-visit',
    category: 'services',
    name: 'Site visit / measure-up',
    blurb: 'On-site assessment and confirmed scope.',
    unit: 'job',
    defaultPrice: 0,
  },
  {
    id: 'svc-setup',
    category: 'services',
    name: 'Setup & protection',
    blurb: 'Drop sheets, masking, furniture and floor protection.',
    unit: 'job',
    defaultPrice: 85,
  },
  {
    id: 'svc-travel',
    category: 'services',
    name: 'Travel — Golden Bay',
    blurb: 'Travel allowance within Golden Bay.',
    unit: 'job',
    defaultPrice: 35,
  },
  {
    id: 'svc-travel-far',
    category: 'services',
    name: 'Travel — extended',
    blurb: 'Further afield or multi-day travel.',
    unit: 'job',
    defaultPrice: 80,
  },
  {
    id: 'svc-wash',
    category: 'services',
    name: 'Wash-down / moss & mould treat',
    blurb: 'Exterior clean before paint.',
    unit: 'hour',
    defaultPrice: 55,
  },
  {
    id: 'svc-scaffold',
    category: 'services',
    name: 'Scaffolding coordination',
    blurb: 'Arrange and oversee hire (hire cost separate).',
    unit: 'job',
    defaultPrice: 120,
  },
  {
    id: 'svc-roof-access',
    category: 'services',
    name: 'Roof access surcharge',
    blurb: 'Extra for height, pitch, and safety setup.',
    unit: 'job',
    defaultPrice: 220,
  },
  {
    id: 'svc-window-clean',
    category: 'services',
    name: 'Window clean touch-up',
    blurb: 'Light clean after paint work.',
    unit: 'job',
    defaultPrice: 60,
  },
  {
    id: 'svc-rubbish',
    category: 'services',
    name: 'Rubbish & tidy-away',
    blurb: 'Remove paint waste and leave site tidy.',
    unit: 'job',
    defaultPrice: 45,
  },
  {
    id: 'svc-outdoor-surcharge',
    category: 'services',
    name: 'Exterior conditions surcharge',
    blurb: 'Weather, access, or complex exterior extras.',
    unit: 'job',
    defaultPrice: 150,
  },

  // Equipment
  {
    id: 'eq-ladder',
    category: 'equipment',
    name: 'Ladder / height access',
    blurb: 'Own ladders and basic height gear for the job.',
    unit: 'day',
    defaultPrice: 25,
  },
  {
    id: 'eq-spray',
    category: 'equipment',
    name: 'Airless spray setup',
    blurb: 'Spray unit, tips, and lines.',
    unit: 'day',
    defaultPrice: 120,
  },
  {
    id: 'eq-drop-sheets',
    category: 'equipment',
    name: 'Drop sheets & covers',
    blurb: 'Floor and furniture protection consumables.',
    unit: 'job',
    defaultPrice: 35,
  },
  {
    id: 'eq-masking',
    category: 'equipment',
    name: 'Masking tape & paper',
    blurb: 'Edges, glass, and fixtures.',
    unit: 'job',
    defaultPrice: 40,
  },
  {
    id: 'eq-scaffold-hire',
    category: 'equipment',
    name: 'Scaffold / tower hire (pass-through)',
    blurb: 'Placeholder — replace with actual hire quote.',
    unit: 'job',
    defaultPrice: 0,
  },
  {
    id: 'eq-pressure-washer',
    category: 'equipment',
    name: 'Pressure washer',
    blurb: 'Wash-down equipment.',
    unit: 'day',
    defaultPrice: 50,
  },
  {
    id: 'eq-sanders',
    category: 'equipment',
    name: 'Sanders & dust tools',
    blurb: 'Power sanding kit for prep.',
    unit: 'day',
    defaultPrice: 30,
  },

  // Materials & paint
  {
    id: 'mat-acrylic-std',
    category: 'materials',
    name: 'Standard acrylic (interior)',
    blurb: 'Everyday walls and ceilings.',
    unit: 'L',
    defaultPrice: 28,
  },
  {
    id: 'mat-acrylic-prem',
    category: 'materials',
    name: 'Premium / low-VOC acrylic',
    blurb: 'Higher hide and scrub resistance.',
    unit: 'L',
    defaultPrice: 48,
  },
  {
    id: 'mat-exterior',
    category: 'materials',
    name: 'Exterior weathercoat',
    blurb: 'UV and rain-ready exterior acrylic.',
    unit: 'L',
    defaultPrice: 42,
  },
  {
    id: 'mat-roof',
    category: 'materials',
    name: 'Roof coating',
    blurb: 'High-build roof paint for corrugate.',
    unit: 'L',
    defaultPrice: 55,
  },
  {
    id: 'mat-enamel',
    category: 'materials',
    name: 'Hard-wearing enamel',
    blurb: 'Doors, trims, wet areas.',
    unit: 'L',
    defaultPrice: 58,
  },
  {
    id: 'mat-sealer',
    category: 'materials',
    name: 'Acrylic sealer / undercoat',
    blurb: 'New gib, patches, colour change.',
    unit: 'L',
    defaultPrice: 32,
  },
  {
    id: 'mat-stainblock',
    category: 'materials',
    name: 'Stain blocker',
    blurb: 'Water marks, nicotine, tannin.',
    unit: 'L',
    defaultPrice: 52,
  },
  {
    id: 'mat-metal-primer',
    category: 'materials',
    name: 'Metal primer',
    blurb: 'Bare or rusty corrugate and roof iron.',
    unit: 'L',
    defaultPrice: 45,
  },
  {
    id: 'mat-filler',
    category: 'materials',
    name: 'Filler / spackle',
    blurb: 'Holes and surface repairs.',
    unit: 'each',
    defaultPrice: 18,
  },
  {
    id: 'mat-caulk',
    category: 'materials',
    name: 'Paintable caulk / sealant',
    blurb: 'Gaps, skirting, and exterior joints.',
    unit: 'each',
    defaultPrice: 14,
  },
  {
    id: 'mat-thinners',
    category: 'materials',
    name: 'Thinners / clean-up',
    blurb: 'Brush and tool clean-up.',
    unit: 'L',
    defaultPrice: 22,
  },
  {
    id: 'mat-sandpaper',
    category: 'materials',
    name: 'Abrasives & sanding discs',
    blurb: 'Consumable sanding pack.',
    unit: 'job',
    defaultPrice: 25,
  },
  {
    id: 'mat-brushes-rollers',
    category: 'materials',
    name: 'Brushes, rollers & sleeves',
    blurb: 'Job consumables.',
    unit: 'job',
    defaultPrice: 45,
  },
  {
    id: 'mat-misc',
    category: 'materials',
    name: 'Misc materials',
    blurb: 'Catch-all for small extras.',
    unit: 'job',
    defaultPrice: 30,
  },
]

const PRICES_KEY = 'bp-quote-prices-v1'

export function catalogById(id: string): CatalogItem | undefined {
  return QUOTE_CATALOG.find((item) => item.id === id)
}

export function loadPriceOverrides(): Record<string, number> {
  try {
    const raw = localStorage.getItem(PRICES_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const out: Record<string, number> = {}
    for (const [id, value] of Object.entries(parsed)) {
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
        out[id] = Math.round(value * 100) / 100
      }
    }
    return out
  } catch {
    return {}
  }
}

export function savePriceOverrides(overrides: Record<string, number>): void {
  localStorage.setItem(PRICES_KEY, JSON.stringify(overrides))
}

export function clearPriceOverrides(): void {
  localStorage.removeItem(PRICES_KEY)
}

export function unitPriceFor(item: CatalogItem, overrides: Record<string, number>): number {
  const override = overrides[item.id]
  if (typeof override === 'number' && Number.isFinite(override)) return override
  return item.defaultPrice
}

export function effectiveCatalog(overrides: Record<string, number> = loadPriceOverrides()) {
  return QUOTE_CATALOG.map((item) => ({
    ...item,
    unitPrice: unitPriceFor(item, overrides),
  }))
}
