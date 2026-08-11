import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <p>That link does not exist on this site.</p>
      <Link className="btn primary" to="/">
        Back to Borrelli Painting
      </Link>
    </main>
  )
}
