import { PHASE_LABEL, HANDS_LIMIT, MAX_DRAWS, DAY_LABEL } from '../lib/rules'
import { PLANETS } from '../content/planets'
import { SPIRITS } from '../content/spirits'
import { ITCHES } from '../content/itches'

// The manual, docked beside the garden — the board yields the space rather than
// being covered, so you can read and look at the same time.

export function Tutorial({ onClose }: { onClose: () => void }) {
  return (
    <aside className="sidepanel tutorial" aria-label="How to play">
        <div className="sidepanel-head">
          <h2>How to play</h2>
          <div style={{ flex: 1 }} />
          <button className="ghost" onClick={onClose}>Close</button>
        </div>

        <div className="sidepanel-body">
          <div className="panel">
            <h3>What this is</h3>
            <p>
              A garden of projects, tended on the rhythm of the moon. Each project is a
              card. Each new moon you draw a <strong>Planet</strong> (the energy) and a{' '}
              <strong>Spirit</strong> (the visitor), and the pair tells you what work will
              move that project forward. Each full moon you bring evidence from the real
              world and let the project grow one step.
            </p>
            <p>
              It is not a productivity system. It is closer to tarot for your projects —
              the cards don't decide for you, they provoke the idea you wouldn't have had
              on your own. The discipline comes from the moon. The creativity comes from
              the draw.
            </p>
            <p>
              You are the gardener and the reader. The work is tending: season after
              season, letting each project become more itself.
            </p>
            <p className="hint">
              A <em>lunary</em> is a medieval moonbook — a book of prognostication
              organized by the thirty days of the moon's cycle, telling you what to
              undertake on each: when to travel, when to trade, when to plant.
            </p>
          </div>

          <div className="panel">
            <h3>The five zones</h3>
            <ul className="tut-list">
              <li><strong>🌱 Seed Vault</strong> — ideas on slips. Unlimited. Where everything begins.</li>
              <li><strong>🌿 Garden Beds</strong> — projects you are actively tending. <strong>Max {HANDS_LIMIT}</strong>, because you have two hands.</li>
              <li><strong>🏡 Conservatory</strong> — projects sleeping through winter. Wake any of them at any new moon.</li>
              <li><strong>🌳 The Grove</strong> — projects whose purpose is complete. They taught you something; now they give counsel.</li>
              <li><strong>🌕 Harvest Shelf</strong> — shipped and alive in the world.</li>
            </ul>
          </div>

          <div className="panel">
            <h3>The phase track</h3>
            <p className="hint">Every project sits on one of five phases:</p>
            <ul className="tut-list">
              <li><strong>{PHASE_LABEL.seed}</strong> — adopted into a bed, work begins.</li>
              <li><strong>{PHASE_LABEL.waxing}</strong> — building toward first contact with real users.</li>
              <li><strong>{PHASE_LABEL.full}</strong> — it exists in the world and someone who isn't you is using it.</li>
              <li><strong>{PHASE_LABEL.waning}</strong> — harvesting: revenue, feedback, templates, lessons.</li>
              <li><strong>{PHASE_LABEL.resting}</strong> — asleep in the Conservatory.</li>
            </ul>
            <p>
              Phases move <strong>forward or sideways only — never backward.</strong>{' '}
              Iteration is always progress, and a rest is a season like any other. The app
              won't offer you an illegal move, so you can't get it wrong.
            </p>
            <p className="hint">
              The one way "back" is the wake: a Resting project returns to Waxing when you
              move it into a free bed.
            </p>
          </div>

          <div className="panel">
            <h3>Your first ten minutes</h3>
            <ol className="tut-list">
              <li>
                At the bottom of the home page, <strong>write two or three seed slips</strong> —
                a name and one line each. Anything you've been meaning to build.
              </li>
              <li>
                In the Seed Vault, hit <strong>adopt</strong> on the ones you want to work
                on this month. Adoption costs a bed; you get three.
              </li>
              <li>
                Hit <strong>🕯 Begin New Moon</strong> in the header. Don't worry about the
                real lunar date — the ceremony is triggered by you, not the calendar.
              </li>
              <li>
                <strong>Read the Principle aloud.</strong> Yes, actually. It's the part that
                makes this a ritual instead of a form.
              </li>
              <li>
                Walk the four steps: <em>Review</em> the garden, <em>Move</em> it
                (wake/rest/advance), then <em>Divine</em> for each tended project.
              </li>
              <li>
                At each draw, read the <strong>state line</strong> — the violet box. That's
                the divination: the same Spirit means something different depending on the
                project's phase.
              </li>
              <li>
                Rewrite the invitation in your own words, <strong>seal it</strong>, and put
                the scheduled day in your real calendar. The seal is the vow.
              </li>
            </ol>
          </div>

          <div className="panel">
            <h3>The rules that bite</h3>
            <ul className="tut-list">
              <li>
                <strong>The Hands Limit.</strong> {HANDS_LIMIT} beds, no exceptions.
                Adopting a fourth project means something else rests first.
              </li>
              <li>
                <strong>The No-Repeat rule.</strong> A project can't receive the same Spirit
                two cycles running — the deck is filtered before you draw. Planets may
                repeat.
              </li>
              <li>
                <strong>The Rerule.</strong> You get one voluntary redraw. If you redraw a
                second time, the <strong>{MAX_DRAWS}rd draw must be kept.</strong> Agency,
                but no reshuffling until you like the answer.
              </li>
              <li>
                <strong>The chronicle is permanent.</strong> Every sealed reading appends
                one line to the project's diary and is never erased. After a few months, the
                back of a card tells the story of its own life.
              </li>
              <li>
                <strong>Work happens on planetary days.</strong> Each Spirit names a weekday
                ({Object.values(DAY_LABEL).join(' · ')}). The invitation is scheduled there,
                not "sometime."
              </li>
            </ul>
          </div>

          <div className="panel">
            <h3>Moonpennies, and what "winning" means</h3>
            <p>
              <em>Lunaria</em> — the moon-plant — makes translucent silver seedpods that
              growers call <strong>moonpennies</strong>. Each one is a coin and a seed
              packet at the same time.
            </p>
            <p>
              Open any project and you'll find its moonpennies. You strike one every time
              the world answers: a stranger used it, someone paid, someone wrote back
              unprompted, a user returned. They are the only currency here, and the world
              mints them, not you.
            </p>
            <p>
              Moonpennies don't pass or fail a project — they tell you which way it wants
              to grow. None yet is a measurement, not a verdict.
            </p>
            <p className="hint">
              There is no score and no end state. The garden is healthy when a real product
              step ships each moon, every tended project has a scheduled invitation, the
              chronicles keep growing, and the Harvest Shelf keeps filling.
            </p>
          </div>

          <div className="panel">
            <h3>Feeling stuck</h3>
            <p>
              Open a project and draw an <strong>Itch</strong> — a pure provocation with no
              respect for your roadmap ({ITCHES.length} of them). Perform it, or let it
              spark something better. Either way it goes in the chronicle.
            </p>
            <p className="hint">
              Intended as once per project per cycle. That limit isn't wired up yet — see
              below.
            </p>
          </div>

          <div className="panel">
            <h3>What's built, and what isn't</h3>
            <p>
              This is <strong>M1</strong> — a skeleton built to test whether the ceremony
              actually feels right before the rest of the content gets written.
            </p>
            <ul className="tut-list">
              <li>
                <strong>{PLANETS.length} Planets</strong> and{' '}
                <strong>{ITCHES.length} Itches</strong> — complete.
              </li>
              <li>
                <strong>{SPIRITS.length} Spirits of an eventual 16</strong> —{' '}
                {SPIRITS.map((s) => s.name).join(', ')}. Each fully written with all five
                phase lines. The other thirteen come after this ritual proves out.
              </li>
              <li><strong>The Invocation</strong> (new moon) works end to end.</li>
              <li>
                <strong>Not yet:</strong> the Communion ceremony (full moon), cycle history,
                the once-per-cycle Itch limit, the quarterly Deep Reading, and the annual
                Long Night.
              </li>
            </ul>
            <p className="hint">
              Everything is stored locally in this browser. Nothing leaves your machine.
            </p>
          </div>

          <div className="actions">
            <button className="primary" onClick={onClose}>Go to the garden</button>
          </div>
        </div>
    </aside>
  )
}
