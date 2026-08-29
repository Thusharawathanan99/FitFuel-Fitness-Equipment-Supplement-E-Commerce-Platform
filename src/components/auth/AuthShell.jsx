import { Link } from 'react-router-dom';
import Icon from '../common/Icon';

/** Shared two-column frame for every auth screen, so they stay identical. */
export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="ff-wrap ff-sec">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 440px) minmax(0, 1fr)',
        gap: 56, alignItems: 'center' }} className="ff-auth">
        <div className="ff-panel" style={{ padding: 34, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span className="ff-eyebrow">{eyebrow}</span>
            <h1 style={{ fontSize: 30, margin: '8px 0 8px' }}>{title}</h1>
            {subtitle && <p className="ff-muted">{subtitle}</p>}
          </div>
          {children}
          {footer && <div style={{ fontSize: 14, textAlign: 'center' }}>{footer}</div>}
        </div>

        <aside className="ff-sec-dark" style={{ borderRadius: 'var(--ff-r-card)', padding: 44,
          display: 'flex', flexDirection: 'column', gap: 22 }}>
          <span className="ff-eyebrow">FitFuel members</span>
          <h2 style={{ fontSize: 30, color: '#fff', maxWidth: 420 }}>
            Everything you need to train, in one account.
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['gift', 'Loyalty points', 'Earn a point for every Rs 100 and spend them on any order.'],
              ['truck', 'Live order tracking', 'Follow every order from packed to delivered.'],
              ['heart', 'Wishlist across devices', 'Save products now, decide later.'],
              ['sparkle', 'Personal recommendations', 'Picks that learn from what you buy and rate.']
            ].map(([icon, title2, body]) => (
              <li key={title2} style={{ display: 'flex', gap: 14 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, flexShrink: 0,
                  borderRadius: 'var(--ff-r-sm)', background: 'rgba(41,171,226,.16)' }}>
                  <Icon name={icon} size={19} stroke="var(--ff-brand-400)" />
                </span>
                <span>
                  <b style={{ display: 'block', fontSize: 15, color: '#fff' }}>{title2}</b>
                  <span style={{ fontSize: 13, color: 'var(--ff-gray-300)' }}>{body}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link className="ff-btn ff-btn-primary" to="/shop" style={{ alignSelf: 'flex-start' }}>
            Browse the shop <Icon name="arrowRight" size={17} stroke="#fff" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
