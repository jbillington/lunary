import { useEffect, useRef, useState } from 'react'
import { useGarden } from '../store'
import type { Project, Zone } from '../types'
import { HANDS_LIMIT, PHASE_LABEL, bedsFree } from '../lib/rules'
import { moonPhase } from '../lib/moon'
import { Plant, SeedPacket } from './Plant'
import { GardenPath, Glasshouse, Ground, Shed, TilledBeds, Trees, Trellis } from './MapArt'

/**
 * The garden as a place you travel and work, not a set of buckets.
 *
 * Zones are locations with buildings and beds, joined by earth paths that
 * wander the way a project actually moves. Projects stand where they live,
 * drawn as plants at their phase, and you move one by dragging it.
 *
 * Map space is 1000×600; everything positions as a percentage of that.
 */

const W = 1000
const H = 600
const DROP_RADIUS = 110 // map units — how near a place a drop counts
const CLICK_SLOP = 5 // px of movement still treated as a click

interface Place {
  id: Zone
  title: string
  icon: string
  blurb: string
  x: number
  y: number
}

const PLACES: Place[] = [
  { id: 'vault', title: 'Seed Vault', icon: '🌱', blurb: 'where everything begins', x: 132, y: 494 },
  { id: 'garden', title: 'Garden Beds', icon: '🌿', blurb: 'tended each moon', x: 404, y: 402 },
  { id: 'conservatory', title: 'Conservatory', icon: '🏡', blurb: 'sleeping through winter', x: 706, y: 492 },
  { id: 'grove', title: 'The Grove', icon: '🌳', blurb: 'elders who teach', x: 762, y: 268 },
  { id: 'harvest', title: 'Harvest Shelf', icon: '🌕', blurb: 'alive in the world', x: 900, y: 150 },
]

// Paths meander. A straight line between two dots is a constellation; a garden
// path wanders around what is already planted.
const ROUTES: { d: string; dashed?: boolean }[] = [
  { d: 'M132,494 C196,522 232,452 292,446 C350,440 360,410 404,402' },
  { d: 'M404,402 C456,450 502,502 560,508 C616,514 664,500 706,492', dashed: true },
  { d: 'M404,402 C472,378 524,330 590,310 C662,288 714,280 762,268' },
  { d: 'M762,268 C806,236 844,190 900,150' },
]

const pct = (v: number, total: number) => `${(v / total) * 100}%`

/** Fan several projects around their place so they do not stack. */
function offsetFor(i: number, n: number) {
  const spread = n === 1 ? 0 : 84
  return {
    x: (i - (n - 1) / 2) * spread,
    y: n > 2 && i % 2 === 1 ? 30 : 0,
  }
}

type DragState = {
  kind: 'project' | 'slip'
  id: string
  clientX: number
  clientY: number
  moved: boolean
}

