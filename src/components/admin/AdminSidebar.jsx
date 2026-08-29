import { Link, NavLink } from 'react-router-dom';
import Icon from '../common/Icon';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/categories', label: 'Categories', icon: 'tag' },
  { to: '/admin/inventory', label: 'Inventory', icon: 'layers' },
  { to: '/admin/orders', label: 'Orders', icon: 'truck' },
  { to: '/admin/customers', label: 'Customers', icon: 'users' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'chart' }
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  return (
    <aside className="ff-aside">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 20px' }}>
        <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
          <rect width="40" height="40" rx="12" fill="#29ABE2" />
          <rect x="10" y="11" width="5" height="18" rx="2.5" fill="#fff" />
          <rect x="18" y="11" width="5" height="18" rx="2.5" fill="#fff" />
          <rect x="26" y="15" width="5" height="10" rx="2.5" fill="#212121" />
        </svg>
        <span>
          <span style={{ fontFamily: 'var(--ff-display)', fontSize: 20, color: '#fff', display: 'block', lineHeight: 1 }}>FitFuel</span>
          <span style={{ fontSize: 10, color: 'var(--ff-gray-500)', letterSpacing: '.14em' }}>ADMIN</span>
        </span>
      </Link>
      {LINKS.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
          <Icon name={l.icon} size={17} strokeWidth={1.7} />
          {l.label}
        </NavLink>
      ))}
      <button type="button" onClick={logout}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', height: 44,
          borderRadius: 'var(--ff-r-sm)', background: 'none', border: 0, color: '#C4BFB1',
          fontSize: 14, cursor: 'pointer', marginTop: 'auto', textAlign: 'left' }}>
        <Icon name="logout" size={17} strokeWidth={1.7} />
        Log out
      </button>
    </aside>
  );
}
