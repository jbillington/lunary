# Artwork

**All rights reserved.** See [`LICENSE-ART`](../../LICENSE-ART). The MIT licence on
this repository covers the source code only — it does not extend to anything here.

## How art is wired in

Cards render from content JSON through the single `<GameCard>` component. Assets live
here as named SVGs keyed by stable IDs (`planet-mercury.svg`, `spirit-cartographer.svg`).

**No art asset is referenced by path from game logic.** Upgrading art means replacing
files in this directory — zero code changes.

## Keeping final art out of the public repo

That indirection is also the seam for protecting finished artwork. A licence gives you
recourse after the fact; it does not stop anyone downloading a file from a public repo.
If final art is worth protecting, don't publish it here.

Options, in rough order of effort:

1. **Placeholder here, final art private.** Keep rough sketches in this directory and
   swap the real assets in at build time from a private source. The public repo stays
   runnable and honest about being a playtest build.
2. **Private submodule.** `src/art/final/` as a private git submodule — clones fine for
   you, silently absent for everyone else.
3. **Private npm package.** Heavier, but versions the art properly if the deck grows.

Until then this directory holds nothing: M1 renders glyphs and emoji inline from
`GameCard.tsx`, so there is no artwork in this repository yet.
