import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { orderService } from '../../services';
import { COUPONS } from '../../data/coupons';
import { formatDate, rs } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';

const TIERS = [
  { name: 'Bronze', at: 0 },
  { name: 'Silver', at: 1000 },
  { name: 'Gold', at: 2500 },
  { name: 'Platinum', at: 5000 }
];

export default function Profile() {
  useDocumentTitle('My account');
  const { user, updateProfile, logout } = useAuth();
  const wishlist = useWishlist();
  const compare = useCompare();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', city: user?.city || '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let alive = true;
    orderService.getOrders(user?.id).then((list) => { if (alive) setOrders(list); });
    return () => { alive = false; };
  }, [user?.id]);

  if (!user) return null;

  const points = user.points || 0;
  const tierIndex = TIERS.reduce((acc, t, i) => (points >= t.at ? i : acc), 0);
  const tier = TIERS[tierIndex];
  const nextTier = TIERS[tierIndex + 1];
  const progress = nextTier
    ? Math.round(((points - tier.at) / (nextTier.at - tier.at)) * 100)
    : 100;

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const save = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.phone && !/^[0-9+\s-]{9,15}$/.test(form.phone)) next.phone = 'Enter a valid phone number.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await updateProfile({ name: form.name.trim(), email: form.email.trim(), phone: form.phone, city: form.city });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    await logout();
    toast.info('You have been signed out');
    navigate('/');
  };

  const totalSpend = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My account' }]} />

      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 32 }}>Hello, {user.name.split(' ')[0]}</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>Member since {formatDate(user.joined)}</p>
        </div>
        <button type="button" className="ff-btn ff-btn-outline" onClick={signOut}>
          <Icon name="logout" size={17} /> Sign out
        </button>
      </div>

      <div className="ff-grid ff-g4" style={{ marginBottom: 34 }}>
        {[
          ['Orders', orders.length, 'box', '/orders'],
          ['Total spend', rs(totalSpend), 'card', '/orders'],
          ['Wishlist', wishlist.count, 'heart', '/wishlist'],
          ['Comparing', compare.count, 'scale', '/compare']
        ].map(([label, value, icon, to]) => (
          <Link key={label} to={to} className="ff-panel"
            style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14, color: 'inherit' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 'var(--ff-r-sm)',
              background: 'var(--ff-brand-50)' }}>
              <Icon name={icon} size={20} stroke="var(--ff-brand-600)" />
            </span>
            <span>
              <span className="ff-muted" style={{ fontSize: 12, display: 'block' }}>{label}</span>
              <b className="ff-display ff-tnum" style={{ fontSize: 22 }}>{value}</b>
            </span>
          </Link>
        ))}
      </div>

      <div className="ff-layout" style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <form className="ff-panel" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }}
            onSubmit={save} noValidate>
            <h2 style={{ fontSize: 20 }}>Personal details</h2>
            <div className="ff-grid ff-g2">
              <label className="ff-field">
                <span>Full name</span>
                <input className={`ff-input${errors.name ? ' is-invalid' : ''}`} value={form.name}
                  onChange={set('name')} aria-invalid={!!errors.name} />
                {errors.name && <em className="ff-field-error">{errors.name}</em>}
              </label>
              <label className="ff-field">
                <span>Email</span>
                <input className={`ff-input${errors.email ? ' is-invalid' : ''}`} type="email" value={form.email}
                  onChange={set('email')} aria-invalid={!!errors.email} />
                {errors.email && <em className="ff-field-error">{errors.email}</em>}
              </label>
            </div>
            <div className="ff-grid ff-g2">
              <label className="ff-field">
                <span>Phone</span>
                <input className={`ff-input${errors.phone ? ' is-invalid' : ''}`} type="tel" value={form.phone}
                  onChange={set('phone')} placeholder="077 123 4567" aria-invalid={!!errors.phone} />
                {errors.phone && <em className="ff-field-error">{errors.phone}</em>}
              </label>
              <label className="ff-field">
                <span>City</span>
                <input className="ff-input" value={form.city} onChange={set('city')} placeholder="Colombo" />
              </label>
            </div>
            <div>
              <button className="ff-btn ff-btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>

          <section className="ff-panel" style={{ padding: 26 }}>
            <div className="ff-head-row" style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: 20 }}>Recent orders</h2>
              <Link className="ff-btn ff-btn-outline ff-btn-sm" to="/orders">View all</Link>
            </div>
            {orders.length === 0 ? (
              <p className="ff-muted">You have not placed an order yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {orders.slice(0, 4).map((o) => (
                  <li key={o.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 14,
                    alignItems: 'center', flexWrap: 'wrap', padding: '14px 0',
                    borderBottom: '1px solid var(--ff-gray-200)' }}>
                    <span>
                      <Link to={`/orders/${o.id}`} style={{ fontWeight: 600, color: 'var(--ff-gray-900)' }}>{o.id}</Link>
                      <span className="ff-muted" style={{ display: 'block', fontSize: 13 }}>{formatDate(o.placedAt)}</span>
                    </span>
                    <StatusBadge status={o.status} />
                    <b className="ff-tnum">{rs(o.total)}</b>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section className="ff-panel" style={{ padding: 24, background: 'var(--ff-dark)', color: '#fff', border: 0 }}>
            <span className="ff-eyebrow">Loyalty</span>
            <h2 className="ff-display" style={{ fontSize: 40, margin: '8px 0 2px' }}>{points.toLocaleString('en-IN')}</h2>
            <p style={{ fontSize: 13, color: 'var(--ff-gray-200)' }}>points · {tier.name} member</p>

            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,.18)', marginTop: 18 }}>
              <span style={{ display: 'block', height: '100%', borderRadius: 4,
                width: `${Math.min(100, Math.max(4, progress))}%`, background: 'var(--ff-brand-500)' }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--ff-gray-200)', marginTop: 10 }}>
              {nextTier
                ? `${(nextTier.at - points).toLocaleString('en-IN')} points to ${nextTier.name}`
                : 'You have reached our highest tier.'}
            </p>
            <p style={{ fontSize: 12, color: 'var(--ff-gray-300)', marginTop: 12 }}>
              You earn 1 point for every Rs 100 spent. 100 points = Rs 100 off any future order.
            </p>
          </section>

          <section className="ff-panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Your coupons</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COUPONS.map((c) => (
                <li key={c.code} style={{ border: '1px dashed var(--ff-brand-500)', borderRadius: 'var(--ff-r-sm)',
                  padding: '12px 14px', background: 'var(--ff-brand-50)' }}>
                  <b className="ff-display" style={{ fontSize: 16, color: 'var(--ff-brand-700)' }}>{c.code}</b>
                  <span className="ff-muted" style={{ display: 'block', fontSize: 12, marginTop: 3 }}>{c.label}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
