import Rating from '../common/Rating';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/format';

export default function ReviewList({ reviews = [], summary }) {
  if (!reviews.length)
    return <EmptyState icon="star" title="No reviews yet" message="Be the first to review this product." />;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 260px) minmax(0, 1fr)', gap: 40, alignItems: 'start' }}>
      {summary && (
        <div className="ff-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <span className="ff-display" style={{ fontSize: 44, fontWeight: 600 }}>{summary.average}</span>
            <span className="ff-muted" style={{ fontSize: 16 }}> / 5</span>
          </div>
          <Rating value={summary.average} showCount={false} tone="light" size={18} />
          <p className="ff-muted" style={{ fontSize: 13 }}>Based on {summary.total.toLocaleString('en-IN')} ratings</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
            {summary.breakdown.map((count, i) => {
              const stars = 5 - i;
              const max = Math.max(1, ...summary.breakdown);
              return (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ width: 34, color: 'var(--ff-gray-600)' }}>{stars} star</span>
                  <span style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--ff-gray-100)' }}>
                    <span style={{ display: 'block', height: '100%', borderRadius: 3,
                      width: `${(count / max) * 100}%`, background: 'var(--ff-warning-400)' }} />
                  </span>
                  <span className="ff-tnum" style={{ width: 18, textAlign: 'right', color: 'var(--ff-gray-600)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
        {reviews.map((r) => (
          <li key={r.id} style={{ padding: '20px 0', borderBottom: '1px solid var(--ff-gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Rating value={r.rating} showCount={false} tone="light" size={15} />
              <b style={{ fontSize: 15 }}>{r.title}</b>
              {r.verified && <span className="ff-badge ff-badge-good">Verified purchase</span>}
            </div>
            <p style={{ margin: '10px 0 8px', color: 'var(--ff-gray-700)' }}>{r.body}</p>
            <p className="ff-muted" style={{ fontSize: 13 }}>{r.author} · {formatDate(r.date)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
