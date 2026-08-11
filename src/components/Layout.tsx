import { Link, Outlet } from 'react-router-dom'
import { FACEBOOK_URL, PHONE_DISPLAY, PHONE_TEL, asset } from '../content/site'
import { Seo } from './Seo'

export function Layout() {
  return (
    <div className="site">
      <Seo />
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-logo">
            <img src={asset('images/brand-logo.png')} alt="Borrelli Painting" width={220} height={88} />
          </Link>
          <nav className="site-nav" aria-label="Primary">
            <Link to="/#quote">Quote</Link>
            <Link to="/#work">Work</Link>
            <Link to="/#windows">Windows</Link>
            <Link to="/#about">About</Link>
            <Link to="/#contact">Contact</Link>
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>
            <strong>Borrelli Painting</strong> · Gianluca Borrelli · Golden Bay
          </p>
          <p>
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            {' · '}
            <a href={FACEBOOK_URL} rel="noopener noreferrer" target="_blank">
              Facebook
            </a>
          </p>
          <p className="site-footer-fine">Ballpark quotes are estimates only — Luca confirms on site.</p>
        </div>
      </footer>
    </div>
  )
}
