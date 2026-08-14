import { Link } from 'react-router-dom'
import type { DemoImageId } from '../shared/demoAssets'
import { DemoImageTiles } from './DemoImages'
import { HashLink } from './HashScroll'

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
        <Link to="/quotes" className="demo-back">
          ← Ballpark tools
        </Link>
        <div>
          <p className="demo-badge">Ballpark only · impression, not a quote</p>
          <h1>{title}</h1>
          {subtitle && <p className="demo-sub">{subtitle}</p>}
        </div>
        <span className="demo-theme-tag">{theme}</span>
      </header>
      <DemoImageTiles id={imageId} />
    </>
  )
}

export function QuoteDoneCta() {
  return (
    <div className="demo-quote-cta">
      <p>
        This figure is an impression only — nothing is booked or emailed. Luca confirms the real
        number on site.
      </p>
      <HashLink className="btn primary" to="/#contact">
        Contact Luca
      </HashLink>
    </div>
  )
}
