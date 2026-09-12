import type { Itch, Planet, Spirit } from '../types'
import { DAY_LABEL } from '../lib/rules'

// One component renders every deck card. Art is a glyph for now; when real art
// arrives it drops in here and nowhere else.

export function PlanetCard({ planet }: { planet: Planet }) {
  return (
    <div className="gcard planet">
      <div className="sigil">{planet.sigil}</div>
      <h3 className="title">{planet.name}</h3>
      <div className="kind">Planet</div>
      <dl className="body">
        <dt>Energy</dt>
        <dd>{planet.energy}</dd>
      </dl>
      <div className="day">
        {planet.day ? DAY_LABEL[planet.day] : 'Any day of the cycle'}
      </div>
    </div>
  )
}

export function SpiritCard({ spirit }: { spirit: Spirit }) {
  return (
    <div className="gcard spirit">
      <div className="sigil">{spirit.glyph}</div>
      <h3 className="title">{spirit.name}</h3>
      <div className="kind">Spirit</div>
      <dl className="body">
        <dt>The Gift</dt>
        <dd>{spirit.gift}</dd>
        <dt>The Invitation</dt>
        <dd>{spirit.invitation}</dd>
        <dt>The Twist</dt>
        <dd>{spirit.twist}</dd>
      </dl>
      <div className="day">{DAY_LABEL[spirit.day]}</div>
    </div>
  )
}

export function ItchCard({ itch }: { itch: Itch }) {
  return (
    <div className="gcard itch">
      <div className="sigil">✦</div>
      <h3 className="title">{itch.name}</h3>
      <div className="kind">Itch</div>
      <dl className="body">
        <dt>Provocation</dt>
        <dd>{itch.provocation}</dd>
      </dl>
      <div className="day">Perform it, or let it spark better.</div>
    </div>
  )
}
