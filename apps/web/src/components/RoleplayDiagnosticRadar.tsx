"use client";

interface RoleplayDiagnosticRadarProps {
  /** Axis name -> score in 0-100 scale */
  scores: Record<string, number>;
  caseTitle?: string;
}

/**
 * Pure-SVG radar chart visualising AMC Clinical Roleplay performance.
 *
 * No external chart library. Renders responsive SVG that scales to its
 * container width (capped ~360px by parent). Concentric grid rings at
 * 25/50/75/100, axis labels around the polygon, brand-teal filled
 * polygon for the user's scores.
 */
export default function RoleplayDiagnosticRadar({
  scores,
  caseTitle,
}: RoleplayDiagnosticRadarProps) {
  const axes = Object.keys(scores);
  const n = axes.length;

  // Graceful empty state — no axes / not enough axes for a polygon.
  if (n < 3) {
    return (
      <div className="flex h-64 w-full max-w-[360px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-xs text-gray-500">
          Your diagnostic scores are still being computed…
        </p>
      </div>
    );
  }

  // SVG geometry — viewBox is 320×320 with the centre at (160, 160)
  // and a max polygon radius of 110, leaving room for labels.
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = 110;
  const rings = [25, 50, 75, 100];

  // For each axis i: angle starts at -90° (top) and goes clockwise.
  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i: number, valuePct: number) => {
    const r = (rMax * Math.min(100, Math.max(0, valuePct))) / 100;
    const a = angleFor(i);
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  };

  // Polygon path for a given percentage (used for grid rings + score shape).
  const polyPath = (valuePct: number) =>
    axes
      .map((_, i) => {
        const p = point(i, valuePct);
        return `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      })
      .join(" ") + " Z";

  // Label position pushed slightly past the outer ring.
  const labelPos = (
    i: number
  ): { x: number; y: number; anchor: "start" | "end" | "middle" } => {
    const a = angleFor(i);
    const r = rMax + 22;
    const cosA = Math.cos(a);
    return {
      x: cx + r * cosA,
      y: cy + r * Math.sin(a),
      anchor: cosA > 0.3 ? "start" : cosA < -0.3 ? "end" : "middle",
    };
  };

  return (
    <div className="w-full max-w-[360px]">
      {caseTitle && (
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {caseTitle}
        </p>
      )}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Diagnostic radar chart with ${n} axes`}
      >
        {/* Grid rings */}
        {rings.map((r) => (
          <path
            key={r}
            d={polyPath(r)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        ))}

        {/* Spokes */}
        {axes.map((_, i) => {
          const p = point(i, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          );
        })}

        {/* Score polygon — brand teal fill + stroke */}
        <path
          d={
            axes
              .map((axis, i) => {
                const p = point(i, scores[axis] ?? 0);
                return `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
              })
              .join(" ") + " Z"
          }
          fill="rgba(20,184,166,0.25)"
          stroke="#0d9488"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Score vertices */}
        {axes.map((axis, i) => {
          const p = point(i, scores[axis] ?? 0);
          return (
            <circle
              key={axis}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill="#0d9488"
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Axis labels */}
        {axes.map((axis, i) => {
          const lp = labelPos(i);
          const score = Math.round(scores[axis] ?? 0);
          return (
            <g key={`label-${axis}`}>
              <text
                x={lp.x}
                y={lp.y - 4}
                textAnchor={lp.anchor}
                className="fill-gray-700"
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {axis}
              </text>
              <text
                x={lp.x}
                y={lp.y + 9}
                textAnchor={lp.anchor}
                className="fill-brand-700"
                style={{ fontSize: 10, fontWeight: 700 }}
              >
                {score}%
              </text>
            </g>
          );
        })}

        {/* Outer ring percent markers (top + right) */}
        <text
          x={cx}
          y={cy - rMax - 2}
          textAnchor="middle"
          className="fill-gray-300"
          style={{ fontSize: 8 }}
        >
          100
        </text>
      </svg>
    </div>
  );
}
