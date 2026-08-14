import { useMemo, useState } from 'react'
import { asset } from '../../content/site'
import {
  CATEGORY_LABELS,
  QUOTE_CATALOG,
  UNIT_LABELS,
  clearPriceOverrides,
  loadPriceOverrides,
  savePriceOverrides,
  unitPriceFor,
  type CatalogCategory,
  type CatalogUnit,
} from '../../shared/quoteCatalog'
import {
  createEmptyDraft,
  customLine,
  deleteDraft,
  duplicateDraft,
  formatMoney,
  lineFromCatalog,
  lineTotal,
  loadDrafts,
  loadSettings,
  quoteGrandTotal,
  quoteGst,
  quoteSubtotal,
  saveDraft,
  saveSettings,
  unitLabel,
  type QuoteDraft,
  type QuoteLine,
  type QuoteSettings,
} from '../../shared/quoteDraft'

type TabId = 'quote' | 'prices' | 'drafts' | 'settings'

interface QuotesBuilderProps {
  onLock: () => void
}

export function QuotesBuilder({ onLock }: QuotesBuilderProps) {
  const [tab, setTab] = useState<TabId>('quote')
  const [draft, setDraft] = useState<QuoteDraft>(() => createEmptyDraft())
  const [drafts, setDrafts] = useState<QuoteDraft[]>(() => loadDrafts())
  const [overrides, setOverrides] = useState<Record<string, number>>(() => loadPriceOverrides())
  const [settings, setSettings] = useState<QuoteSettings>(() => loadSettings())
  const [flash, setFlash] = useState('')
  const [category, setCategory] = useState<CatalogCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [customDesc, setCustomDesc] = useState('')
  const [customUnit, setCustomUnit] = useState<CatalogUnit | string>('each')
  const [customPrice, setCustomPrice] = useState('0')
  const [customQty, setCustomQty] = useState('1')
  const [pdfBusy, setPdfBusy] = useState(false)

  const catalog = useMemo(() => {
    const q = search.trim().toLowerCase()
    return QUOTE_CATALOG.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.blurb.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      )
    })
  }, [category, search])

  const subtotal = quoteSubtotal(draft.lines)
  const gst = quoteGst(subtotal, draft.includeGst)
  const total = quoteGrandTotal(draft.lines, draft.includeGst)

  function showFlash(message: string) {
    setFlash(message)
    window.setTimeout(() => setFlash(''), 2800)
  }

  function updateDraft(patch: Partial<QuoteDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  function updateClient<K extends keyof QuoteDraft['client']>(key: K, value: QuoteDraft['client'][K]) {
    setDraft((prev) => ({ ...prev, client: { ...prev.client, [key]: value } }))
  }

  function updateLine(id: string, patch: Partial<QuoteLine>) {
    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    }))
  }

  function removeLine(id: string) {
    setDraft((prev) => ({ ...prev, lines: prev.lines.filter((line) => line.id !== id) }))
  }

  function addCatalogItem(catalogId: string) {
    const item = QUOTE_CATALOG.find((c) => c.id === catalogId)
    if (!item) return
    const line = lineFromCatalog(catalogId, unitPriceFor(item, overrides), 1)
    if (!line) return
    setDraft((prev) => ({ ...prev, lines: [...prev.lines, line] }))
    showFlash(`Added ${item.name}`)
  }

  function addCustom() {
    const qty = Number(customQty) || 0
    const price = Number(customPrice) || 0
    const line = customLine(customDesc, customUnit, price, qty)
    setDraft((prev) => ({ ...prev, lines: [...prev.lines, line] }))
    setCustomDesc('')
    setCustomPrice('0')
    setCustomQty('1')
    showFlash('Added custom line')
  }

  function onSaveDraft() {
    const next = saveDraft(draft)
    setDrafts(next)
    showFlash('Draft saved on this browser')
  }

  function onNewQuote() {
    setDraft(createEmptyDraft())
    setTab('quote')
    showFlash('New quote started')
  }

  function onLoadDraft(id: string) {
    const found = drafts.find((d) => d.id === id)
    if (!found) return
    setDraft({
      ...found,
      client: { ...found.client },
      lines: found.lines.map((l) => ({ ...l })),
    })
    setTab('quote')
    showFlash('Draft loaded')
  }

  function onDuplicate(id: string) {
    const found = drafts.find((d) => d.id === id) ?? (draft.id === id ? draft : null)
    if (!found) return
    const copy = duplicateDraft(found)
    setDraft(copy)
    setDrafts(saveDraft(copy))
    setTab('quote')
    showFlash('Quote duplicated')
  }

  function onDeleteDraft(id: string) {
    setDrafts(deleteDraft(id))
    showFlash('Draft deleted')
  }

  function setPriceOverride(id: string, value: string) {
    const n = Number(value)
    const next = { ...overrides }
    const seed = QUOTE_CATALOG.find((c) => c.id === id)
    if (!seed || !Number.isFinite(n) || n < 0) return
    if (Math.abs(n - seed.defaultPrice) < 0.001) {
      delete next[id]
    } else {
      next[id] = Math.round(n * 100) / 100
    }
    setOverrides(next)
    savePriceOverrides(next)
  }

  function resetPrices() {
    clearPriceOverrides()
    setOverrides({})
    showFlash('Prices reset to defaults')
  }

  function onSaveSettings() {
    saveSettings(settings)
    showFlash('Settings saved')
  }

  async function onExportPdf() {
    setPdfBusy(true)
    try {
      const { exportQuotePdf } = await import('../../shared/quotePdf')
      await exportQuotePdf(draft, settings)
      showFlash('PDF downloaded')
    } catch {
      showFlash('PDF export failed')
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <>
      <header className="qt-header">
        <div className="qt-header-inner">
          <div className="qt-brand">
            <img src={asset('images/brand-logo.png')} alt="Borrelli Painting" width={180} height={72} />
            <div className="qt-brand-meta">
              <span className="qt-kicker">Internal</span>
              <strong>Quote builder</strong>
            </div>
          </div>
          <div className="qt-header-actions">
            <button type="button" className="qt-btn qt-btn-ghost" onClick={onNewQuote}>
              New
            </button>
            <button type="button" className="qt-btn qt-btn-ghost" onClick={onSaveDraft}>
              Save draft
            </button>
            <button type="button" className="qt-btn" onClick={onExportPdf} disabled={pdfBusy}>
              {pdfBusy ? 'Exporting…' : 'Export PDF'}
            </button>
            <button type="button" className="qt-btn qt-btn-ghost" onClick={onLock}>
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="qt-main">
        {flash ? <p className="qt-flash">{flash}</p> : null}

        <div className="qt-tabs" role="tablist" aria-label="Quotes sections">
          {(
            [
              ['quote', 'Quote'],
              ['prices', 'Prices'],
              ['drafts', 'Drafts'],
              ['settings', 'Settings'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="qt-tab"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'quote' ? (
          <>
            <section className="qt-panel">
              <h2>Client & quote</h2>
              <div className="qt-grid qt-grid-3">
                <div className="qt-field">
                  <label htmlFor="qt-number">Quote number</label>
                  <input
                    id="qt-number"
                    value={draft.quoteNumber}
                    onChange={(e) => updateDraft({ quoteNumber: e.target.value })}
                  />
                </div>
                <div className="qt-field">
                  <label htmlFor="qt-date">Date</label>
                  <input
                    id="qt-date"
                    type="date"
                    value={draft.quoteDate}
                    onChange={(e) => updateDraft({ quoteDate: e.target.value })}
                  />
                </div>
                <div className="qt-field">
                  <label htmlFor="qt-title">Job title</label>
                  <input
                    id="qt-title"
                    value={draft.title}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    placeholder="e.g. Weatherboards — Collingwood"
                  />
                </div>
                <div className="qt-field">
                  <label htmlFor="qt-client">Client name</label>
                  <input
                    id="qt-client"
                    value={draft.client.name}
                    onChange={(e) => updateClient('name', e.target.value)}
                  />
                </div>
                <div className="qt-field">
                  <label htmlFor="qt-phone">Phone</label>
                  <input
                    id="qt-phone"
                    value={draft.client.phone}
                    onChange={(e) => updateClient('phone', e.target.value)}
                  />
                </div>
                <div className="qt-field">
                  <label htmlFor="qt-email">Email</label>
                  <input
                    id="qt-email"
                    type="email"
                    value={draft.client.email}
                    onChange={(e) => updateClient('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="qt-grid" style={{ marginTop: '0.75rem' }}>
                <div className="qt-field">
                  <label htmlFor="qt-address">Job / postal address</label>
                  <input
                    id="qt-address"
                    value={draft.client.address}
                    onChange={(e) => updateClient('address', e.target.value)}
                  />
                </div>
                <div className="qt-field">
                  <label htmlFor="qt-notes">Notes on quote</label>
                  <textarea
                    id="qt-notes"
                    value={draft.notes}
                    onChange={(e) => updateDraft({ notes: e.target.value })}
                    placeholder="Scope notes, exclusions, timing…"
                  />
                </div>
                <label className="qt-check">
                  <input
                    type="checkbox"
                    checked={draft.includeGst}
                    onChange={(e) => updateDraft({ includeGst: e.target.checked })}
                  />
                  Include GST (15%)
                </label>
              </div>
            </section>

            <section className="qt-panel">
              <h2>Add from catalog</h2>
              <div className="qt-row" style={{ marginBottom: '0.75rem' }}>
                <div className="qt-field" style={{ flex: '1 1 180px' }}>
                  <label htmlFor="qt-search">Search</label>
                  <input
                    id="qt-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="walls, roof, primer…"
                  />
                </div>
                <div className="qt-field" style={{ flex: '0 1 180px' }}>
                  <label htmlFor="qt-cat">Category</label>
                  <select
                    id="qt-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CatalogCategory | 'all')}
                  >
                    <option value="all">All</option>
                    {(Object.keys(CATEGORY_LABELS) as CatalogCategory[]).map((key) => (
                      <option key={key} value={key}>
                        {CATEGORY_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="qt-catalog">
                {catalog.length === 0 ? (
                  <p className="qt-empty">No catalog matches.</p>
                ) : (
                  catalog.map((item) => (
                    <div key={item.id} className="qt-catalog-item">
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {CATEGORY_LABELS[item.category]} · {formatMoney(unitPriceFor(item, overrides))}/
                          {UNIT_LABELS[item.unit]} — {item.blurb}
                        </span>
                      </div>
                      <button type="button" className="qt-btn qt-btn-ghost" onClick={() => addCatalogItem(item.id)}>
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>

              <h3>Custom line</h3>
              <div className="qt-row">
                <div className="qt-field" style={{ flex: '2 1 200px' }}>
                  <label htmlFor="qt-cdesc">Description</label>
                  <input id="qt-cdesc" value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} />
                </div>
                <div className="qt-field" style={{ flex: '0 1 110px' }}>
                  <label htmlFor="qt-cunit">Unit</label>
                  <select id="qt-cunit" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)}>
                    {(Object.keys(UNIT_LABELS) as CatalogUnit[]).map((u) => (
                      <option key={u} value={u}>
                        {UNIT_LABELS[u]}
                      </option>
                    ))}
                    <option value="set">set</option>
                  </select>
                </div>
                <div className="qt-field" style={{ flex: '0 1 100px' }}>
                  <label htmlFor="qt-cqty">Qty</label>
                  <input id="qt-cqty" type="number" min={0} step="0.01" value={customQty} onChange={(e) => setCustomQty(e.target.value)} />
                </div>
                <div className="qt-field" style={{ flex: '0 1 120px' }}>
                  <label htmlFor="qt-cprice">Rate</label>
                  <input id="qt-cprice" type="number" min={0} step="0.01" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} />
                </div>
                <button type="button" className="qt-btn" onClick={addCustom} disabled={!customDesc.trim()}>
                  Add custom
                </button>
              </div>
            </section>

            <section className="qt-panel">
              <h2>Line items</h2>
              {draft.lines.length === 0 ? (
                <p className="qt-empty">No lines yet — add from the catalog or a custom line.</p>
              ) : (
                <div className="qt-table-wrap">
                  <table className="qt-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {draft.lines.map((line) => (
                        <tr key={line.id}>
                          <td>
                            <input
                              value={line.description}
                              onChange={(e) => updateLine(line.id, { description: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              value={line.unit}
                              onChange={(e) => updateLine(line.id, { unit: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={line.qty}
                              onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) || 0 })}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={line.unitPrice}
                              onChange={(e) =>
                                updateLine(line.id, { unitPrice: Number(e.target.value) || 0 })
                              }
                            />
                          </td>
                          <td className="num">{formatMoney(lineTotal(line))}</td>
                          <td>
                            <button
                              type="button"
                              className="qt-btn qt-btn-danger"
                              onClick={() => removeLine(line.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="qt-totals">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatMoney(subtotal)}</strong>
                </div>
                {draft.includeGst ? (
                  <div>
                    <span>GST (15%)</span>
                    <strong>{formatMoney(gst)}</strong>
                  </div>
                ) : null}
                <div className="grand">
                  <span>{draft.includeGst ? 'Total incl. GST' : 'Total'}</span>
                  <strong>{formatMoney(total)}</strong>
                </div>
              </div>
            </section>
          </>
        ) : null}

        {tab === 'prices' ? (
          <section className="qt-panel">
            <div className="qt-row" style={{ justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h2 style={{ margin: 0 }}>Catalog prices</h2>
              <button type="button" className="qt-btn qt-btn-ghost" onClick={resetPrices}>
                Reset to defaults
              </button>
            </div>
            <p className="qt-muted">
              Edit unit prices here. Changes stay on this browser and apply when you add new catalog lines.
            </p>
            <div className="qt-table-wrap" style={{ marginTop: '0.75rem' }}>
              <table className="qt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Default</th>
                    <th>Your price</th>
                  </tr>
                </thead>
                <tbody>
                  {QUOTE_CATALOG.map((item) => {
                    const price = unitPriceFor(item, overrides)
                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                          <div className="qt-muted">{item.blurb}</div>
                        </td>
                        <td>{CATEGORY_LABELS[item.category]}</td>
                        <td>{unitLabel(item.unit)}</td>
                        <td className="num">{formatMoney(item.defaultPrice)}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={price}
                            onChange={(e) => setPriceOverride(item.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {tab === 'drafts' ? (
          <section className="qt-panel">
            <h2>Saved drafts</h2>
            <p className="qt-muted">Stored only in this browser&apos;s local storage.</p>
            {drafts.length === 0 ? (
              <p className="qt-empty">No drafts yet.</p>
            ) : (
              <div className="qt-draft-list" style={{ marginTop: '0.75rem' }}>
                {drafts.map((d) => (
                  <div key={d.id} className="qt-draft-item">
                    <div>
                      <strong>
                        {d.quoteNumber}
                        {d.client.name ? ` · ${d.client.name}` : ''}
                      </strong>
                      <span className="qt-muted">
                        {d.title || 'Untitled'} · {d.quoteDate} · updated{' '}
                        {new Date(d.updatedAt).toLocaleString('en-NZ')}
                      </span>
                    </div>
                    <div className="qt-row">
                      <button type="button" className="qt-btn qt-btn-ghost" onClick={() => onLoadDraft(d.id)}>
                        Open
                      </button>
                      <button type="button" className="qt-btn qt-btn-ghost" onClick={() => onDuplicate(d.id)}>
                        Duplicate
                      </button>
                      <button type="button" className="qt-btn qt-btn-danger" onClick={() => onDeleteDraft(d.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {tab === 'settings' ? (
          <section className="qt-panel">
            <h2>PDF / business details</h2>
            <p className="qt-muted">Shown on exported PDFs. Saved on this browser.</p>
            <div className="qt-grid qt-grid-2" style={{ marginTop: '0.75rem' }}>
              <div className="qt-field">
                <label htmlFor="qt-gst">GST number</label>
                <input
                  id="qt-gst"
                  value={settings.gstNumber}
                  onChange={(e) => setSettings((s) => ({ ...s, gstNumber: e.target.value }))}
                  placeholder="e.g. 123-456-789"
                />
              </div>
              <div className="qt-field">
                <label htmlFor="qt-bemail">Business email</label>
                <input
                  id="qt-bemail"
                  type="email"
                  value={settings.businessEmail}
                  onChange={(e) => setSettings((s) => ({ ...s, businessEmail: e.target.value }))}
                />
              </div>
              <div className="qt-field">
                <label htmlFor="qt-bank">Bank / payment details</label>
                <input
                  id="qt-bank"
                  value={settings.bankDetails}
                  onChange={(e) => setSettings((s) => ({ ...s, bankDetails: e.target.value }))}
                  placeholder="Account name · bank · account number"
                />
              </div>
              <div className="qt-field">
                <label htmlFor="qt-valid">Quote validity (days)</label>
                <input
                  id="qt-valid"
                  type="number"
                  min={0}
                  value={settings.validityDays}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, validityDays: Number(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="qt-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="qt-paynotes">Payment notes</label>
                <textarea
                  id="qt-paynotes"
                  value={settings.paymentNotes}
                  onChange={(e) => setSettings((s) => ({ ...s, paymentNotes: e.target.value }))}
                />
              </div>
            </div>
            <div className="qt-row" style={{ marginTop: '0.9rem' }}>
              <button type="button" className="qt-btn" onClick={onSaveSettings}>
                Save settings
              </button>
            </div>
          </section>
        ) : null}
      </main>
    </>
  )
}
