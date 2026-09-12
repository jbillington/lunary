import type { Spirit } from '../types'

// PLACEHOLDER CONTENT PACK — 3 of the eventual 16.
// These three are fully authored so the ritual can be played end to end.
// The remaining 13 (Alchemist, Ferryman, Gardener, Weaver, Fool, Thief, Mirror,
// Bell-Ringer, Flame-Keeper, Twin, Blindfold, Lantern, Crane) get written once
// the stepper proves the ceremony works.
export const SPIRITS: Spirit[] = [
  {
    id: 'cartographer',
    name: 'The Cartographer',
    glyph: '🗺',
    day: 'wed',
    energy: 'Nothing is fixed until the territory is drawn.',
    gift: 'A map of the journey your user actually walks — not the one you designed.',
    invitation: 'Draw the path end to end. Mark every place they stall.',
    twist: 'The stalls are the product. The rest is scenery.',
    byPhase: {
      seed: "Draw the journey as your user would walk it, from their complaint to their relief. Mark every place they'd stall.",
      waxing: 'Walk your own build as a stranger. Time each step. The longest step is this cycle\'s work.',
      full: 'Map where real users diverge from your map. Their detour is the next feature.',
      waning: 'Publish the map. It outlives the build.',
      resting: 'Redraw the map from memory. What you forgot was never load-bearing.',
    },
  },
  {
    id: 'lighthouse',
    name: 'The Lighthouse',
    glyph: '🗼',
    day: 'fri',
    energy: 'One light, seen far, beats ten lights seen near.',
    gift: 'Permission to remove.',
    invitation: 'Remove everything that dims the one promise.',
    twist: 'Delete the second-best feature. Not the worst — the second-best.',
    byPhase: {
      seed: 'Write the one promise in a single sentence. Anything the sentence does not name is not in v1.',
      waxing: 'Strip to the one light. Hide the rest behind a door nobody has to open.',
      full: 'Ask a user what it does. If their answer has an "and" in it, you have two lights.',
      waning: 'Name the one thing it will be remembered for. Say only that from now on.',
      resting: 'While it sleeps, decide which single light would be worth waking it for.',
    },
  },
  {
    id: 'seedkeeper',
    name: 'The Seedkeeper',
    glyph: '🌰',
    day: 'thu',
    energy: 'What you learned is worth more than what you built.',
    gift: 'A second product hiding inside the first.',
    invitation: 'Condense what you learned into a template others can use.',
    twist: 'Give it away free. The giveaway will travel further than the thing.',
    byPhase: {
      seed: 'Before building, write the one-page version. If the page is enough, ship the page.',
      waxing: 'Extract the reusable piece and name it. It may be the better product.',
      full: 'Give the map away. The artifact is the product\'s twin and spreads without you.',
      waning: 'Harvest: turn this project\'s lessons into a template, a post, or a kit.',
      resting: 'Save one seed from it — a sentence, a mechanic — for whatever comes next.',
    },
  },
]

export const SPIRIT_BY_ID = Object.fromEntries(
  SPIRITS.map((s) => [s.id, s]),
) as Record<string, Spirit>