export function GardenMap({ onOpen }: { onOpen: (id: string) => void }) {
  const { projects, seedSlips, adoptSlip, moveZone } = useGarden()
  const wrap = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const phase = moonPhase()
  const free = bedsFree(projects)

  const moonX = 80 + phase * (W - 160)
  const moonY = 118 - Math.sin(phase * Math.PI) * 66

  function say(msg: string) {
    setFlash(msg)
    window.setTimeout(() => setFlash((f) => (f === msg ? null : f)), 2600)
  }

  /** Which place, if any, is under these screen coordinates. */
  function placeAt(clientX: number, clientY: number): Place | null {
    const r = wrap.current?.getBoundingClientRect()
    if (!r) return null
    const mx = ((clientX - r.left) / r.width) * W
    const my = ((clientY - r.top) / r.height) * H
    let best: Place | null = null
    let bestD = DROP_RADIUS
    for (const pl of PLACES) {
      const d = Math.hypot(pl.x - mx, pl.y - my)
      if (d < bestD) { bestD = d; best = pl }
    }
    return best
  }

  function drop(state: DragState, clientX: number, clientY: number) {
    const target = placeAt(clientX, clientY)
    if (!target) return

    if (state.kind === 'slip') {
      const slip = seedSlips.find((s) => s.id === state.id)
      if (target.id !== 'garden') return say('Seeds are planted in the beds.')
      if (!adoptSlip(state.id)) {
        return say(`All ${HANDS_LIMIT} beds are full — rest something first.`)
      }
      return say(`${slip?.name ?? 'Seed'} planted.`)
    }

    const p = projects.find((x) => x.id === state.id)
    if (!p || p.zone === target.id) return
    if (target.id === 'vault') return say('A growing thing cannot go back to being a seed.')

    if (!moveZone(state.id, target.id)) {
      return say(`All ${HANDS_LIMIT} beds are full — rest something first.`)
    }
    const verb =
      target.id === 'garden' ? (p.phase === 'resting' ? 'woken into a bed' : 'moved to the beds')
      : target.id === 'conservatory' ? 'put to rest'
      : target.id === 'grove' ? 'joined the Grove'
      : 'set on the Harvest Shelf'
    say(`${p.name} ${verb}.`)
  }

  // Dragging lives on window so the pointer can leave the token it grabbed.
  useEffect(() => {
    if (!drag) return
    const move = (e: PointerEvent) => {
      setDrag((d) => {
        if (!d) return d
        const moved =
          d.moved || Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) > CLICK_SLOP
        return { ...d, clientX: e.clientX, clientY: e.clientY, moved }
      })
    }
    const up = (e: PointerEvent) => {
      setDrag((d) => {
        if (!d) return null
        // A press that never moved is a click, not a drag.
        if (!d.moved) {
          if (d.kind === 'project') onOpen(d.id)
          else if (!adoptSlip(d.id)) say(`All ${HANDS_LIMIT} beds are full — rest something first.`)
        } else {
          drop(d, e.clientX, e.clientY)
        }
        return null
      })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag !== null])

  const dragging = drag?.moved ? drag : null
  const hovered = dragging ? placeAt(dragging.clientX, dragging.clientY) : null
  const draggedProject = dragging?.kind === 'project'
    ? projects.find((p) => p.id === dragging.id) : undefined

  /** Is this place a legal home for whatever is currently in hand? */
  function targetState(pl: Place): 'ok' | 'no' | null {
    if (!dragging) return null
    if (dragging.kind === 'slip') return pl.id === 'garden' && free > 0 ? 'ok' : 'no'
    const p = projects.find((x) => x.id === dragging.id)
    if (!p || pl.id === 'vault' || pl.id === p.zone) return 'no'
    if (pl.id === 'garden' && free === 0) return 'no'
    return 'ok'
  }

  return (
    <div
      className={`map ${dragging ? 'dragging' : ''}`}
      ref={wrap}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <svg className="map-bg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="sky" cx="50%" cy="0%" r="95%">
            <stop offset="0%" stopColor="#232a52" />
            <stop offset="55%" stopColor="#161b3a" />
            <stop offset="100%" stopColor="#0e1228" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} fill="url(#sky)" />

        {Array.from({ length: 44 }, (_, i) => {
          const sx = (i * 137.5) % W
          const sy = ((i * 71.3) % 230) + 10
          return (
            <circle key={i} cx={sx} cy={sy} r={i % 7 === 0 ? 1.6 : 1}
              fill="#fff" opacity={i % 3 ? 0.28 : 0.55} />
          )
        })}

        <circle cx={moonX} cy={moonY} r="30" fill="#f2ead8" opacity=".13" filter="url(#glow)" />
        <circle cx={moonX} cy={moonY} r="15" fill="#f4eddc" opacity=".62" />

        <Ground w={W} h={H} />

        {ROUTES.map((r, i) => <GardenPath key={i} d={r.d} dashed={r.dashed} />)}

        <Shed x={132} y={494} />
        <TilledBeds x={404} y={402} />
        <Glasshouse x={706} y={492} />
        <Trees x={762} y={268} />
        <Trellis x={900} y={150} />

        {/* drop targets, only while something is in hand */}
        {dragging &&
          PLACES.map((pl) => {
            const st = targetState(pl)
            const on = hovered?.id === pl.id
            return (
              <circle
                key={pl.id}
                cx={pl.x}
                cy={pl.y}
                r={on ? 82 : 66}
                fill={st === 'ok' ? '#6fae82' : '#d6779b'}
                opacity={on ? 0.2 : 0.09}
                stroke={st === 'ok' ? '#6fae82' : '#d6779b'}
                strokeWidth="2"
                strokeDasharray="6 8"
              />
            )
          })}
      </svg>

      {/* ---- place plaques ---- */}
      {PLACES.map((pl) => {
        const here = projects.filter((p) => p.zone === pl.id)
        return (
          <div className="place" key={pl.id} style={{ left: pct(pl.x, W), top: pct(pl.y, H) }}>
            <div className="place-title">
              {pl.icon} {pl.title}
              {pl.id === 'garden' ? (
                <span className="place-count">{here.length}/{HANDS_LIMIT}</span>
              ) : here.length > 0 ? (
                <span className="place-count">{here.length}</span>
              ) : null}
            </div>
            <div className="place-blurb">{pl.blurb}</div>
          </div>
        )
      })}

      {/* ---- projects standing where they live ---- */}
      {PLACES.flatMap((pl) => {
        const here = projects.filter((p) => p.zone === pl.id)
        return here.map((p: Project, i) => {
          const { x, y } = offsetFor(i, here.length)
          const isHeld = dragging?.kind === 'project' && dragging.id === p.id
          return (
            <div
              key={p.id}
              className={`token ${isHeld ? 'held' : ''}`}
              style={{
                left: pct(pl.x + x, W),
                top: pct(pl.y + y, H),
                animationDelay: `${(i % 4) * 0.7}s`,
              }}
              role="button"
              tabIndex={0}
              title={`${p.name} — ${PHASE_LABEL[p.phase]} · drag to move`}
              onPointerDown={(e) =>
                setDrag({ kind: 'project', id: p.id, clientX: e.clientX, clientY: e.clientY, moved: false })
              }
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(p.id)}
            >
              <Plant phase={p.phase} size={78} />
              <span className="token-name">{p.name}</span>
              {p.moonpennies.length > 0 && (
                <span className="token-pennies">
                  {'◎'.repeat(Math.min(p.moonpennies.length, 5))}
                </span>
              )}
            </div>
          )
        })
      })}

      {/* ---- the vault: slips waiting to be planted ---- */}
      <div className="vault-slips" style={{ left: pct(132, W), top: pct(494 + 66, H) }}>
        {seedSlips.length === 0 ? (
          <div className="vault-empty">no slips yet</div>
        ) : (
          seedSlips.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className={`packet ${dragging?.kind === 'slip' && dragging.id === s.id ? 'held' : ''}`}
              role="button"
              tabIndex={0}
              title={`${s.name} — drag into the beds to plant it`}
              onPointerDown={(e) =>
                setDrag({ kind: 'slip', id: s.id, clientX: e.clientX, clientY: e.clientY, moved: false })
              }
            >
              <SeedPacket />
              <span className="packet-name">{s.name}</span>
            </div>
          ))
        )}
        {seedSlips.length > 6 && <div className="vault-empty">+{seedSlips.length - 6} more</div>}
      </div>

      {/* ---- what is in your hand, following the cursor ---- */}
      {dragging && (
        <div
          className="drag-ghost"
          style={{ left: dragging.clientX, top: dragging.clientY }}
        >
          {dragging.kind === 'project' && draggedProject ? (
            <Plant phase={draggedProject.phase} size={78} />
          ) : (
            <SeedPacket size={40} />
          )}
        </div>
      )}

      <div className="map-legend">
        {flash ?? (
          projects.length + seedSlips.length === 0
            ? 'write a seed slip below to begin'
            : 'click a plant to open it · drag it to another place to move it'
        )}
      </div>
    </div>
  )
}
