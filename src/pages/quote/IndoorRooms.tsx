import { useMemo, useState } from 'react'
import { QuoteChrome, QuoteDoneCta } from '../../components/QuoteChrome'
import {
  INDOOR_SURFACE_KINDS,
  areaNote,
  estimatePaintJob,
  formatPaintBracket,
  measuredAreaM2,
  newSurface,
  paintTypeById,
  paintableAreaM2,
  paintsFor,
  surfaceKindById,
  undercoatById,
  undercoatsFor,
  type PaintSurface,
  type PaintTypeId,
  type SurfaceKindId,
  type UndercoatId,
} from '../../shared/paintingQuote'

const INDOOR_PAINTS = paintsFor('indoor')
const INDOOR_UNDERCOATS = undercoatsFor('indoor')

export default function IndoorRooms() {
  const [step, setStep] = useState(1)
  const [surfaces, setSurfaces] = useState<PaintSurface[]>([
    { id: 'wall-lounge-long', label: 'Lounge — long wall', widthM: 4.2, heightM: 2.4, qty: 1, kind: 'wall' },
    { id: 'wall-lounge-ends', label: 'Lounge — end walls', widthM: 3.2, heightM: 2.4, qty: 2, kind: 'wall' },
    { id: 'ceil-lounge', label: 'Lounge — ceiling', widthM: 4.2, heightM: 3.2, qty: 1, kind: 'ceiling' },
  ])
  const [paintTypeId, setPaintTypeId] = useState<PaintTypeId>('standard')
  const [undercoatId, setUndercoatId] = useState<UndercoatId>('acrylic')

  const estimate = useMemo(
    () => estimatePaintJob(surfaces, paintTypeId, undercoatId, 'indoor'),
    [surfaces, paintTypeId, undercoatId],
  )

  const updateSurface = (id: string, patch: Partial<PaintSurface>) => {
    setSurfaces((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const changeKind = (id: string, kind: SurfaceKindId) => {
    const meta = surfaceKindById(kind)
    setSurfaces((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              kind,
              pitchId: undefined,
              widthM: Math.min(s.widthM, meta?.maxA ?? s.widthM),
              heightM: Math.min(s.heightM, meta?.maxB ?? s.heightM),
            }
          : s,
      ),
    )
  }

  const removeSurface = (id: string) => {
    setSurfaces((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== id)))
  }

  return (
    <main className="painting-page theme-freshcoat">
      <QuoteChrome
        theme="Indoor"
        title="Indoor walls & ceilings"
        subtitle="Simple room calculator — measure walls and ceilings, pick paint, and see a Golden Bay ballpark."
        imageId="freshcoat"
      />

      <ol className="wizard-steps" aria-label="Quote steps">
        {[1, 2, 3].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="yacht-panel demo-enter">
          <h2>1. Rooms — walls &amp; ceilings</h2>
          <p className="hint">
            Width × height in metres. Mark ceilings separately — overhead work takes a bit longer.
          </p>
          <div className="wall-editor-list">
            {surfaces.map((s) => {
              const kind = surfaceKindById(s.kind)
              const note = areaNote(s)
              return (
                <div key={s.id} className="wall-editor-card">
                  <label className="field">
                    Label
                    <input
                      value={s.label}
                      onChange={(e) => updateSurface(s.id, { label: e.target.value })}
                      placeholder="e.g. Hall north"
                    />
                  </label>
                  <label className="field">
                    Surface
                    <select
                      value={s.kind}
                      onChange={(e) => changeKind(s.id, e.target.value as SurfaceKindId)}
                    >
                      {INDOOR_SURFACE_KINDS.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="wall-dims">
                    <label className="field">
                      {kind?.dimA ?? 'Width (m)'}
                      <input
                        type="number"
                        min={0.5}
                        max={kind?.maxA ?? 20}
                        step={0.1}
                        value={s.widthM}
                        onChange={(e) => updateSurface(s.id, { widthM: Number(e.target.value) })}
                      />
                    </label>
                    <label className="field">
                      {kind?.dimB ?? 'Height (m)'}
                      <input
                        type="number"
                        min={0.3}
                        max={kind?.maxB ?? 6}
                        step={0.1}
                        value={s.heightM}
                        onChange={(e) => updateSurface(s.id, { heightM: Number(e.target.value) })}
                      />
                    </label>
                    <label className="field">
                      Qty
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={s.qty}
                        onChange={(e) => updateSurface(s.id, { qty: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                  <div className="wall-editor-meta area-meta">
                    <span>
                      {measuredAreaM2(s)} m² measured
                      {note ? <small> · {note}</small> : null}
                      {s.kind === 'ceiling' ? <small> · slower overhead labour</small> : null}
                      <small className="area-paint"> · {paintableAreaM2(s)} m² to paint</small>
                    </span>
                    <button
                      type="button"
                      className="btn ghost"
                      disabled={surfaces.length <= 1}
                      onClick={() => removeSurface(s.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="btn-row">
            <button
              type="button"
              className="btn ghost"
              onClick={() =>
                setSurfaces((prev) => [
                  ...prev,
                  newSurface({ kind: 'wall', label: `Wall ${prev.filter((x) => x.kind === 'wall').length + 1}` }),
                ])
              }
            >
              + Add wall
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() =>
                setSurfaces((prev) => [
                  ...prev,
                  newSurface({
                    kind: 'ceiling',
                    label: `Ceiling ${prev.filter((x) => x.kind === 'ceiling').length + 1}`,
                  }),
                ])
              }
            >
              + Add ceiling
            </button>
          </div>
          {estimate && (
            <p className="live-estimate">
              Running area <strong>{estimate.paintableM2} m²</strong>
              {estimate.measuredM2 !== estimate.paintableM2
                ? ` (${estimate.measuredM2} m² measured)`
                : ''}
            </p>
          )}
          <div className="btn-row">
            <button type="button" className="btn primary" disabled={!estimate} onClick={() => setStep(2)}>
              Next: Paint system
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="yacht-panel demo-enter">
          <h2>2. Paint &amp; undercoat</h2>
          <h3 className="subhead">Finish paint</h3>
          <div className="pkg-grid">
            {INDOOR_PAINTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pkg-card${paintTypeId === p.id ? ' selected' : ''}`}
                onClick={() => setPaintTypeId(p.id)}
              >
                <strong>{p.name}</strong>
                <span className="pkg-price">
                  from ${p.materialPerM2}/m² · {p.finishCoats} coats
                </span>
                <p>{p.blurb}</p>
              </button>
            ))}
          </div>
          <h3 className="subhead">Undercoat</h3>
          <div className="route-chips">
            {INDOOR_UNDERCOATS.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`chip${undercoatId === u.id ? ' selected' : ''}`}
                onClick={() => setUndercoatId(u.id)}
                title={u.blurb}
              >
                {u.name}
                {u.materialPerM2 > 0 ? ` · $${u.materialPerM2}/m²` : ''}
              </button>
            ))}
          </div>
          {estimate && (
            <p className="live-estimate">
              Ballpark <strong>{formatPaintBracket(estimate)}</strong>
            </p>
          )}
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!estimate} onClick={() => setStep(3)}>
              See ballpark
            </button>
          </div>
        </section>
      )}

      {step === 3 && estimate && (
        <section className="yacht-panel demo-enter">
          <h2>3. Your ballpark figure</h2>
          <p className="hint">Impression only — not a confirmed quote or booking.</p>
          <div className="summary">
            <p>
              <strong>Area:</strong> {estimate.paintableM2} m² indoor
              {estimate.measuredM2 !== estimate.paintableM2
                ? ` (${estimate.measuredM2} m² measured)`
                : ''}
            </p>
            <p>
              <strong>System:</strong> {paintTypeById(paintTypeId)?.name}
              {undercoatId !== 'none' ? ` + ${undercoatById(undercoatId)?.name}` : ''}
            </p>
            <ul className="quote-breakdown">
              {estimate.lines.map((line) => (
                <li key={line.surfaceId}>
                  {line.label}: {line.paintableM2} m²
                </li>
              ))}
              <li>Labour ${estimate.labour.toFixed(2)}</li>
              <li>Materials ${estimate.materials.toFixed(2)}</li>
              <li>Setup ${estimate.setupFee.toFixed(2)}</li>
              <li>Travel (Golden Bay) ${estimate.travelFee.toFixed(2)}</li>
            </ul>
            <p className="estimate-bracket">Estimated cost {formatPaintBracket(estimate)}</p>
          </div>
          <QuoteDoneCta />
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Try another job
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
