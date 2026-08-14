import { Link } from 'react-router-dom'
import { DemoCardImage } from '../../components/DemoImages'
import { HashLink } from '../../components/HashScroll'

export default function QuotesHub() {
  return (
    <main>
      <section className="band quotes" aria-labelledby="quotes-hub-heading">
        <div className="wrap">
          <p className="section-kicker">Ballpark tools</p>
          <h2 id="quotes-hub-heading">Quick estimate calculators</h2>
          <p className="band-lead">
            These are impressions only — useful if you want a rough sense of cost. For a real quote,
            Luca prefers to come to your place, walk the job with you, and price it properly.
          </p>
          <div className="quote-cards">
            <Link to="/quotes/indoor" className="quote-card quote-card-fresh">
              <DemoCardImage id="freshcoat" />
              <span className="quote-kind">Simple indoor</span>
              <h3>Indoor rooms</h3>
              <p>Walls, ceiling, skirting, windows &amp; trim → paint system → ballpark figure.</p>
              <span className="quote-go">Open calculator →</span>
            </Link>
            <Link to="/quotes/exterior" className="quote-card quote-card-board">
              <DemoCardImage id="paintboard" />
              <span className="quote-kind">Exterior &amp; roof</span>
              <h3>Weatherboards, corrugate &amp; roof</h3>
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
