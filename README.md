# Lunary — M1 skeleton

A garden of software projects, tended on the rhythm of the moon.

Each project is a card. Each new moon you draw a **Planet** (the energy) and a
**Spirit** (the visitor); the pair tells you what work will move that project
forward, scheduled on the Spirit's planetary day. Each full moon you bring evidence
from the real world and let the project grow one step along its phase track.

> A *lunary* (Latin *lunarium*, "moonbook") is a real medieval genre: a book of
> prognostication organized by the thirty days of the moon's cycle, telling the reader
> what to undertake on each — when to travel, when to trade, when to plant. This is
> that book, kept for projects instead of crops.
>
> *Lunaria* is also the moon-plant, whose translucent silver seedpods growers call
> **moonpennies** — the game's one currency.

Full design doc — game description, rulebook, example of play, and PRD — in
[`SPEC.md`](./SPEC.md).

```bash
npm install
npm run dev      # http://localhost:5173
npm run typecheck
```

## What's here (M1)

- **F1 (partial)** — content pack: all 10 Planets, all 12 Itches, **3 of 16 Spirits**.
  The three (Cartographer, Lighthouse, Seedkeeper) are fully authored with per-phase
  lines so the ceremony can be played end to end.
- **F2** — projects, zones, phase track with legality enforced.
- **F3** — the Invocation stepper: Prepare → Review → Move → Divine → Close.
- **F6** — persistence (localStorage; see deviation below).
- **In-app tutorial** — "How to play" as a docked side panel; the board yields the
  space rather than being covered, so you can read and look at once.

## Rules the code actually enforces

| Rule | Where |
|---|---|
| Hands Limit — 3 tended beds | `store.ts` (`adoptSlip`, `moveZone`), `lib/rules.ts` |
| Phases forward/sideways only; Resting→Waxing is the wake | `lib/rules.ts` `canMoveTo` |
| No-Repeat — same Spirit can't come twice running | `lib/rules.ts` `availableSpirits` |
| The Rerule — 1 voluntary redraw, third draw kept | `MAX_DRAWS`, stepper `roll()` |
| Chronicle is append-only | `store.ts` `appendChronicle` |
| Invitation scheduled on the spirit's planetary day | `nextDayOccurrence` |
| Moonpennies are struck only for real-world answers | `store.ts` `strikeMoonpenny` |

## Deviations from the PRD

- **localStorage instead of idb-keyval.** Same guarantees at this data size, one fewer
  dependency. Swap when the chronicle outgrows ~5MB.
- **Spirit deck is 3 cards.** Deliberate — the point of M1 is testing whether the
  *ritual* holds, which 3 cards test as well as 16. The No-Repeat filter has a guard so
  a tiny deck can't empty the pool.

## Not yet built

Communion stepper (F4) · cycle history view (F7) · once-per-cycle Itch limit
(the button currently redraws freely) · telemetry (F10) · Deep Reading · Long Night ·
**sowing moonpennies** (SPEC §8.9 — spending a penny to seed a new idea).
