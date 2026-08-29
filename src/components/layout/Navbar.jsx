import { Link, NavLink } from 'react-router-dom';
import Icon from '../common/Icon';
import SearchBar from '../product/SearchBar';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/shop', label: 'Shop', icon: 'grid' },
  { to: '/category/dumbbells', label: 'Fitness Equipment', icon: 'box' },
  { to: '/category/protein', label: 'Supplements', icon: 'tag' },
  { to: '/recommendations', label: 'Recommendations', icon: 'sparkle' },
  { to: '/bmi', label: 'BMI Calculator', icon: 'scale' },
  { to: '/compare', label: 'Compare', icon: 'layers' }
];

export default function Navbar() {
  const cart = useCart();
  const wishlist = useWishlist();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <>
      <div className="ff-ann">Get 20% off your first order · Free island-wide delivery over Rs 15,000</div>
      <header className="ff-hdr">
        <div className="ff-wrap">
          <div className="ff-hdr-main">
            <Link className="ff-brand" to="/" aria-label="FitFuel home">
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
                <rect width="40" height="40" rx="12" fill="#29ABE2" />
                <rect x="10" y="11" width="5" height="18" rx="2.5" fill="#fff" />
                <rect x="18" y="11" width="5" height="18" rx="2.5" fill="#fff" />
                <rect x="26" y="15" width="5" height="10" rx="2.5" fill="#212121" />
              </svg>
              <span>
                <span className="ff-brand-name">FitFuel</span>
                <span className="ff-brand-sub">Authenticity Guaranteed.</span>
              </span>
            </Link>

            <SearchBar />

            <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
              <Link className="ff-icon-btn" to="/wishlist" aria-label={`Wishlist, ${wishlist.count} items`}>
                <Icon name="heart" size={20} stroke="var(--ff-gray-700)" />
                {wishlist.count > 0 && <span className="ff-count">{wishlist.count}</span>}
              </Link>
              <Link className="ff-icon-btn" to="/cart" aria-label={`Cart, ${cart.count} items`}>
                <Icon name="cart" size={20} stroke="var(--ff-gray-700)" />
                {cart.count > 0 && <span className="ff-count">{cart.count}</span>}
              </Link>
              <Link className="ff-icon-btn" to={isAuthenticated ? '/profile' : '/login'}
                aria-label={isAuthenticated ? 'My account' : 'Log in'}>
                <Icon name="user" size={20} stroke="var(--ff-gray-700)" />
              </Link>
            </div>
          </div>

          <nav className="ff-nav" aria-label="Main">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>Home</NavLink>
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                <Icon name={n.icon} size={18} strokeWidth={1.6} />
                {n.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'is-active' : '')}>
                <Icon name="chart" size={18} strokeWidth={1.6} />
                Admin
              </NavLink>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
