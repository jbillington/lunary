// Every rule the garden enforces mechanically lives here, so it can be read
// in one sitting and tested without a UI.

import type { Day, Phase, Project, Spirit } from '../types'
import { SPIRITS } from '../content/spirits'
import { PLANETS } from '../content/planets'

export const HANDS_LIMIT = 3
/** One voluntary redraw. If you redraw a second time, the third draw is kept. */
export const MAX_DRAWS = 3

export const PHASE_ORDER: Phase[] = ['seed', 'waxing', 'full', 'waning', 'resting']

export const PHASE_LABEL: Record<Phase, string> = {
  seed: '🌑 Seed',
  waxing: '🌒 Waxing',
  full: '🌕 Full',
  waning: '🌘 Waning',
  resting: '🏡 Resting',
}

export const DAY_LABEL: Record<Day, string> = {
  sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday',
}

const DAY_INDEX: Record<Day, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
}

/**
 * Phases move forward or sideways only — never backward.
 * Waking is the one exception: Resting may return to Waxing.
 */
export function canMoveTo(from: Phase, to: Phase): boolean {
  if (from === to) return true
  if (from === 'resting') return to === 'waxing' // the wake
  return PHASE_ORDER.indexOf(to) > PHASE_ORDER.indexOf(from)
}

export function legalMoves(from: Phase): Phase[] {
  return PHASE_ORDER.filter((p) => canMoveTo(from, p))
}

/** A project cannot receive the same Spirit two cycles running. */
export function availableSpirits(project: Project): Spirit[] {
  const pool = SPIRITS.filter((s) => s.id !== project.lastSpirit)
  // Guard against a content pack so small the filter empties it.
  return pool.length > 0 ? pool : SPIRITS
}

export function tendedCount(projects: Project[]): number {
  return projects.filter((p) => p.zone === 'garden').length
}

export function bedsFree(projects: Project[]): number {
  return Math.max(0, HANDS_LIMIT - tendedCount(projects))
}

export interface Draw {
  planet: (typeof PLANETS)[number]
  spirit: Spirit
}

export function drawFor(project: Project): Draw {
  const spirits = availableSpirits(project)
  return {
    planet: PLANETS[Math.floor(Math.random() * PLANETS.length)],
    spirit: spirits[Math.floor(Math.random() * spirits.length)],
  }
}

/** The next occurrence of the spirit's planetary day, strictly in the future. */
export function nextDayOccurrence(day: Day, from: Date = new Date()): Date {
  const target = DAY_INDEX[day]
  const d = new Date(from)
  d.setHours(0, 0, 0, 0)
  let delta = (target - d.getDay() + 7) % 7
  if (delta === 0) delta = 7
  d.setDate(d.getDate() + delta)
  return d
}

export function isoDate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function prettyDate(iso: string): string {
  const [y, m, day] = iso.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString(undefined, {
    weekday: 'long', month: 'short', day: 'numeric',
  })
}
