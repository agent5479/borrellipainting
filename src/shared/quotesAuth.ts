const SESSION_KEY = 'bp-quotes-unlocked'
const HASH_RE = /^[a-f0-9]{64}$/

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function expectedPasswordHashes(): string[] {
  return (import.meta.env.VITE_QUOTES_PASSWORD_HASH ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter((h) => HASH_RE.test(h))
}

export function isQuotesConfigured(): boolean {
  return expectedPasswordHashes().length > 0
}

export function isQuotesUnlocked(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function unlockQuotesSession(): void {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export function lockQuotesSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export async function tryUnlockQuotes(password: string): Promise<'ok' | 'bad' | 'unconfigured'> {
  const expected = expectedPasswordHashes()
  if (expected.length === 0) return 'unconfigured'
  const actual = await sha256Hex(password)
  if (!expected.includes(actual)) return 'bad'
  unlockQuotesSession()
  return 'ok'
}
