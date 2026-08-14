import { Link, Outlet } from 'react-router-dom'
import { FACEBOOK_URL, PHONE_DISPLAY, PHONE_TEL, asset } from '../content/site'
import { HashLink, HashScroll } from './HashScroll'
import { Seo } from './Seo'

export function Layout() {
  return (
    <div className="site">
      <Seo />
      <HashScroll />
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-logo">
            <img src={asset('images/brand-logo.png')} alt="Borrelli Painting" width={220} height={88} />
          </Link>
          <nav className="site-nav" aria-label="Primary">
            <HashLink to="/#quote">Get a quote</HashLink>
            <Link to="/estimates">Estimates</Link>
            <HashLink to="/#work">Work</HashLink>
            <HashLink to="/#windows">Windows</HashLink>
            <HashLink to="/#about">About</HashLink>
            <HashLink to="/#contact">Contact</HashLink>
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
          <p className="site-footer-fine">
            Best quotes happen on site — ring Luca and he will come and look.
          </p>
        </div>
      </footer>
    </div>
  )
}
