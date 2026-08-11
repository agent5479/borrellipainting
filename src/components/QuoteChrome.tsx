import { Link } from 'react-router-dom'
import type { DemoImageId } from '../shared/demoAssets'
import { DemoImageTiles } from './DemoImages'

export function QuoteChrome({
  theme,
  title,
  subtitle,
  imageId,
}: {
  theme: string
  title: string
  subtitle?: string
  imageId: DemoImageId
}) {
  return (
    <>
      <header className="demo-chrome">
        <Link to="/" className="demo-back">
          ← Home
        </Link>
        <div>
          <p className="demo-badge">Ballpark only · not a confirmed booking</p>
          <h1>{title}</h1>
          {subtitle && <p className="demo-sub">{subtitle}</p>}
        </div>
        <span className="demo-theme-tag">{theme}</span>
      </header>
      <DemoImageTiles id={imageId} />
    </>
  )
}

export function QuoteCompare({
  compareTo,
  compareLabel,
  engineNote,
}: {
  compareTo: string
  compareLabel: string
  engineNote?: string
}) {
  return (
    <aside className="demo-pitch-bar" aria-label="Compare quote layouts">
      <div className="demo-pitch-tier">
        <span className="demo-pitch-kicker">Two layouts</span>
        <span className="demo-pitch-hint">Same ballpark math — try the other layout</span>
      </div>
      <div className="demo-pitch-pair">
        {engineNote && <p className="demo-pitch-engine">{engineNote}</p>}
        <Link className="demo-pitch-compare" to={compareTo}>
          Compare with {compareLabel} →
        </Link>
      </div>
    </aside>
  )
}

export function QuoteDoneCta() {
  return (
    <div className="demo-quote-cta">
      <p>This is a ballpark only. Luca will confirm on site.</p>
      <Link className="btn primary" to="/#contact">
        Contact Luca
      </Link>
    </div>
  )
}
