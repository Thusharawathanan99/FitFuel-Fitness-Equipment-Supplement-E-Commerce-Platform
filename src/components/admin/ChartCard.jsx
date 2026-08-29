/**
 * Small chart set drawn as SVG — no charting dependency.
 * One series, one hue (the brand blue), recessive grid, selective direct labels.
 */
const BRAND = '#29ABE2';

export function BarChart({ data, height = 220, valueFormat = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 600, H = height, pad = { t: 24, b: 30, l: 0, r: 0 };
  const plot = H - pad.t - pad.b;
  const slot = W / data.length;
  const bw = Math.min(56, slot * 0.62);
  const peak = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} role="img"
      aria-label={`Bar chart, peak ${peak.label} at ${valueFormat(peak.value)}`}>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={pad.t + plot * f} y2={pad.t + plot * f}
          stroke="var(--ff-gray-200)" strokeWidth="1" />
      ))}
      <line x1="0" x2={W} y1={pad.t + plot} y2={pad.t + plot} stroke="var(--ff-gray-300)" strokeWidth="1" />
      {data.map((d, i) => {
        const h = Math.max(2, (d.value / max) * plot);
        const x = i * slot + (slot - bw) / 2;
        const y = pad.t + plot - h;
        const r = Math.min(4, h);
        return (
          <g key={d.label}>
            <path d={`M ${x} ${pad.t + plot} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y}
                      L ${x + bw - r} ${y} Q ${x + bw} ${y} ${x + bw} ${y + r}
                      L ${x + bw} ${pad.t + plot} Z`} fill={BRAND} />
            {d.label === peak.label && (
              <text x={x + bw / 2} y={y - 8} textAnchor="middle" fontSize="13" fontWeight="700"
                fill="var(--ff-gray-900)" fontFamily="Albert Sans, Arial">{valueFormat(d.value)}</text>
            )}
            <text x={x + bw / 2} y={H - 10} textAnchor="middle" fontSize="12"
              fill={d.label === peak.label ? 'var(--ff-gray-900)' : 'var(--ff-gray-500)'}
              fontWeight={d.label === peak.label ? 700 : 400} fontFamily="Albert Sans, Arial">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineChart({ data, height = 220, valueFormat = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const W = 600, H = height, pad = { t: 24, b: 30 };
  const plot = H - pad.t - pad.b;
  const step = data.length > 1 ? W / (data.length - 1) : W;
  const y = (v) => pad.t + plot - ((v - min) / (max - min || 1)) * plot;
  const pts = data.map((d, i) => [i * step, y(d.value)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  const area = `${line} L ${W} ${pad.t + plot} L 0 ${pad.t + plot} Z`;
  const last = data[data.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} role="img"
      aria-label={`Line chart ending at ${valueFormat(last.value)}`}>
      <defs>
        <linearGradient id="ff-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND} stopOpacity="0.22" />
          <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={pad.t + plot * f} y2={pad.t + plot * f}
          stroke="var(--ff-gray-200)" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#ff-area)" />
      <path d={line} fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0] - 3} cy={pts[pts.length - 1][1]} r="5" fill={BRAND}
        stroke="#fff" strokeWidth="2" />
      {data.map((d, i) => (
        <text key={d.label} x={i * step} y={H - 10}
          textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
          fontSize="12" fill="var(--ff-gray-500)" fontFamily="Albert Sans, Arial">{d.label}</text>
      ))}
    </svg>
  );
}

export function BarList({ data, valueFormat = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {data.map((d) => (
        <div key={d.label} style={{ display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14 }}>
            <span style={{ fontWeight: 600 }}>{d.label}</span>
            <span className="ff-tnum" style={{ color: 'var(--ff-gray-600)' }}>{valueFormat(d.value)}</span>
          </div>
          <div style={{ height: 8, background: 'var(--ff-gray-100)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: 8, background: BRAND, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChartCard({ title, subtitle, action, children }) {
  return (
    <section className="ff-panel" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: 20 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 13, color: 'var(--ff-gray-600)', marginTop: 4 }}>{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
