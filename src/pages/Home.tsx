import { HashLink } from '../components/HashScroll'
import { GALLERY_THEMES, WINDOW_PAIRS, WINDOW_STEPS } from '../content/gallery'
import { AREA, FACEBOOK_URL, FOUNDER, PHONE_DISPLAY, PHONE_TEL, asset } from '../content/site'
import { GB_PLACES } from '../shared/gbPlaces'

const SERVICES = [
  {
    title: 'Interiors',
    text: 'Walls, ceilings, and tidy indoor finishes — including colour changes and new gib.',
  },
  {
    title: 'Exteriors',
    text: 'Weatherboards, fascia, corrugate, and roof iron that have to stand up to Golden Bay weather.',
  },
  {
    title: 'Weatherboards & trim',
    text: 'Prep, undercoat, and a durable topcoat on timber and trim that gets the most wear.',
  },
  {
    title: 'Character homes',
    text: 'Careful work on older and unusual houses — turrets, sunrooms, and mixed rooflines.',
  },
  {
    title: 'Old windows',
    text: 'Repair and repaint of timber sashes — scrape, putty, prime, and a finish that still opens.',
  },
]

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">Golden Bay · {FOUNDER}</p>
          <h1>Painting done properly — interiors, exteriors, and the odd character house.</h1>
          <p className="hero-lead">
            Borrelli Painting is Luca Borrelli: local, careful, and happiest when he can walk your
            place with you before anyone opens a tin — including the old timber windows that need
            more than a roller. Tākaka, Pōhara, Collingwood, and around the Bay.
          </p>
          <div className="hero-actions">
            <HashLink className="btn primary" to="/#quote">
              Ask Luca to visit
            </HashLink>
            <HashLink className="btn ghost" to="/#contact">
              Contact
            </HashLink>
          </div>
        </div>
        <figure className="hero-photo">
          <img
            src={asset('images/gallery/exteriors/painted-house.jpg')}
            alt="Freshly painted blue weatherboard house with white trim in Golden Bay"
            width={960}
            height={640}
          />
        </figure>
      </section>

      <section id="quote" className="band visit-quote" aria-labelledby="quote-heading">
        <div className="wrap visit-quote-grid">
          <div>
            <p className="section-kicker">Real quotes</p>
            <h2 id="quote-heading">Get Luca over to your place</h2>
            <p className="band-lead">
              Gianluca&apos;s specialty is showing up, looking properly, and talking the job through
              with you — what needs doing, what can wait, and a number you can trust. Online
              calculators miss the damp patch, the fiddly eaves, and the conversation that makes a
              quote feel fair.
            </p>
            <p className="band-lead">
              Ring or message him. He will come out around Golden Bay, walk the job with you, and
              quote in person. That is the bit he is good at: being there, being clear, and being
              someone you can talk to.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href={`tel:${PHONE_TEL}`}>
                Call {PHONE_DISPLAY}
              </a>
              <HashLink className="btn ghost" to="/#contact">
                Contact details
              </HashLink>
            </div>
          </div>
          <figure className="visit-quote-photo">
            <img
              src={asset('images/gallery/exteriors/painted-steeple-house.jpg')}
              alt="Character home in Golden Bay after careful exterior painting"
              width={800}
              height={533}
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="band services" aria-labelledby="services-heading">
        <div className="wrap">
          <h2 id="services-heading">What Luca paints</h2>
          <div className="service-grid">
            {SERVICES.map((s) => (
              <article key={s.title} className="service-card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="band work" aria-labelledby="work-heading">
        <div className="wrap">
          <h2 id="work-heading">Work</h2>
          <p className="band-lead">
            Themed areas for finished jobs. More Facebook series will land here as grouped photos.
          </p>
          {GALLERY_THEMES.map((theme) => (
            <div key={theme.id} className="gallery-theme">
              <header className="gallery-theme-head">
                <h3>{theme.title}</h3>
                <p>{theme.blurb}</p>
              </header>
              {theme.images.length ? (
                <div className="gallery-grid">
                  {theme.images.map((img) => (
                    <figure key={img.src} className="gallery-item">
                      <img src={img.src} alt={img.alt} loading="lazy" />
                      {img.caption && <figcaption>{img.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="gallery-empty">Photos coming — drop files into {theme.folder}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="windows" className="band windows" aria-labelledby="windows-heading">
        <div className="wrap">
          <h2 id="windows-heading">Old window repair</h2>
          <p className="band-lead">
            Leadlights, awning sashes, and weathered timber in stucco walls. This is prep and
            detailing — not a quick coat over flaking paint.
          </p>
          <ol className="window-steps">
            {WINDOW_STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="window-step-n">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="ba-list">
            {WINDOW_PAIRS.map((pair) => (
              <article key={pair.title} className="ba-pair">
                <h3 className="ba-title">{pair.title}</h3>
                <div className="ba-shots">
                  <figure>
                    <img src={pair.before.src} alt={pair.before.alt} loading="lazy" />
                    <figcaption>{pair.before.caption}</figcaption>
                  </figure>
                  <figure>
                    <img src={pair.after.src} alt={pair.after.alt} loading="lazy" />
                    <figcaption>{pair.after.caption}</figcaption>
                  </figure>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="band about" aria-labelledby="about-heading">
        <div className="wrap about-grid">
          <div>
            <h2 id="about-heading">About Luca</h2>
            <p>
              Gianluca Borrelli — Luca — paints homes around Golden Bay. Interiors, exteriors, and
              the jobs that need a bit more care: weatherboards, trim, old timber windows, and
              character houses that were never a simple box.
            </p>
            <p>
              He would rather come and see the job than guess from a form. Ring or message, invite
              him over, and get a quote from someone who has stood in the room with you.
            </p>
          </div>
          <figure className="about-photo">
            <img
              src={asset('images/gallery/exteriors/painted-steeple-house.jpg')}
              alt="Character home with turret after exterior painting"
              width={800}
              height={533}
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section id="contact" className="band contact" aria-labelledby="contact-heading">
        <div className="wrap">
          <h2 id="contact-heading">Contact</h2>
          <p className="band-lead">
            Call or message Luca. Around {GB_PLACES.slice(0, 4).map((p) => p.name).join(', ')}, and
            nearby.
          </p>
          <ul className="contact-list">
            <li>
              <span>Phone</span>
              <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            </li>
            <li>
              <span>Facebook</span>
              <a href={FACEBOOK_URL} rel="noopener noreferrer" target="_blank">
                facebook.com/borrellipainting
              </a>
            </li>
            <li>
              <span>Area</span>
              <span>{AREA}</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
