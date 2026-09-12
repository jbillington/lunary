import { useMemo, useState } from 'react'
import { useGarden } from '../store'
import type { Draw } from '../lib/rules'
import {
  DAY_LABEL, HANDS_LIMIT, MAX_DRAWS, PHASE_LABEL,
  bedsFree, drawFor, isoDate, legalMoves, nextDayOccurrence, prettyDate,
} from '../lib/rules'
import { PlanetCard, SpiritCard } from './GameCard'
import { moonGlyph, moonName, moonPhase } from '../lib/moon'

const PRINCIPLE =
  'Every idea is a seed. Tend what the moon favors. ' +
  'Let each project become more itself.'

type Step = 'prepare' | 'review' | 'move' | 'divine' | 'close'
const STEPS: Step[] = ['prepare', 'review', 'move', 'divine', 'close']

interface DrawState {
  draw: Draw
  count: number
  invitation: string
  sealed: boolean
}

export function InvocationStepper({ onClose }: { onClose: () => void }) {
  const {
    projects, seedSlips, activeCycle,
    adoptSlip, moveZone, movePhase, recordReading, appendChronicle, closeCycle,
  } = useGarden()

  const [step, setStep] = useState<Step>('prepare')
  const [idx, setIdx] = useState(0) // which tended project we are divining for
  const [draws, setDraws] = useState<Record<string, DrawState>>({})

  const tended = useMemo(() => projects.filter((p) => p.zone === 'garden'), [projects])
  const phase = moonPhase()

  const stepIndex = STEPS.indexOf(step)
  const go = (s: Step) => setStep(s)

  // ---- the draw ----
  const current = tended[idx]
  const ds = current ? draws[current.id] : undefined

  function roll(project = current) {
    if (!project) return
    const prev = draws[project.id]
    if (prev && prev.count >= MAX_DRAWS) return // the third draw must be kept
    const d = drawFor(project)
    setDraws((s) => ({
      ...s,
      [project.id]: {
        draw: d,
        count: (prev?.count ?? 0) + 1,
        invitation: d.spirit.byPhase[project.phase],
        sealed: false,
      },
    }))
  }

  function seal() {
    if (!current || !ds) return
    const date = nextDayOccurrence(ds.draw.spirit.day)
    const scheduledDate = isoDate(date)
    const cycleId = activeCycle?.id ?? 1

    recordReading({
      projectId: current.id,
      planet: ds.draw.planet.id,
      spirit: ds.draw.spirit.id,
      draws: ds.count,
      scheduledDay: ds.draw.spirit.day,
      scheduledDate,
      invitation: ds.invitation,
      sealed: true,
    })
    appendChronicle(current.id, {
      cycle: cycleId,
      date: isoDate(),
      line: `${ds.draw.planet.name.replace('The ', '')} + ${ds.draw.spirit.name}: ${ds.invitation}`,
    })
    setDraws((s) => ({ ...s, [current.id]: { ...ds, sealed: true } }))
  }

  function nextProject() {
    if (idx + 1 < tended.length) setIdx(idx + 1)
    else go('close')
  }

  return (
    <div className="ritual">
      <div className="ritual-inner">
        <div className="candle">🕯</div>
        <div className="steps">
          {STEPS.map((s, i) => (
            <span key={s} className={i === stepIndex ? 'on' : i < stepIndex ? 'done' : ''} />
          ))}
        </div>

        {/* ---------- 1. PREPARE ---------- */}
        {step === 'prepare' && (
          <>
            <h2>Invocation</h2>
            <div className="sub">
              {moonGlyph(phase)} {moonName(phase)} · {prettyDate(isoDate())} · Cycle{' '}
              {activeCycle?.id ?? 1}
            </div>
            <p className="principle">{PRINCIPLE}</p>
            <p className="sub">Read it aloud. Then begin.</p>
            <div className="actions">
              <button className="ghost" onClick={onClose}>Blow out the candle</button>
              <button className="primary" onClick={() => go('review')}>I have read it</button>
            </div>
          </>
        )}

        {/* ---------- 2. REVIEW ---------- */}
        {step === 'review' && (
          <>
            <h2>Review the garden</h2>
            <div className="sub">Look at every zone. Count last cycle's moonpennies.</div>

            {projects.length === 0 && (
              <p className="empty">
                The garden is bare. Step forward and adopt a seed slip.
              </p>
            )}

            {projects.map((p) => (
              <div className="panel" key={p.id}>
                <h3>
                  {p.name}{' '}
                  <span className="hint">
                    · {PHASE_LABEL[p.phase]} · {p.zone}
                  </span>
                </h3>
                <div className="hint">{p.purpose || <em>no purpose written yet</em>}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className="label">Moonpennies</span>{' '}
                  {p.moonpennies.length === 0 ? (
                    <span className="hint">none yet — that is a measurement, not a failure</span>
                  ) : (
                    <span className="pennies">
                      {'◎'.repeat(p.moonpennies.length)}{' '}
                      <span className="hint">
                        last: {p.moonpennies[p.moonpennies.length - 1].note}
                      </span>
                    </span>
                  )}
                </div>
                {p.chronicle.length > 0 && (
                  <div style={{ marginTop: '0.6rem' }}>
                    <span className="label">Last visited</span>
                    <div className="chronicle-line">
                      {p.chronicle[p.chronicle.length - 1].line}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="actions">
              <button className="ghost" onClick={() => go('prepare')}>Back</button>
              <button className="primary" onClick={() => go('move')}>Move the garden</button>
            </div>
          </>
        )}

        {/* ---------- 3. MOVE ---------- */}
        {step === 'move' && (
          <>
            <h2>Move the garden</h2>
            <div className="sub">
              Wake a sleeper · rest the quiet · adopt a seed ·{' '}
              {bedsFree(projects)} of {HANDS_LIMIT} beds free
            </div>

            {seedSlips.length > 0 && (
              <div className="panel">
                <h3>🌱 The Seed Vault</h3>
                <div className="hint" style={{ marginBottom: '0.7rem' }}>
                  Adoption costs a bed. Everything else waits warmly.
                </div>
                {seedSlips.map((s) => (
                  <div className="slip" key={s.id}>
                    <strong>{s.name}</strong>
                    <div className="one">{s.oneLine}</div>
                    <div className="acts">
                      <button
                        disabled={bedsFree(projects) === 0}
                        onClick={() => adoptSlip(s.id)}
                      >
                        {bedsFree(projects) === 0 ? 'No bed free' : 'Adopt into a bed'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {projects.map((p) => (
              <div className="panel" key={p.id}>
                <h3>{p.name} <span className="hint">· {PHASE_LABEL[p.phase]}</span></h3>
                <div className="label">Phase — forward or sideways only</div>
                <div className="phase-track">
                  {legalMoves(p.phase).map((ph) => (
                    <button
                      key={ph}
                      className={ph === p.phase ? 'cur' : ''}
                      onClick={() => movePhase(p.id, ph)}
                    >
                      {PHASE_LABEL[ph]}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '0.7rem' }}>
                  {p.zone === 'garden' ? (
                    <button onClick={() => moveZone(p.id, 'conservatory')}>
                      🏡 Invite to rest
                    </button>
                  ) : p.zone === 'conservatory' ? (
                    <button
                      disabled={bedsFree(projects) === 0}
                      onClick={() => moveZone(p.id, 'garden')}
                    >
                      {bedsFree(projects) === 0 ? 'No bed free to wake into' : '🌿 Wake into a bed'}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

            <div className="actions">
              <button className="ghost" onClick={() => go('review')}>Back</button>
              <button
                className="primary"
                disabled={tended.length === 0}
                onClick={() => { setIdx(0); go('divine') }}
              >
                {tended.length === 0
                  ? 'Nothing tended to divine for'
                  : `Divine for ${tended.length} project${tended.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </>
        )}

        {/* ---------- 4. DIVINE ---------- */}
        {step === 'divine' && current && (
          <>
            <h2>{current.name}</h2>
            <div className="sub">
              {PHASE_LABEL[current.phase]} · project {idx + 1} of {tended.length}
            </div>

            {!ds ? (
              <>
                <p className="principle" style={{ fontSize: '1.05rem' }}>
                  “{current.name}, what do you need to become more yourself?”
                </p>
                <div className="actions">
                  <button className="primary" onClick={() => roll()}>Draw Planet + Spirit</button>
                </div>
                {current.lastSpirit && (
                  <p className="hint" style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Last cycle's spirit is filtered out of the deck.
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="deck-row" key={ds.count}>
                  <PlanetCard planet={ds.draw.planet} />
                  <SpiritCard spirit={ds.draw.spirit} />
                </div>

                <div className="stateline">
                  <div className="who">
                    {ds.draw.spirit.name} · {PHASE_LABEL[current.phase]}
                  </div>
                  <p>{ds.draw.spirit.byPhase[current.phase]}</p>
                </div>

                {!ds.sealed && (
                  <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                    {ds.count < MAX_DRAWS ? (
                      <button onClick={() => roll()}>
                        Redraw ({MAX_DRAWS - ds.count} left
                        {ds.count === MAX_DRAWS - 1 ? ' — the third must be kept' : ''})
                      </button>
                    ) : (
                      <p className="warn">
                        Third draw. This one is kept.
                      </p>
                    )}
                  </div>
                )}

                <div className="panel">
                  <div className="field">
                    <div className="label">The invitation — write it as you will do it</div>
                    <textarea
                      rows={2}
                      value={ds.invitation}
                      disabled={ds.sealed}
                      onChange={(e) =>
                        setDraws((s) => ({
                          ...s,
                          [current.id]: { ...ds, invitation: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="field">
                    <div className="label">Scheduled — the spirit's planetary day</div>
                    <div>
                      {DAY_LABEL[ds.draw.spirit.day]},{' '}
                      {prettyDate(isoDate(nextDayOccurrence(ds.draw.spirit.day)))}
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">Chronicle line — permanent</div>
                    <div className="chronicle-line">
                      C{activeCycle?.id ?? 1} · {isoDate()} —{' '}
                      {ds.draw.planet.name.replace('The ', '')} + {ds.draw.spirit.name}:{' '}
                      {ds.invitation}
                    </div>
                  </div>
                </div>

                <div className="actions">
                  {ds.sealed ? (
                    <>
                      <span className="sealed">✦ Sealed. The vow is made.</span>
                      <button className="primary" onClick={nextProject}>
                        {idx + 1 < tended.length ? 'Next project' : 'Close the ceremony'}
                      </button>
                    </>
                  ) : (
                    <button className="primary" onClick={seal}>Seal this reading</button>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* ---------- 5. CLOSE ---------- */}
        {step === 'close' && (
          <>
            <h2>The garden is set</h2>
            <div className="sub">
              Return the Planet and Spirit cards. New ones arrive next moon.
            </div>

            {activeCycle?.readings.map((r) => {
              const p = projects.find((x) => x.id === r.projectId)
              return (
                <div className="panel" key={r.projectId}>
                  <h3>{p?.name}</h3>
                  <div className="hint">{r.invitation}</div>
                  <div className="sealed" style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
                    {DAY_LABEL[r.scheduledDay]}, {prettyDate(r.scheduledDate)}
                  </div>
                </div>
              )
            })}

            <div className="actions">
              <button
                className="primary"
                onClick={() => { closeCycle(); onClose() }}
              >
                Blow out the candle
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
