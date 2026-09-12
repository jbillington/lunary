import { useState } from 'react'
import type { ReadingRecord } from '../lib/history'
import { drawNote, planetOf, spiritOf } from '../lib/history'
import { DAY_LABEL, prettyDate } from '../lib/rules'
import { moonGlyph } from '../lib/moon'
import { PlanetCard, SpiritCard } from './GameCard'

/**
 * One past reading, collapsed to a line and expandable to the full card faces.
 * Used by both the Moonbook and the project card, so a reading looks the same
 * wherever you meet it again.
 */
export function ReadingView({
  record,
  projectName,
  defaultOpen = false,
}: {
  record: ReadingRecord
  projectName?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const { reading, cycle, date, moonPhase } = record
  const planet = planetOf(reading)
  const spirit = spiritOf(reading)
  const note = drawNote(reading.draws)

  return (
    <div className={`reading ${open ? 'open' : ''}`}>
      <button className="reading-head" onClick={() => setOpen(!open)}>
        <span className="reading-cycle">
          {moonGlyph(moonPhase)} C{cycle}
        </span>
        <span className="reading-title">
          {projectName && <strong>{projectName} · </strong>}
          {planet ? planet.name.replace('The ', '') : reading.planet}
          {' + '}
          {spirit ? spirit.name : reading.spirit}
        </span>
        <span className="reading-chevron">{open ? '−' : '+'}</span>
      </button>

      {!open && <div className="reading-invitation">{reading.invitation}</div>}

      {open && (
        <div className="reading-body">
          {planet && spirit ? (
            <div className="deck-row">
              <PlanetCard planet={planet} />
              <SpiritCard spirit={spirit} />
            </div>
          ) : (
            <p className="warn">
              This reading names a card that is no longer in the deck
              {' '}({reading.planet} + {reading.spirit}). The invitation survives below.
            </p>
          )}

          <div className="panel">
            <div className="field">
              <div className="label">The invitation</div>
              <div>{reading.invitation}</div>
            </div>
            <div className="field">
              <div className="label">Scheduled</div>
              <div>
                {DAY_LABEL[reading.scheduledDay]}, {prettyDate(reading.scheduledDate)}
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="label">Drawn</div>
              <div>
                {prettyDate(date)}
                {note && <span className="hint"> · {note}</span>}
                {reading.sealed ? (
                  <span className="sealed"> · ✦ sealed</span>
                ) : (
                  <span className="warn"> · never sealed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
