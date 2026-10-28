const glyphs = ["क", "ॐ", "ग", "✶", "ज", "☉", "र", "✡", "द", "☾", "स", "✧"];

export function Mandala({ className = "" }: { className?: string }) {
  const c = 200;
  const outer = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI * 2) / 12 - Math.PI / 2;
    return { x: c + Math.cos(a) * 160, y: c + Math.sin(a) * 160, a, g: glyphs[i] };
  });
  const star = (n: number, r1: number, r2: number) =>
    Array.from({ length: n * 2 }, (_, i) => {
      const a = (i * Math.PI) / n - Math.PI / 2;
      const r = i % 2 ? r2 : r1;
      return `${c + Math.cos(a) * r},${c + Math.sin(a) * r}`;
    }).join(" ");
  return (
    <svg viewBox="0 0 400 400" className={`mandala ${className}`} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle className="draw d1" cx={c} cy={c} r="190" pathLength={1} />
        <circle className="draw d1" cx={c} cy={c} r="182" pathLength={1} strokeWidth=".5" />
        <circle className="draw d2" cx={c} cy={c} r="138" pathLength={1} />
        <circle className="draw d2" cx={c} cy={c} r="130" pathLength={1} strokeWidth=".5" />
        <polygon className="draw d3" points={star(12, 128, 96)} pathLength={1} />
        <polygon className="draw d3" points={star(8, 96, 60)} pathLength={1} />
        <circle className="draw d4" cx={c} cy={c} r="60" pathLength={1} />
        <polygon className="draw d4" points={star(6, 58, 30)} pathLength={1} />
        <circle className="draw d5" cx={c} cy={c} r="28" pathLength={1} />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * Math.PI) / 12;
          return (
            <line
              key={i}
              className="draw d3"
              pathLength={1}
              strokeWidth=".4"
              x1={c + Math.cos(a) * 138}
              y1={c + Math.sin(a) * 138}
              x2={c + Math.cos(a) * 182}
              y2={c + Math.sin(a) * 182}
            />
          );
        })}
        {outer.map((o, i) => (
          <circle
            key={i}
            className="draw d2"
            pathLength={1}
            cx={o.x}
            cy={o.y}
            r="17"
            fill="var(--background)"
          />
        ))}
      </g>
      <g
        className="glyphs"
        fill="currentColor"
        fontSize="16"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {outer.map((o, i) => (
          <text key={i} x={o.x} y={o.y}>
            {o.g}
          </text>
        ))}
      </g>
      <circle className="core" cx={c} cy={c} r="12" fill="url(#coreG)" />
      <defs>
        <radialGradient id="coreG">
          <stop offset="0" stopColor="var(--gold-light)" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
