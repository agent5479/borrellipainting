const SESSION_KEY = 'bp-quotes-unlocked'

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function expectedPasswordHash(): string {
  return (import.meta.env.VITE_QUOTES_PASSWORD_HASH ?? '').trim().toLowerCase()
}

export function isQuotesConfigured(): boolean {
  return /^[a-f0-9]{64}$/.test(expectedPasswordHash())
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
  const expected = expectedPasswordHash()
  if (!/^[a-f0-9]{64}$/.test(expected)) return 'unconfigured'
  const actual = await sha256Hex(password)
  if (actual !== expected) return 'bad'
  unlockQuotesSession()
  return 'ok'
}
