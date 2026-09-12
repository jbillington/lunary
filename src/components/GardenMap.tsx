import { useGarden } from '../store'
import type { Project, Zone } from '../types'
import { HANDS_LIMIT, PHASE_LABEL, bedsFree } from '../lib/rules'
import { moonGlyph, moonPhase } from '../lib/moon'
import { Plant, SeedPacket } from './Plant'

/**
 * The garden as a place you travel, not a set of buckets.
 *
 * Zones are locations on a map joined by a path that runs the way a project
 * actually moves: out of the Vault, into the Beds, and on to whichever ending
 * it earns. Projects stand where they live, drawn as plants at their phase.
 *
 * Map space is 1000×600; tokens are positioned as percentages of that so the
 * whole thing scales with the viewport.
 */

const W = 1000
const H = 600

interface Place {
  id: Zone
  title: string
  icon: string
  blurb: string
  x: number
  y: number
}

const PLACES: Place[] = [
  { id: 'vault', title: 'Seed Vault', icon: '🌱', blurb: 'where everything begins', x: 118, y: 470 },
  { id: 'garden', title: 'Garden Beds', icon: '🌿', blurb: 'tended each moon', x: 382, y: 352 },
  { id: 'conservatory', title: 'Conservatory', icon: '🏡', blurb: 'sleeping through winter', x: 636, y: 462 },
  { id: 'grove', title: 'The Grove', icon: '🌳', blurb: 'elders who teach', x: 762, y: 226 },
  { id: 'harvest', title: 'Harvest Shelf', icon: '🌕', blurb: 'alive in the world', x: 902, y: 104 },
]

const PLACE_BY_ID = Object.fromEntries(PLACES.map((p) => [p.id, p])) as Record<Zone, Place>

// The routes a project can travel. Conservatory ↔ Beds is drawn dashed because
// it runs both ways: a project rests, and later wakes back into a bed.
const ROUTES = [
  { d: 'M118,470 C196,438 292,392 382,352', dashed: false },
  { d: 'M382,352 C462,378 556,428 636,462', dashed: true },
  { d: 'M382,352 C512,308 646,262 762,226', dashed: false },
  { d: 'M762,226 C812,190 858,146 902,104', dashed: false },
]

const pct = (v: number, total: number) => `${(v / total) * 100}%`

/** Fan several projects around their place so they do not stack. */
function offsetFor(i: number, n: number) {
  const spread = n === 1 ? 0 : 74
  const x = (i - (n - 1) / 2) * spread
  const y = n > 2 && i % 2 === 1 ? 26 : 0
  return { x, y }
}

function ProjectToken({
  p, place, i, n, onOpen,
}: { p: Project; place: Place; i: number; n: number; onOpen: () => void }) {
  const { x, y } = offsetFor(i, n)
  return (
    <button
      className="token"
      style={{
        left: pct(place.x + x, W),
        top: pct(place.y + y, H),
        animationDelay: `${(i % 4) * 0.7}s`,
      }}
      onClick={onOpen}
      title={`${p.name} — ${PHASE_LABEL[p.phase]}`}
    >
      <Plant phase={p.phase} />
      <span className="token-name">{p.name}</span>
      {p.moonpennies.length > 0 && (
        <span className="token-pennies">{'◎'.repeat(Math.min(p.moonpennies.length, 5))}</span>
      )}
    </button>
  )
}

