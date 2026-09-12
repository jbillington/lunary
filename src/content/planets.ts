import type { Planet } from '../types'

// All ten. These are short by design — the Planet sets the weather,
// the Spirit brings the work.
export const PLANETS: Planet[] = [
  {
    id: 'mercury', name: 'The Messenger', sigil: '☿', day: 'wed',
    energy: 'Words, clarity, exchange. Say it so a stranger understands it.',
  },
  {
    id: 'venus', name: 'The Enchanter', sigil: '♀', day: 'fri',
    energy: 'Beauty, desire, delight. Make it wanted, not merely useful.',
  },
  {
    id: 'mars', name: 'The Igniter', sigil: '♂', day: 'tue',
    energy: 'Ignition. Ship the scary small version before it is ready.',
  },
  {
    id: 'jupiter', name: 'The Expander', sigil: '♃', day: 'thu',
    energy: 'Expansion, generosity. Give more than was asked of you.',
  },
  {
    id: 'saturn', name: 'The Keeper', sigil: '♄', day: 'sat',
    energy: 'Structure, roots, rhythm. Nothing new enters; tend what holds.',
  },
  {
    id: 'sun', name: 'The Radiant', sigil: '☉', day: 'sun',
    energy: 'Radiance. Be seen. Announce it where people actually are.',
  },
  {
    id: 'moon', name: 'The Listener', sigil: '☽', day: 'mon',
    energy: 'Listening. Users, hunches, the thing said quietly and twice.',
  },
  {
    id: 'uranus', name: 'The Lightning', sigil: '♅', day: null,
    energy: 'Flip an assumption you have never once questioned.',
  },
  {
    id: 'neptune', name: 'The Veil', sigil: '♆', day: null,
    energy: 'Mystery, dream, atmosphere. What does it feel like at 2am?',
  },
  {
    id: 'pluto', name: 'The Depth', sigil: '♇', day: null,
    energy: 'Transform it completely — for exactly one user.',
  },
]

export const PLANET_BY_ID = Object.fromEntries(
  PLANETS.map((p) => [p.id, p]),
) as Record<Planet['id'], Planet>
