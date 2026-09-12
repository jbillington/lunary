import { useState } from 'react'
import { useGarden } from './store'
import { Mat } from './components/Mat'
import { ProjectDetail } from './components/ProjectDetail'
import { InvocationStepper } from './components/InvocationStepper'
import { Tutorial } from './components/Tutorial'
import { Moonbook } from './components/Moonbook'
import { daysToNewMoon, moonGlyph, moonName, moonPhase } from './lib/moon'
import { isoDate, prettyDate } from './lib/rules'
import { timeline } from './lib/history'

type Panel = 'tutorial' | 'moonbook' | null

export default function App() {
  const { projects, cycles, activeCycle, addSlip, beginInvocation } = useGarden()
  const [open, setOpen] = useState<string | null>(null)
  const [ritual, setRitual] = useState(false)
  const [panel, setPanel] = useState<Panel>(null)
  const [slipName, setSlipName] = useState('')
  const [slipLine, setSlipLine] = useState('')

  const readingCount = timeline(cycles, activeCycle).length

  const phase = moonPhase()
  const toNew = daysToNewMoon()

  function begin() {
    if (!activeCycle) beginInvocation()
    setRitual(true)
  }

  function newSlip(e: React.FormEvent) {
    e.preventDefault()
    if (!slipName.trim()) return
    addSlip(slipName.trim(), slipLine.trim())
    setSlipName('')
    setSlipLine('')
  }

  return (
    <div className={panel ? 'app with-panel' : 'app'}>
      <header className="sky">
        <span className="moon">{moonGlyph(phase)}</span>
        <h1>LUNARY</h1>
        <div className="spacer" />
        <div className="meta">
          {moonName(phase)} · {prettyDate(isoDate())} ·{' '}
          {toNew === 0 ? 'new moon tonight' : `${toNew}d to the new moon`} ·{' '}
          {cycles.length} cycle{cycles.length === 1 ? '' : 's'} chronicled
        </div>
        <button
          className="ghost"
          onClick={() => setPanel(panel === 'moonbook' ? null : 'moonbook')}
        >
          📖 Moonbook{readingCount > 0 && ` · ${readingCount}`}
        </button>
        <button
          className="ghost"
          onClick={() => setPanel(panel === 'tutorial' ? null : 'tutorial')}
        >
          How to play
        </button>
        <button className="primary" onClick={begin}>
          {activeCycle ? 'Resume Invocation' : '🕯 Begin New Moon'}
        </button>
      </header>

      <p className="principle">
        Every idea is a seed. Tend what the moon favors.
        Let each project become more itself.
      </p>

      <Mat onOpen={setOpen} />

      <form
        onSubmit={newSlip}
        style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
      >
        <input
          style={{ flex: '0 0 200px' }}
          placeholder="new seed slip — name"
          value={slipName}
          onChange={(e) => setSlipName(e.target.value)}
        />
        <input
          style={{ flex: 1, minWidth: '220px' }}
          placeholder="…and one line"
          value={slipLine}
          onChange={(e) => setSlipLine(e.target.value)}
        />
        <button type="submit">Write the slip</button>
      </form>

      {projects.length === 0 && (
        <p className="hint" style={{ textAlign: 'center', marginTop: '2rem' }}>
          Write three slips, adopt them into beds, then begin the new moon.
          <br />
          <button
            className="ghost"
            style={{ marginTop: '0.8rem' }}
            onClick={() => setPanel('tutorial')}
          >
            New here? Read how to play →
          </button>
        </p>
      )}

      {open && <ProjectDetail id={open} onClose={() => setOpen(null)} />}
      {ritual && <InvocationStepper onClose={() => setRitual(false)} />}
      {panel === 'tutorial' && <Tutorial onClose={() => setPanel(null)} />}
      {panel === 'moonbook' && <Moonbook onClose={() => setPanel(null)} />}
    </div>
  )
}
