import { useState } from 'react'
import { useGarden } from '../store'
import { ITCHES } from '../content/itches'
import { PHASE_LABEL, isoDate, legalMoves, prettyDate } from '../lib/rules'
import { ItchCard } from './GameCard'
import type { Itch } from '../types'

export function ProjectDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { projects, updateProject, movePhase, moveZone, addEcho, appendChronicle } = useGarden()
  const p = projects.find((x) => x.id === id)
  const [itch, setItch] = useState<Itch | null>(null)
  const [echoNote, setEchoNote] = useState('')

  if (!p) return null

  function drawItch() {
    const drawn = ITCHES[Math.floor(Math.random() * ITCHES.length)]
    setItch(drawn)
    appendChronicle(id, {
      cycle: p!.chronicle.length + 1,
      date: isoDate(),
      line: `Itch drawn — ${drawn.name}: ${drawn.provocation}`,
    })
  }

  return (
    <div className="drawer">
      <div className="drawer-inner">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontWeight: 500 }}>{p.name}</h2>
          <div style={{ flex: 1 }} />
          <button className="ghost" onClick={onClose}>Close</button>
        </div>
        <div className="hint" style={{ marginBottom: '1.5rem' }}>
          {PHASE_LABEL[p.phase]} · {p.zone} · planted {prettyDate(p.created)}
        </div>

        <div className="panel">
          <h3>The front of the card</h3>
          <div className="field">
            <div className="label">Purpose</div>
            <input
              value={p.purpose}
              onChange={(e) => updateProject(id, { purpose: e.target.value })}
            />
          </div>
          <div className="field">
            <div className="label">Target user</div>
            <input
              value={p.targetUser}
              onChange={(e) => updateProject(id, { targetUser: e.target.value })}
            />
          </div>
          <div className="field">
            <div className="label">Current test — the riskiest assumption</div>
            <input
              value={p.test}
              onChange={(e) => updateProject(id, { test: e.target.value })}
            />
          </div>
          <div className="field">
            <div className="label">Success signal — observable, with a number</div>
            <input
              placeholder="3 of 10 testers open it twice"
              value={p.signal}
              onChange={(e) => updateProject(id, { signal: e.target.value })}
            />
          </div>
        </div>

        <div className="panel">
          <h3>Phase track</h3>
          <div className="hint" style={{ marginBottom: '0.6rem' }}>
            Forward or sideways only. A rest is a season like any other.
          </div>
          <div className="phase-track">
            {legalMoves(p.phase).map((ph) => (
              <button
                key={ph}
                className={ph === p.phase ? 'cur' : ''}
                onClick={() => movePhase(id, ph)}
              >
                {PHASE_LABEL[ph]}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => moveZone(id, 'harvest')}>🌕 Move to Harvest Shelf</button>
            <button onClick={() => moveZone(id, 'grove')}>🌳 Move to the Grove</button>
          </div>
        </div>

        <div className="panel">
          <h3>Echo log {p.echoes.length > 0 && <span className="sealed">{'★'.repeat(p.echoes.length)}</span>}</h3>
          <div className="hint" style={{ marginBottom: '0.6rem' }}>
            A stranger used it · someone paid · unsolicited feedback · a returning user.
          </div>
          {p.echoes.map((e, i) => (
            <div key={i} style={{ fontSize: '0.82rem' }}>
              <span className="sealed">★</span> {prettyDate(e.date)} — {e.note}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.7rem' }}>
            <input
              placeholder="what happened in the real world?"
              value={echoNote}
              onChange={(e) => setEchoNote(e.target.value)}
            />
            <button
              disabled={!echoNote.trim()}
              onClick={() => {
                addEcho(id, { date: isoDate(), type: 'usage', note: echoNote.trim() })
                setEchoNote('')
              }}
            >
              Place echo
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>Chronicle <span className="hint">· {p.chronicle.length} entries, never erased</span></h3>
          {p.chronicle.length === 0 ? (
            <div className="hint">Nothing written yet. The first Invocation begins it.</div>
          ) : (
            <ul className="chronicle-list">
              {p.chronicle.map((c, i) => (
                <li key={i}>
                  <span className="c">C{c.cycle} · {c.date}</span>
                  <span>{c.line}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h3>Feeling stuck?</h3>
          <div className="hint" style={{ marginBottom: '0.7rem' }}>
            One Itch per project per cycle. Pure provocation.
          </div>
          {itch ? (
            <div className="deck-row"><ItchCard itch={itch} /></div>
          ) : (
            <button onClick={drawItch}>Draw an Itch</button>
          )}
        </div>
      </div>
    </div>
  )
}
