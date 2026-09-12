import type { Phase } from '../types'

/**
 * A project drawn as what it is: a plant at a stage of growth.
 *
 * The phase track stops being a label and becomes the picture — a seed is a
 * mound, a Full project is in flower, a Waning one carries moonpennies, a
 * Resting one sits under a cloche. You can read the whole garden at a glance
 * without reading a single word.
 *
 * Single-weight line art, per the spec's art direction. Drawn in a 56×64 box
 * with the soil line at y=58.
 */
export function Plant({ phase, size = 56 }: { phase: Phase; size?: number }) {
  return (
    <svg
      viewBox="0 0 56 64"
      width={size}
      height={(size / 56) * 64}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* soil */}
      <path d="M6 58 Q28 54 50 58" stroke="#4a3f35" strokeWidth="3" />

      {phase === 'seed' && (
        <>
          <path d="M20 58 Q28 50 36 58" stroke="#5a4c40" strokeWidth="2" />
          <circle cx="28" cy="54" r="3" fill="#c9b896" />
          <path d="M28 51 v-4" stroke="#6fae82" strokeWidth="2" />
        </>
      )}

      {phase === 'waxing' && (
        <>
          <path d="M28 58 V36" stroke="#6fae82" strokeWidth="2.5" />
          <path d="M28 44 Q18 40 16 31 Q26 31 28 40" fill="#6fae82" opacity=".85" />
          <path d="M28 40 Q38 36 40 27 Q30 27 28 36" fill="#6fae82" opacity=".7" />
        </>
      )}

      {phase === 'full' && (
        <>
          <path d="M28 58 V26" stroke="#6fae82" strokeWidth="2.5" />
          <path d="M28 46 Q17 42 15 32 Q26 32 28 42" fill="#6fae82" opacity=".85" />
          <path d="M28 42 Q39 38 41 28 Q30 28 28 38" fill="#6fae82" opacity=".7" />
          {/* four-petalled flower — Lunaria is a crucifer */}
          <g transform="translate(28 20)">
            <circle cx="0" cy="-6" r="4.4" fill="#c8a2e0" />
            <circle cx="6" cy="0" r="4.4" fill="#c8a2e0" />
            <circle cx="0" cy="6" r="4.4" fill="#b98fd6" />
            <circle cx="-6" cy="0" r="4.4" fill="#b98fd6" />
            <circle cx="0" cy="0" r="2.4" fill="#f2ead8" />
          </g>
        </>
      )}

      {phase === 'waning' && (
        <>
          <path d="M28 58 V24" stroke="#8a8f6d" strokeWidth="2.5" />
          {/* the moonpennies themselves — translucent silver seedpods */}
          <circle cx="18" cy="34" r="7" fill="#c9cfe0" opacity=".55" stroke="#e8edf8" strokeWidth="1.2" />
          <circle cx="38" cy="30" r="7.5" fill="#c9cfe0" opacity=".55" stroke="#e8edf8" strokeWidth="1.2" />
          <circle cx="28" cy="18" r="6.5" fill="#c9cfe0" opacity=".55" stroke="#e8edf8" strokeWidth="1.2" />
        </>
      )}

      {phase === 'resting' && (
        <>
          <path d="M28 58 V46" stroke="#6b6255" strokeWidth="2.5" />
          {/* cloche — a bell jar over the sleeping stem */}
          <path d="M12 58 A16 18 0 0 1 44 58 Z" fill="#9fb6d8" opacity=".16" stroke="#8fa6c8" strokeWidth="1.6" />
          <path d="M28 40 v-5" stroke="#8fa6c8" strokeWidth="1.6" />
          <circle cx="28" cy="34" r="2" fill="#8fa6c8" />
        </>
      )}
    </svg>
  )
}

/** A seed slip in the Vault — an idea that has not been planted yet. */
export function SeedPacket({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 34 42" width={size} height={(size / 34) * 42} fill="none" aria-hidden="true">
      <rect x="3" y="4" width="28" height="34" rx="2.5" fill="#e8dcc0" stroke="#a89b7d" strokeWidth="1.4" />
      <path d="M3 13 H31" stroke="#a89b7d" strokeWidth="1.2" />
      <circle cx="17" cy="25" r="5" fill="none" stroke="#8a7f66" strokeWidth="1.2" />
      <circle cx="17" cy="25" r="1.8" fill="#8a7f66" />
    </svg>
  )
}
