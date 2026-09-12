import { useGarden } from '../store'
import type { Project, Zone } from '../types'
import { HANDS_LIMIT, PHASE_LABEL, bedsFree } from '../lib/rules'

const ZONES: { id: Zone; title: string; blurb: string }[] = [
  { id: 'vault', title: '🌱 Seed Vault', blurb: 'Every idea waits warmly' },
  { id: 'garden', title: '🌿 Garden Beds', blurb: 'Tended — visited each moon' },
  { id: 'conservatory', title: '🏡 Conservatory', blurb: 'Sleeping through winter' },
  { id: 'grove', title: '🌳 The Grove', blurb: 'Elders who teach' },
  { id: 'harvest', title: '🌕 Harvest Shelf', blurb: 'Alive in the world' },
]

function ProjectTile({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <button className="pcard" onClick={onOpen}>
      <div className="name">{p.name}</div>
      <div className="purpose">{p.purpose}</div>
      <div className="row">
        <span>{PHASE_LABEL[p.phase]}</span>
        {p.echoes.length > 0 && <span className="stars">{'★'.repeat(p.echoes.length)}</span>}
        {p.chronicle.length > 0 && <span>· {p.chronicle.length}c</span>}
      </div>
    </button>
  )
}

export function Mat({ onOpen }: { onOpen: (id: string) => void }) {
  const { projects, seedSlips, adoptSlip, removeSlip } = useGarden()
  const free = bedsFree(projects)

  return (
    <div className="mat">
      {ZONES.map((z) => {
        const inZone = projects.filter((p) => p.zone === z.id)
        return (
          <section className={`zone ${z.id}`} key={z.id}>
            <span className="count">
              {z.id === 'garden' ? `${inZone.length}/${HANDS_LIMIT}` : inZone.length || ''}
            </span>
            <h2>{z.title}</h2>
            <div className="blurb">{z.blurb}</div>

            {z.id === 'vault' && (
              <>
                {seedSlips.map((s) => (
                  <div className="slip" key={s.id}>
                    <strong>{s.name}</strong>
                    <div className="one">{s.oneLine}</div>
                    <div className="acts">
                      <button disabled={free === 0} onClick={() => adoptSlip(s.id)}>
                        {free === 0 ? 'beds full' : 'adopt'}
                      </button>
                      <button className="ghost" onClick={() => removeSlip(s.id)}>
                        remove
                      </button>
                    </div>
                  </div>
                ))}
                {seedSlips.length === 0 && (
                  <div className="empty">No slips yet.<br />Every idea starts here.</div>
                )}
              </>
            )}

            {inZone.map((p) => (
              <ProjectTile key={p.id} p={p} onOpen={() => onOpen(p.id)} />
            ))}

            {z.id !== 'vault' && inZone.length === 0 && (
              <div className="empty">
                {z.id === 'garden' ? 'Adopt a seed to begin.' : '—'}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
