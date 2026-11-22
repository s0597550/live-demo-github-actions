// ─────────────────────────────────────────────────────────────
// Regeln für die Grüße aus dem Publikum.
// Wird von der Website UND vom Bot-Skript (.github/scripts/add-greeting.mts)
// benutzt – und von der Pipeline getestet, bevor etwas live geht.
// ─────────────────────────────────────────────────────────────

export interface Greeting {
  name: string
  user: string
  issue: number
  time: string
  color: string
}

export const MAX_LENGTH = 50
export const MAX_GREETINGS = 30

const COLORS: Record<string, string> = {
  rot: '#f85149',
  orange: '#f0883e',
  gelb: '#d29922',
  grün: '#3fb950',
  gruen: '#3fb950',
  blau: '#58a6ff',
  lila: '#a371f7',
  pink: '#f778ba',
}
const PALETTE = ['#3fb950', '#58a6ff', '#a371f7', '#f778ba', '#f0883e', '#d29922']

/**
 * Macht aus einem beliebigen Issue-Titel einen sicheren, kurzen Gruß.
 * Der Titel kommt von fremden Personen – also nie ungeprüft übernehmen.
 */
export function cleanGreeting(raw: string): string {
  const text = raw
    .replace(/https?:\/\/\S+/gi, '') // keine Links
    .replace(/[\p{C}<>]/gu, '') // keine Steuerzeichen, keine spitzen Klammern
    .replace(/\s+/g, ' ')
    .trim()
  return [...text].slice(0, MAX_LENGTH).join('').trim()
}

/** Farbwunsch aus dem Titel („… rot“) – sonst eine feste Farbe pro Person. */
export function pickColor(title: string, user: string): string {
  const words = title.toLowerCase().split(/[^\p{L}]+/u)
  for (const word of words) {
    if (COLORS[word]) return COLORS[word]
  }
  let hash = 0
  for (const ch of user) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

/** Neuer Gruß nach vorn, höchstens MAX_GREETINGS behalten. */
export function addGreeting(list: Greeting[], entry: Greeting): Greeting[] {
  return [entry, ...list.filter((g) => g.issue === 0 || g.issue !== entry.issue)].slice(
    0,
    MAX_GREETINGS,
  )
}
