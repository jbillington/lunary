// The Night Garden — domain types.
// These exist so the rules can be enforced by the compiler as well as the code.

export type Phase = 'seed' | 'waxing' | 'full' | 'waning' | 'resting'

export type Zone = 'vault' | 'garden' | 'conservatory' | 'grove' | 'harvest'

export type Day = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'

export type PlanetId =
  | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn'
  | 'sun' | 'moon' | 'uranus' | 'neptune' | 'pluto'

export interface Planet {
  id: PlanetId
  name: string        // "The Messenger"
  sigil: string       // ☿
  energy: string      // one line
  /** Classical planets own a weekday. The three moderns float. */
  day: Day | null
}

export interface Spirit {
  id: string
  name: string        // "The Cartographer"
  glyph: string
  energy: string
  gift: string
  invitation: string
  twist: string
  /** The divination: the same card means something different given the state. */
  byPhase: Record<Phase, string>
  day: Day
  custom?: boolean
}

export interface Itch {
  id: string
  name: string
  provocation: string
}

export interface Echo {
  date: string        // ISO yyyy-mm-dd
  type: 'usage' | 'payment' | 'feedback' | 'return'
  note: string
}

export interface ChronicleEntry {
  cycle: number
  date: string
  line: string
}

export interface Project {
  id: string
  name: string
  purpose: string
  targetUser: string
  zone: Zone
  phase: Phase
  test: string
  signal: string
  echoes: Echo[]
  /** Enforces the No-Repeat rule. */
  lastSpirit: string | null
  chronicle: ChronicleEntry[]
  created: string
}

export interface SeedSlip {
  id: string
  name: string
  oneLine: string
  created: string
}

export interface Reading {
  projectId: string
  planet: PlanetId
  spirit: string
  /** How many times the deck was consulted. 3 = the third draw, which must be kept. */
  draws: number
  scheduledDay: Day
  scheduledDate: string
  invitation: string
  sealed: boolean
  itch?: string
}

export interface Cycle {
  id: number
  kind: 'newMoon' | 'fullMoon' | 'deepReading' | 'longNight'
  startedAt: string
  moonPhase: number
  readings: Reading[]
  review?: { shippableStep: 'yes' | 'no' | ''; note: string }
}
