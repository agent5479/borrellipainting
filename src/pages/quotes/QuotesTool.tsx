import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../../components/Seo'
import { asset } from '../../content/site'
import { isQuotesUnlocked, lockQuotesSession } from '../../shared/quotesAuth'
import { QuotesBuilder } from './QuotesBuilder'
import { QuotesLogin } from './QuotesLogin'
import '../../styles/quotesTool.css'

export default function QuotesTool() {
  const [unlocked, setUnlocked] = useState(() => isQuotesUnlocked())

  function lock() {
    lockQuotesSession()
    setUnlocked(false)
  }

  return (
    <div className="qt">
      <Seo />
      {!unlocked ? (
        <>
          <header className="qt-header">
            <div className="qt-header-inner">
              <Link to="/" className="qt-brand">
                <img src={asset('images/brand-logo.png')} alt="Borrelli Painting" width={180} height={72} />
              </Link>
            </div>
          </header>
          <QuotesLogin onUnlocked={() => setUnlocked(true)} />
        </>
      ) : (
        <QuotesBuilder onLock={lock} />
      )}
    </div>
  )
}
