import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChronicleEntry, Cycle, Echo, Phase, Project, Reading, SeedSlip, Zone } from './types'
import { HANDS_LIMIT, canMoveTo, isoDate, tendedCount } from './lib/rules'
import { moonPhase } from './lib/moon'

// M1 deviation from the PRD: localStorage via zustand/persist instead of
// idb-keyval. Same guarantees at this data size, one fewer dependency.
// Swap in idb-keyval when the chronicle outgrows ~5MB.

export interface GardenState {
  projects: Project[]
  seedSlips: SeedSlip[]
  cycles: Cycle[]
  activeCycle: Cycle | null

  addSlip: (name: string, oneLine: string) => void
  removeSlip: (id: string) => void
  /** Adoption costs a bed slot. Returns false if the Hands Limit blocks it. */
  adoptSlip: (id: string) => boolean

  addProject: (p: Pick<Project, 'name' | 'purpose' | 'targetUser'>) => void
  updateProject: (id: string, patch: Partial<Project>) => void
  moveZone: (id: string, zone: Zone) => boolean
  movePhase: (id: string, phase: Phase) => boolean
  addEcho: (id: string, echo: Echo) => void
  appendChronicle: (id: string, entry: ChronicleEntry) => void

  beginInvocation: () => void
  recordReading: (r: Reading) => void
  closeCycle: () => void
  reset: () => void
}

const uid = (prefix: string) =>
  `${prefix}${Math.random().toString(36).slice(2, 9)}`

export const useGarden = create<GardenState>()(
  persist(
    (set, get) => ({
      projects: [],
      seedSlips: [],
      cycles: [],
      activeCycle: null,

      addSlip: (name, oneLine) =>
        set((s) => ({
          seedSlips: [...s.seedSlips, { id: uid('s'), name, oneLine, created: isoDate() }],
        })),

      removeSlip: (id) =>
        set((s) => ({ seedSlips: s.seedSlips.filter((x) => x.id !== id) })),

      adoptSlip: (id) => {
        const { seedSlips, projects } = get()
        const slip = seedSlips.find((x) => x.id === id)
        if (!slip) return false
        if (tendedCount(projects) >= HANDS_LIMIT) return false // the Hands Limit
        set((s) => ({
          seedSlips: s.seedSlips.filter((x) => x.id !== id),
          projects: [
            ...s.projects,
            {
              id: uid('p'),
              name: slip.name,
              purpose: slip.oneLine,
              targetUser: '',
              zone: 'garden',
              phase: 'seed',
              test: '',
              signal: '',
              echoes: [],
              lastSpirit: null,
              chronicle: [],
              created: isoDate(),
            },
          ],
        }))
        return true
      },

      addProject: ({ name, purpose, targetUser }) =>
        set((s) => ({
          projects: [
            ...s.projects,
            {
              id: uid('p'), name, purpose, targetUser,
              zone: tendedCount(s.projects) < HANDS_LIMIT ? 'garden' : 'conservatory',
              phase: 'seed', test: '', signal: '', echoes: [],
              lastSpirit: null, chronicle: [], created: isoDate(),
            },
          ],
        })),

      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      moveZone: (id, zone) => {
        const { projects } = get()
        if (zone === 'garden' && tendedCount(projects) >= HANDS_LIMIT) {
          const already = projects.find((p) => p.id === id)?.zone === 'garden'
          if (!already) return false
        }
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  zone,
                  // Waking a sleeper puts it back to Waxing; resting is a phase too.
                  phase: zone === 'conservatory' ? 'resting'
                    : p.phase === 'resting' && zone === 'garden' ? 'waxing'
                    : p.phase,
                }
              : p,
          ),
        }))
        return true
      },

      movePhase: (id, phase) => {
        const p = get().projects.find((x) => x.id === id)
        if (!p || !canMoveTo(p.phase, phase)) return false // never backward
        set((s) => ({
          projects: s.projects.map((x) =>
            x.id === id
              ? { ...x, phase, zone: phase === 'resting' ? 'conservatory' : x.zone }
              : x,
          ),
        }))
        return true
      },

      addEcho: (id, echo) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, echoes: [...p.echoes, echo] } : p,
          ),
        })),

      appendChronicle: (id, entry) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            // Append only. The chronicle is never erased.
            p.id === id ? { ...p, chronicle: [...p.chronicle, entry] } : p,
          ),
        })),

      beginInvocation: () =>
        set((s) => ({
          activeCycle: {
            id: s.cycles.length + 1,
            kind: 'newMoon',
            startedAt: isoDate(),
            moonPhase: moonPhase(),
            readings: [],
          },
        })),

      recordReading: (r) =>
        set((s) => {
          if (!s.activeCycle) return s
          return {
            activeCycle: {
              ...s.activeCycle,
              readings: [...s.activeCycle.readings.filter((x) => x.projectId !== r.projectId), r],
            },
            projects: s.projects.map((p) =>
              p.id === r.projectId ? { ...p, lastSpirit: r.spirit } : p,
            ),
          }
        }),

      closeCycle: () =>
        set((s) =>
          s.activeCycle
            ? { cycles: [...s.cycles, s.activeCycle], activeCycle: null }
            : s,
        ),

      reset: () => set({ projects: [], seedSlips: [], cycles: [], activeCycle: null }),
    }),
    { name: 'night-garden-v1' },
  ),
)
