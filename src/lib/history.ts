// Reading the moonbook back.
//
// Readings have always been persisted — into Cycle.readings, and from there to
// localStorage. What was missing was any way to look at them. These helpers turn
// the stored cycles into something a screen can render.

import type { Cycle, Planet, Reading, Spirit } from '../types'
import { PLANET_BY_ID } from '../content/planets'
import { SPIRIT_BY_ID } from '../content/spirits'

export interface ReadingRecord {
  cycle: number
  date: string
  moonPhase: number
  /** True while this cycle is still open — the candle has not been blown out. */
  open: boolean
  reading: Reading
}

/**
 * Closed cycles plus the one in progress. A cycle only joins `cycles[]` when the
 * ceremony is closed properly, so an abandoned ritual's readings live on in
 * `activeCycle` — include it or they stay invisible.
 */
export function allCycles(cycles: Cycle[], active: Cycle | null): Cycle[] {
  return active ? [...cycles, active] : cycles
}

/** Every reading ever taken, newest first. */
export function timeline(cycles: Cycle[], active: Cycle | null): ReadingRecord[] {
  return allCycles(cycles, active)
    .flatMap((c) =>
      c.readings.map((reading) => ({
        cycle: c.id,
        date: c.startedAt,
        moonPhase: c.moonPhase,
        open: active !== null && c.id === active.id,
        reading,
      })),
    )
    .reverse()
}

/** One project's readings, newest first. */
export function readingsFor(
  projectId: string,
  cycles: Cycle[],
  active: Cycle | null,
): ReadingRecord[] {
  return timeline(cycles, active).filter((r) => r.reading.projectId === projectId)
}

// A stored reading can name a card that is no longer in the content pack — the
// Spirit deck is still being written, and cards will be added and renamed. Look
// them up defensively so old readings degrade instead of crashing the page.

export function planetOf(r: Reading): Planet | null {
  return PLANET_BY_ID[r.planet] ?? null
}

export function spiritOf(r: Reading): Spirit | null {
  return SPIRIT_BY_ID[r.spirit] ?? null
}

/** "kept on the third draw" reads better than "draws: 3". */
export function drawNote(draws: number): string | null {
  if (draws <= 1) return null
  if (draws === 2) return 'redrawn once'
  return 'kept on the third draw'
}
