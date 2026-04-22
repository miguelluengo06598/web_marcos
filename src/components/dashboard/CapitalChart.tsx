// Pure server component — no browser APIs, renders static SVG

interface Snapshot {
  capital_total: number
  recorded_at: string
}

interface Props {
  snapshots: Snapshot[]
  isPositive: boolean
}

// ── Catmull-Rom → cubic Bézier conversion ─────────────────────────────────
// Produces smooth curves through all data points without overshooting.
function bezierSegments(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  const t = 0.4 // tension
  // Pad with mirrored endpoints so edge points have smooth tangents
  const aug = [
    { x: 2 * pts[0].x - pts[1].x, y: 2 * pts[0].y - pts[1].y },
    ...pts,
    { x: 2 * pts[pts.length - 1].x - pts[pts.length - 2].x, y: 2 * pts[pts.length - 1].y - pts[pts.length - 2].y },
  ]
  let d = ''
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = aug[i], p1 = aug[i + 1], p2 = aug[i + 2], p3 = aug[i + 3]
    const c1x = p1.x + (p2.x - p0.x) * t
    const c1y = p1.y + (p2.y - p0.y) * t
    const c2x = p2.x - (p3.x - p1.x) * t
    const c2y = p2.y - (p3.y - p1.y) * t
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
  }
  return d
}

// ── Formatting helpers ────────────────────────────────────────────────────
function fmtEuro(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}M`
  if (Math.abs(v) >= 1_000) return `€${(v / 1_000).toFixed(0)}k`
  return `€${v.toFixed(0)}`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// ── Component ─────────────────────────────────────────────────────────────
export default function CapitalChart({ snapshots, isPositive }: Props) {
  if (snapshots.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl select-none">
          📈
        </div>
        <p className="text-sm font-medium text-gray-400">No hay suficientes datos para la gráfica</p>
        <p className="text-xs text-gray-300 mt-1">Se necesitan al menos 2 registros históricos</p>
      </div>
    )
  }

  // ── Layout constants ────────────────────────────────────────────────
  const W = 600
  const H = 210
  const PL = 68  // left  — room for Y labels
  const PR = 14  // right
  const PT = 18  // top
  const PB = 38  // bottom — room for X labels
  const CW = W - PL - PR
  const CH = H - PT - PB
  const chartBottom = PT + CH

  // ── Data preparation ────────────────────────────────────────────────
  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  )

  const vals = sorted.map(s => s.capital_total)
  const rawMin = Math.min(...vals)
  const rawMax = Math.max(...vals)
  const rawRange = rawMax - rawMin
  // If all values identical, give the range a sensible size so the line sits centred
  const pad = rawRange > 0 ? rawRange * 0.12 : (Math.abs(rawMax) * 0.05 || 10)
  const yMin = rawMin - pad
  const yMax = rawMax + pad
  const yRange = yMax - yMin

  // ── Coordinate mappers ──────────────────────────────────────────────
  const toX = (i: number) => PL + (i / (sorted.length - 1)) * CW
  const toY = (v: number) => PT + CH - ((v - yMin) / yRange) * CH

  const pts = sorted.map((s, i) => ({ x: toX(i), y: toY(s.capital_total) }))

  // ── SVG paths ───────────────────────────────────────────────────────
  const segs = bezierSegments(pts)
  const first = pts[0], last = pts[pts.length - 1]
  const linePath = `M${first.x.toFixed(2)},${first.y.toFixed(2)}${segs}`
  const areaPath =
    `M${first.x.toFixed(2)},${chartBottom} ` +
    `L${first.x.toFixed(2)},${first.y.toFixed(2)}` +
    segs +
    ` L${last.x.toFixed(2)},${chartBottom} Z`

  // ── Colours ─────────────────────────────────────────────────────────
  const lineColor = isPositive ? '#10b981' : '#ef4444'
  const gradId    = isPositive ? 'capGradGreen' : 'capGradRed'
  const dotColor  = lineColor

  // ── Y axis labels (5 evenly spaced) ────────────────────────────────
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const v = yMin + (i / 4) * yRange
    return { v, y: toY(v) }
  })

  // ── X axis labels (≤6, always include first & last) ─────────────────
  const maxXLabels = Math.min(6, sorted.length)
  const step = Math.max(1, Math.ceil((sorted.length - 1) / (maxXLabels - 1)))
  const xIdxSet = new Set<number>()
  for (let i = 0; i < sorted.length; i += step) xIdxSet.add(i)
  xIdxSet.add(sorted.length - 1)
  const xIdxs = [...xIdxSet].sort((a, b) => a - b)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Gráfica de evolución del capital"
    >
      <defs>
        {/* Vertical gradient: colour at top → transparent at bottom */}
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={lineColor} stopOpacity="0.28" />
          <stop offset="75%"  stopColor={lineColor} stopOpacity="0.04" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
        {/* Clip to chart area so curve never overflows into label gutters */}
        <clipPath id="capClip">
          <rect x={PL} y={PT} width={CW} height={CH} />
        </clipPath>
      </defs>

      {/* ── Y grid lines ──────────────────────────────────────────── */}
      {yLabels.map((lbl, i) => (
        <g key={i}>
          <line
            x1={PL} y1={lbl.y.toFixed(2)}
            x2={PL + CW} y2={lbl.y.toFixed(2)}
            stroke="#f3f4f6" strokeWidth="1"
          />
          <text
            x={PL - 7}
            y={lbl.y.toFixed(2)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="10"
            fill="#9ca3af"
          >
            {fmtEuro(lbl.v)}
          </text>
        </g>
      ))}

      {/* ── X axis baseline ───────────────────────────────────────── */}
      <line
        x1={PL} y1={chartBottom}
        x2={PL + CW} y2={chartBottom}
        stroke="#e5e7eb" strokeWidth="1"
      />

      {/* ── Gradient fill (clipped) ───────────────────────────────── */}
      <path d={areaPath} fill={`url(#${gradId})`} clipPath="url(#capClip)" />

      {/* ── Smooth line (clipped) ─────────────────────────────────── */}
      <path
        d={linePath}
        fill="none"
        stroke={lineColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#capClip)"
      />

      {/* ── Data-point dots ───────────────────────────────────────── */}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x.toFixed(2)}
          cy={p.y.toFixed(2)}
          r="3.5"
          fill="white"
          stroke={dotColor}
          strokeWidth="2"
        />
      ))}

      {/* ── X axis labels ─────────────────────────────────────────── */}
      {xIdxs.map(i => (
        <text
          key={i}
          x={pts[i].x.toFixed(2)}
          y={chartBottom + 20}
          textAnchor="middle"
          fontSize="10"
          fill="#9ca3af"
        >
          {fmtDate(sorted[i].recorded_at)}
        </text>
      ))}
    </svg>
  )
}
