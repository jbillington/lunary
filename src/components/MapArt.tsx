/**
 * Terrain for the garden map.
 *
 * Everything here is programmatic SVG, deliberately. It is a stand-in with a
 * stable shape: each piece takes (x, y) and draws itself around that anchor, so
 * a painted asset can replace any one of them later without the map layout,
 * the drag logic, or the game rules noticing. See src/art/README.md.
 *
 * Map space is 1000×600.
 */

const EARTH = '#54483a'
const EARTH_LIT = '#6b5c48'
const EARTH_EDGE = '#22301f'
const LEAF = '#3f6b4a'
const LEAF_DARK = '#2b4a34'
const GLASS = '#9fb6d8'

/** Rolling ground with hedgerow-divided parcels, so it reads as cultivated. */
export function Ground({ w, h }: { w: number; h: number }) {
  return (
    <>
      <path d={`M0,286 Q170,232 340,278 T650,256 T${w},290 L${w},${h} L0,${h} Z`} fill="#16241c" />
      <path d={`M0,340 Q230,288 440,334 T780,314 T${w},348 L${w},${h} L0,${h} Z`} fill="#1a2b20" />
      <path d={`M0,430 Q260,392 520,428 T${w},414 L${w},${h} L0,${h} Z`} fill="#16241b" />

      {/* hedgerows dividing the fields */}
      <g stroke={LEAF_DARK} strokeWidth="5" fill="none" opacity=".55" strokeLinecap="round">
        <path d="M0,352 Q140,336 250,364" />
        <path d="M470,300 Q520,360 500,430" />
        <path d="M700,300 Q740,360 726,412" />
        <path d="M820,340 Q900,330 1000,352" />
      </g>
    </>
  )
}

/**
 * A garden path: earth, edged, with gravel speckle. Dashed when the route runs
 * both ways (a project rests, and later wakes back into a bed).
 */
export function GardenPath({ d, dashed = false }: { d: string; dashed?: boolean }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={EARTH_EDGE} strokeWidth="30" />
      <path d={d} stroke={EARTH} strokeWidth="22" />
      <path d={d} stroke={EARTH_LIT} strokeWidth="13" opacity=".75" />
      <path
        d={d}
        stroke="#9b8c73"
        strokeWidth="3"
        opacity=".28"
        strokeDasharray={dashed ? '1 22' : '2 13'}
      />
      {dashed && (
        <path d={d} stroke="#0d1020" strokeWidth="22" strokeDasharray="16 20" opacity=".55" />
      )}
    </g>
  )
}

/** The Seed Vault — a potting shed. */
export function Shed({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 46} ${y - 74})`}>
      <rect x="8" y="34" width="76" height="46" rx="2" fill="#3b3026" stroke="#584838" strokeWidth="2" />
      <path d="M2 36 L46 8 L90 36 Z" fill="#4a3c2e" stroke="#66543f" strokeWidth="2" />
      <rect x="34" y="52" width="24" height="28" rx="1.5" fill="#1d1912" stroke="#66543f" strokeWidth="1.6" />
      <rect x="15" y="46" width="14" height="13" fill="#20304a" stroke="#66543f" strokeWidth="1.4" />
      <rect x="63" y="46" width="14" height="13" fill="#20304a" stroke="#66543f" strokeWidth="1.4" />
      <circle cx="52" cy="66" r="1.6" fill="#c9b896" />
    </g>
  )
}

/** The Garden Beds — three tilled raised beds. */
export function TilledBeds({ x, y }: { x: number; y: number }) {
  const bed = (bx: number, by: number, wide: number) => (
    <g key={`${bx}-${by}`}>
      <rect x={bx} y={by} width={wide} height="30" rx="4" fill="#3a3025" stroke="#5c4b39" strokeWidth="2" />
      {[0, 1, 2].map((r) => (
        <path
          key={r}
          d={`M${bx + 6},${by + 9 + r * 7} h${wide - 12}`}
          stroke="#4d4132"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </g>
  )
  return (
    <g transform={`translate(${x - 108} ${y - 26})`}>
      {bed(0, 34, 92)}
      {bed(104, 26, 112)}
      {bed(24, 74, 150)}
    </g>
  )
}

/** The Conservatory — a glasshouse for overwintering. */
export function Glasshouse({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 52} ${y - 78})`}>
      <path d="M6 44 L52 12 L98 44 L98 86 L6 86 Z" fill={GLASS} opacity=".13" />
      <path d="M6 44 L52 12 L98 44 L98 86 L6 86 Z" fill="none" stroke="#7f97bd" strokeWidth="2" />
      <g stroke="#7f97bd" strokeWidth="1.2" opacity=".75">
        <path d="M52 12 V86" />
        <path d="M29 28 V86" />
        <path d="M75 28 V86" />
        <path d="M6 62 H98" />
      </g>
      <rect x="40" y="62" width="24" height="24" fill="#101a26" stroke="#7f97bd" strokeWidth="1.4" />
    </g>
  )
}

/** The Grove — elders. Older, taller, darker than anything in the beds. */
export function Trees({ x, y }: { x: number; y: number }) {
  const tree = (tx: number, ty: number, s: number, fill: string) => (
    <g key={`${tx}-${ty}`} transform={`translate(${tx} ${ty}) scale(${s})`}>
      <path d="M0 0 V-26" stroke="#3b2f24" strokeWidth="5" strokeLinecap="round" />
      <circle cx="0" cy="-38" r="20" fill={fill} />
      <circle cx="-13" cy="-28" r="13" fill={fill} opacity=".9" />
      <circle cx="14" cy="-29" r="14" fill={fill} opacity=".85" />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y + 26})`}>
      {tree(-46, 6, 1.05, LEAF_DARK)}
      {tree(44, 4, 0.95, LEAF_DARK)}
      {tree(-2, 0, 1.25, LEAF)}
    </g>
  )
}

/** The Harvest Shelf — a trellis where finished things are set out. */
export function Trellis({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 52} ${y - 60})`}>
      <g stroke="#6b5a44" strokeWidth="4" strokeLinecap="round">
        <path d="M10 88 V22" />
        <path d="M94 88 V22" />
      </g>
      <g stroke="#5c4c3a" strokeWidth="3.5" strokeLinecap="round">
        <path d="M4 30 H100" />
        <path d="M4 56 H100" />
        <path d="M4 82 H100" />
      </g>
      {/* moonpennies hung to dry */}
      <g fill="#c9cfe0" opacity=".5" stroke="#e8edf8" strokeWidth="1.2">
        <circle cx="26" cy="30" r="7" />
        <circle cx="52" cy="56" r="8" />
        <circle cx="78" cy="30" r="6.5" />
        <circle cx="38" cy="82" r="6" />
      </g>
    </g>
  )
}
