import Icon from '../common/Icon';

export default function StatCard({ label, value, delta, tone = 'up', hint, icon }) {
  const colour = tone === 'up' ? 'var(--ff-success-700)' : tone === 'down' ? 'var(--ff-error-700)' : 'var(--ff-gray-600)';
  return (
    <div className="ff-panel" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase',
          color: 'var(--ff-gray-500)' }}>{label}</span>
        {icon && <Icon name={icon} size={18} stroke="var(--ff-brand-500)" />}
      </span>
      <strong className="ff-tnum" style={{ fontFamily: 'var(--ff-display)', fontSize: 32, lineHeight: 1 }}>{value}</strong>
      {(delta || hint) && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13 }}>
          {delta && <span style={{ color: colour, fontWeight: 600 }}>{delta}</span>}
          {hint && <span style={{ color: 'var(--ff-gray-600)' }}>{hint}</span>}
        </span>
      )}
    </div>
  );
}
