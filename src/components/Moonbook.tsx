import { useGarden } from '../store'
import { timeline } from '../lib/history'
import { ReadingView } from './ReadingView'
import { prettyDate } from '../lib/rules'

/**
 * The Moonbook — every reading ever taken, newest first, grouped by cycle.
 * A lunary is a book you keep; this is the kept part.
 */
export function Moonbook({ onClose }: { onClose: () => void }) {
  const { projects, cycles, activeCycle } = useGarden()
  const records = timeline(cycles, activeCycle)
  const nameOf = (id: string) => projects.find((p) => p.id === id)?.name ?? 'a lost project'

  // Group consecutive records by cycle so each moon reads as one sitting.
  const byCycle: { cycle: number; date: string; open: boolean; records: typeof records }[] = []
  for (const r of records) {
    const last = byCycle[byCycle.length - 1]
    if (last && last.cycle === r.cycle) last.records.push(r)
    else byCycle.push({ cycle: r.cycle, date: r.date, open: r.open, records: [r] })
  }

  return (
    <aside className="sidepanel" aria-label="The Moonbook">
      <div className="sidepanel-head">
        <h2>The Moonbook</h2>
        <div style={{ flex: 1 }} />
        <button className="ghost" onClick={onClose}>Close</button>
      </div>

      <div className="sidepanel-body">
        {records.length === 0 ? (
          <p className="empty">
            No readings yet.
            <br />
            Begin a new moon and the book starts writing itself.
          </p>
        ) : (
          <>
            <p className="hint" style={{ marginBottom: '1rem' }}>
              {records.length} reading{records.length === 1 ? '' : 's'} across{' '}
              {byCycle.length} moon{byCycle.length === 1 ? '' : 's'}. Newest first.
            </p>

            {byCycle.map((group) => (
              <section key={group.cycle} style={{ marginBottom: '1.5rem' }}>
                <div className="cycle-head">
                  Cycle {group.cycle} · {prettyDate(group.date)}
                  {group.open && <span className="warn"> · candle still lit</span>}
                </div>
                {group.records.map((r, i) => (
                  <ReadingView
                    key={`${r.cycle}-${r.reading.projectId}-${i}`}
                    record={r}
                    projectName={nameOf(r.reading.projectId)}
                  />
                ))}
              </section>
            ))}
          </>
        )}
      </div>
    </aside>
  )
}
