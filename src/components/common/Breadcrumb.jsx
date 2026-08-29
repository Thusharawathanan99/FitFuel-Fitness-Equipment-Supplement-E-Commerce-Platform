import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8,
      flexWrap: 'wrap', fontSize: 13, color: 'var(--ff-gray-600)', padding: '22px 0' }}>
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && <span aria-hidden="true" style={{ color: 'var(--ff-gray-400)' }}>/</span>}
          {item.to ? (
            <Link to={item.to} style={{ color: 'var(--ff-gray-600)' }}>{item.label}</Link>
          ) : (
            <span aria-current="page" style={{ color: 'var(--ff-brand-700)', fontWeight: 600 }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
