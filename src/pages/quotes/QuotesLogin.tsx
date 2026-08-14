import { useState, type FormEvent } from 'react'
import { isQuotesConfigured, tryUnlockQuotes } from '../../shared/quotesAuth'

interface QuotesLoginProps {
  onUnlocked: () => void
}

export function QuotesLogin({ onUnlocked }: QuotesLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const configured = isQuotesConfigured()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const result = await tryUnlockQuotes(password)
      if (result === 'ok') {
        onUnlocked()
        return
      }
      if (result === 'unconfigured') {
        setError('Quotes login is not configured for this build.')
        return
      }
      setError('Incorrect password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="qt-login">
      <div className="qt-login-card">
        <p className="qt-kicker">Borrelli Painting</p>
        <h1>Quote builder</h1>
        <p className="qt-muted">Private staff tool — password required. Not linked from the public site.</p>
        {!configured ? (
          <p className="qt-flash qt-flash-error" role="alert">
            Set <code>VITE_QUOTES_PASSWORD_HASH</code> locally, or GitHub secrets{' '}
            <code>QUOTES_ADMIN_PASSWORD</code> / <code>gbtech_admin</code> for deploy.
          </p>
        ) : null}
        <form onSubmit={onSubmit}>
          <div className="qt-field">
            <label htmlFor="qt-password">Password</label>
            <input
              id="qt-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!configured || busy}
              required
            />
          </div>
          {error ? (
            <p className="qt-flash qt-flash-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="qt-btn" type="submit" disabled={!configured || busy}>
            {busy ? 'Checking…' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  )
}
