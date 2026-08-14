import { catalogById, UNIT_LABELS, type CatalogUnit } from './quoteCatalog'

export interface QuoteLine {
  id: string
  /** Catalog id, or empty for custom lines. */
  catalogId: string
  description: string
  unit: CatalogUnit | string
  qty: number
  unitPrice: number
}

export interface QuoteClient {
  name: string
  phone: string
  email: string
  address: string
}

export interface QuoteDraft {
  id: string
  updatedAt: string
  quoteNumber: string
  quoteDate: string
  title: string
  notes: string
  client: QuoteClient
  lines: QuoteLine[]
  includeGst: boolean
}

export interface QuoteSettings {
  gstNumber: string
  businessEmail: string
  bankDetails: string
  paymentNotes: string
  validityDays: number
}

const DRAFTS_KEY = 'bp-quote-drafts-v1'
const SETTINGS_KEY = 'bp-quote-settings-v1'
const GST_RATE = 0.15

export function newLineId(): string {
  return `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function newDraftId(): string {
  return `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function makeQuoteNumber(date = todayIsoDate()): string {
  const stamp = date.replaceAll('-', '')
  const seq = Math.floor(Math.random() * 90 + 10)
  return `BP-${stamp}-${seq}`
}

export function emptyClient(): QuoteClient {
  return { name: '', phone: '', email: '', address: '' }
}

export function createEmptyDraft(partial?: Partial<QuoteDraft>): QuoteDraft {
  const date = partial?.quoteDate ?? todayIsoDate()
  return {
    id: partial?.id ?? newDraftId(),
    updatedAt: new Date().toISOString(),
    quoteNumber: partial?.quoteNumber ?? makeQuoteNumber(date),
    quoteDate: date,
    title: partial?.title ?? '',
    notes: partial?.notes ?? '',
    client: partial?.client ?? emptyClient(),
    lines: partial?.lines ?? [],
    includeGst: partial?.includeGst ?? true,
  }
}

export function lineFromCatalog(
  catalogId: string,
  unitPrice: number,
  qty = 1,
  descriptionOverride?: string,
): QuoteLine | null {
  const item = catalogById(catalogId)
  if (!item) return null
  return {
    id: newLineId(),
    catalogId: item.id,
    description: descriptionOverride?.trim() || item.name,
    unit: item.unit,
    qty,
    unitPrice,
  }
}

export function customLine(
  description: string,
  unit: string,
  unitPrice: number,
  qty = 1,
): QuoteLine {
  return {
    id: newLineId(),
    catalogId: '',
    description: description.trim() || 'Custom item',
    unit: unit.trim() || 'each',
    qty,
    unitPrice,
  }
}

export function lineTotal(line: QuoteLine): number {
  const qty = Number.isFinite(line.qty) ? line.qty : 0
  const price = Number.isFinite(line.unitPrice) ? line.unitPrice : 0
  return Math.round(qty * price * 100) / 100
}

export function quoteSubtotal(lines: QuoteLine[]): number {
  return Math.round(lines.reduce((sum, line) => sum + lineTotal(line), 0) * 100) / 100
}

export function quoteGst(subtotal: number, includeGst: boolean): number {
  if (!includeGst) return 0
  return Math.round(subtotal * GST_RATE * 100) / 100
}

export function quoteGrandTotal(lines: QuoteLine[], includeGst: boolean): number {
  const sub = quoteSubtotal(lines)
  return Math.round((sub + quoteGst(sub, includeGst)) * 100) / 100
}

export function formatMoney(n: number): string {
  return n.toLocaleString('en-NZ', { style: 'currency', currency: 'NZD' })
}

export function unitLabel(unit: string): string {
  if (unit in UNIT_LABELS) return UNIT_LABELS[unit as CatalogUnit]
  return unit
}

export function defaultSettings(): QuoteSettings {
  return {
    gstNumber: '',
    businessEmail: '',
    bankDetails: '',
    paymentNotes: 'Payment due on invoice unless otherwise agreed. Quote valid as noted.',
    validityDays: 30,
  }
}

export function loadSettings(): QuoteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings()
    const parsed = JSON.parse(raw) as Partial<QuoteSettings>
    return { ...defaultSettings(), ...parsed }
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(settings: QuoteSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadDrafts(): QuoteDraft[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as QuoteDraft[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((d) => d && typeof d.id === 'string' && Array.isArray(d.lines))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  } catch {
    return []
  }
}

export function saveDraft(draft: QuoteDraft): QuoteDraft[] {
  const next: QuoteDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
    client: { ...draft.client },
    lines: draft.lines.map((l) => ({ ...l })),
  }
  const others = loadDrafts().filter((d) => d.id !== next.id)
  const all = [next, ...others].slice(0, 40)
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(all))
  return all
}

export function deleteDraft(id: string): QuoteDraft[] {
  const all = loadDrafts().filter((d) => d.id !== id)
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(all))
  return all
}

export function duplicateDraft(draft: QuoteDraft): QuoteDraft {
  return createEmptyDraft({
    ...draft,
    id: newDraftId(),
    quoteNumber: makeQuoteNumber(),
    quoteDate: todayIsoDate(),
    title: draft.title ? `${draft.title} (copy)` : '',
    lines: draft.lines.map((l) => ({ ...l, id: newLineId() })),
  })
}