export function GardenMap({ onOpen }: { onOpen: (id: string) => void }) {
  const { projects, seedSlips, adoptSlip } = useGarden()
  const phase = moonPhase()
  const free = bedsFree(projects)

  // The moon rides an arc across the sky, placed by tonight's actual phase.
  const t = phase
  const moonX = 70 + t * (W - 140)
  const moonY = 96 - Math.sin(t * Math.PI) * 58

  return (
    <div className="map" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg className="map-bg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="sky" cx="50%" cy="0%" r="90%">
            <stop offset="0%" stopColor="#1d2246" />
            <stop offset="60%" stopColor="#121634" />
            <stop offset="100%" stopColor="#0c0f24" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b2a30" />
            <stop offset="100%" stopColor="#101a20" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} fill="url(#sky)" />

        {/* stars */}
        {Array.from({ length: 60 }, (_, i) => {
          const sx = (i * 137.5) % W
          const sy = ((i * 89.3) % 300) + 8
          const r = i % 7 === 0 ? 1.7 : 1
          return <circle key={i} cx={sx} cy={sy} r={r} fill="#fff" opacity={i % 3 ? 0.32 : 0.6} />
        })}

        {/* the moon, where it actually is tonight */}
        <circle cx={moonX} cy={moonY} r="26" fill="#f2ead8" opacity=".16" filter="url(#glow)" />
        <circle cx={moonX} cy={moonY} r="13" fill="#f2ead8" opacity=".5" />

        {/* far hills */}
        <path d={`M0,300 Q160,246 330,292 T640,270 T${W},300 L${W},${H} L0,${H} Z`} fill="#151d2e" />
        <path d={`M0,352 Q220,300 430,346 T760,326 T${W},358 L${W},${H} L0,${H} Z`} fill="url(#ground)" />

        {/* the routes */}
        {ROUTES.map((r, i) => (
          <g key={i}>
            <path d={r.d} stroke="#0a0d18" strokeWidth="16" fill="none" strokeLinecap="round" />
            <path
              d={r.d}
              stroke="#3c4674"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={r.dashed ? '2 16' : undefined}
              opacity={r.dashed ? 0.75 : 1}
            />
          </g>
        ))}

        {/* a lantern at each place */}
        {PLACES.map((pl) => (
          <g key={pl.id}>
            <circle cx={pl.x} cy={pl.y} r="46" fill="#e3b23c" opacity=".055" filter="url(#glow)" />
            <circle cx={pl.x} cy={pl.y} r="7" fill="#0d1020" stroke="#3c4674" strokeWidth="2.5" />
          </g>
        ))}
      </svg>

      {/* ---- place plaques ---- */}
      {PLACES.map((pl) => {
        const here = projects.filter((p) => p.zone === pl.id)
        return (
          <div
            className={`place place-${pl.id}`}
            key={pl.id}
            style={{ left: pct(pl.x, W), top: pct(pl.y, H) }}
          >
            <div className="place-title">
              {pl.icon} {pl.title}
              {pl.id === 'garden' && (
                <span className="place-count">
                  {here.length}/{HANDS_LIMIT}
                </span>
              )}
              {pl.id !== 'garden' && here.length > 0 && (
                <span className="place-count">{here.length}</span>
              )}
            </div>
            <div className="place-blurb">{pl.blurb}</div>
          </div>
        )
      })}

      {/* ---- projects standing where they live ---- */}
      {PLACES.map((pl) => {
        const here = projects.filter((p) => p.zone === pl.id)
        return here.map((p, i) => (
          <ProjectToken
            key={p.id}
            p={p}
            place={pl}
            i={i}
            n={here.length}
            onOpen={() => onOpen(p.id)}
          />
        ))
      })}

      {/* ---- the vault: slips waiting to be planted ---- */}
      <div
        className="vault-slips"
        style={{ left: pct(PLACE_BY_ID.vault.x, W), top: pct(PLACE_BY_ID.vault.y + 74, H) }}
      >
        {seedSlips.length === 0 ? (
          <div className="vault-empty">no slips yet</div>
        ) : (
          seedSlips.slice(0, 6).map((s) => (
            <button
              key={s.id}
              className="packet"
              disabled={free === 0}
              onClick={() => adoptSlip(s.id)}
              title={
                free === 0
                  ? `${s.name} — all ${HANDS_LIMIT} beds are full`
                  : `Plant "${s.name}" in a bed`
              }
            >
              <SeedPacket />
              <span className="packet-name">{s.name}</span>
            </button>
          ))
        )}
        {seedSlips.length > 6 && (
          <div className="vault-empty">+{seedSlips.length - 6} more</div>
        )}
      </div>

      <div className="map-legend">
        {moonGlyph(phase)} the moon rides tonight's phase · click a plant to open it
        {free > 0 && seedSlips.length > 0 && ' · click a packet to plant it'}
      </div>
    </div>
  )
}
