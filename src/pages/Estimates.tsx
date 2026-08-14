import { Link } from 'react-router-dom'
import { DemoCardImage } from '../components/DemoImages'
import { HashLink } from '../components/HashScroll'

export default function Estimates() {
  return (
    <main>
      <section id="estimates" className="band quotes" aria-labelledby="estimates-heading">
        <div className="wrap">
          <p className="section-kicker">Ballpark tools</p>
          <h1 id="estimates-heading">Estimates</h1>
          <p className="band-lead">
            Two calculators for a rough sense of cost — indoor rooms, or weatherboards, corrugate,
            and roof iron. Impression only — nothing is emailed or booked. For a real quote, Luca
            prefers to come to your place and look.
          </p>
          <div className="quote-cards">
            <Link to="/estimates/indoor" className="quote-card quote-card-fresh">
              <DemoCardImage id="freshcoat" />
              <span className="quote-kind">Simple indoor</span>
              <h2>Indoor rooms</h2>
              <p>Walls, ceiling, skirting, windows &amp; trim → paint system → ballpark figure.</p>
              <span className="quote-go">Open calculator →</span>
            </Link>
            <Link to="/estimates/exterior" className="quote-card quote-card-board">
              <DemoCardImage id="paintboard" />
              <span className="quote-kind">Exterior &amp; roof</span>
              <h2>Weatherboards, corrugate &amp; roof</h2>
              <p>Cladding, corrugations, and roof iron — extra area and labour built in.</p>
              <span className="quote-go">Open calculator →</span>
            </Link>
          </div>
          <p className="band-lead" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            Ready for the real thing?{' '}
            <HashLink to="/#contact">Contact Luca</HashLink> and ask him to visit.
          </p>
        </div>
      </section>
    </main>
  )
}
