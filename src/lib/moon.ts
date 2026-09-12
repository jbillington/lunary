// Synodic moon phase. No dependency, ~15 lines, accurate to well under a day —
// which is all a ceremony you trigger by hand needs.

const SYNODIC = 29.530588853
// Known new moon: 2000-01-06 18:14 UTC
const EPOCH = Date.UTC(2000, 0, 6, 18, 14) / 86_400_000

/** 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter. */
export function moonPhase(date: Date = new Date()): number {
  const days = date.getTime() / 86_400_000 - EPOCH
  const frac = (days / SYNODIC) % 1
  return frac < 0 ? frac + 1 : frac
}

export function moonName(p: number): string {
  if (p < 0.03 || p > 0.97) return 'New Moon'
  if (p < 0.22) return 'Waxing Crescent'
  if (p < 0.28) return 'First Quarter'
  if (p < 0.47) return 'Waxing Gibbous'
  if (p < 0.53) return 'Full Moon'
  if (p < 0.72) return 'Waning Gibbous'
  if (p < 0.78) return 'Last Quarter'
  return 'Waning Crescent'
}

export function moonGlyph(p: number): string {
  const glyphs = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
  return glyphs[Math.floor(p * 8 + 0.5) % 8]
}

/** Days until the next new moon — the next Invocation. */
export function daysToNewMoon(date: Date = new Date()): number {
  return Math.round((1 - moonPhase(date)) * SYNODIC)
}
