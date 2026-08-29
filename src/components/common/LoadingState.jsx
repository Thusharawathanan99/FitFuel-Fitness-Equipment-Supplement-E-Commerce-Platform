export function CardSkeleton() {
  return (
    <div style={{ border: '1px solid var(--ff-gray-200)', borderRadius: 'var(--ff-r-card)', overflow: 'hidden' }}>
      <div className="ff-skel" style={{ aspectRatio: '1', borderRadius: 0 }} />
      <div style={{ background: 'var(--ff-dark)', padding: 18, display: 'grid', gap: 10 }}>
        <div className="ff-skel" style={{ height: 22, opacity: 0.25 }} />
        <div className="ff-skel" style={{ height: 16, width: '60%', opacity: 0.25 }} />
        <div className="ff-skel" style={{ height: 48, opacity: 0.25 }} />
      </div>
    </div>
  );
}

export function RowSkeleton({ rows = 5 }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="ff-skel" style={{ height: 56 }} />
      ))}
    </div>
  );
}

export default function LoadingState({ label = 'Loading…', count = 4 }) {
  return (
    <div>
      <span className="ff-sr" role="status">{label}</span>
      <div className="ff-grid ff-g4">
        {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
