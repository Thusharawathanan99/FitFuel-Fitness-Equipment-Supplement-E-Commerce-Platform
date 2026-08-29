import Icon from './Icon';

export default function EmptyState({ icon = 'box', title, message, action }) {
  return (
    <div className="ff-empty">
      <span style={{ display: 'grid', placeItems: 'center', width: 56, height: 56, borderRadius: '50%',
        background: 'var(--ff-gray-100)', margin: '0 auto 16px' }}>
        <Icon name={icon} size={26} stroke="var(--ff-gray-500)" />
      </span>
      <h3 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h3>
      {message && <p style={{ marginBottom: action ? 20 : 0 }}>{message}</p>}
      {action}
    </div>
  );
}
