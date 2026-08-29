import { Link } from 'react-router-dom';

const COLS = [
  { title: 'Shop', links: [['Everything', '/shop'], ['Fitness Equipment', '/category/dumbbells'],
    ['Supplements', '/category/protein'], ['Compare products', '/compare']] },
  { title: 'Your account', links: [['My profile', '/profile'], ['My orders', '/orders'],
    ['Wishlist', '/wishlist'], ['Loyalty points', '/profile']] },
  { title: 'Fitness tools', links: [['BMI calculator', '/bmi'], ['Recommendations', '/recommendations'],
    ['Best deals', '/shop'], ['New arrivals', '/shop']] },
  { title: 'Contact', links: [['support@fitfuel.lk', '/'], ['077 458 9685', '/'], ['Store location', '/']] }
];

export default function Footer() {
  return (
    <footer className="ff-ftr">
      <div className="ff-wrap">
        <div className="ff-fcols">
          {COLS.map((col) => (
            <div className="ff-fcol" key={col.title}>
              <h4>{col.title}</h4>
              {col.links.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}
            </div>
          ))}
          <div className="ff-fcol">
            <h4 style={{ fontFamily: 'var(--ff-display)', fontSize: 24, color: 'var(--ff-gray-900)', fontWeight: 600 }}>
              Follow us on
            </h4>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.7" aria-label="Instagram">
                <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="#212121" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" aria-label="Facebook">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
              </svg>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#212121" aria-label="X">
                <path d="M17.5 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L1.4 3H8l4.7 6.2zm-1.2 16h1.8L7.8 4.9H5.9z" />
              </svg>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF0000" aria-label="YouTube">
                <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap', marginTop: 44 }}>
          <span style={{ fontSize: 13, color: 'var(--ff-gray-700)' }}>100% Safe &amp; Secure payments</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontWeight: 700, fontSize: 14 }}>
            <span style={{ color: '#253B80' }}>PayPal</span>
            <span style={{ color: '#1A1F71', fontStyle: 'italic', fontSize: 17 }}>VISA</span>
            <svg width="40" height="24" viewBox="0 0 40 24" aria-label="Mastercard">
              <circle cx="15" cy="12" r="9" fill="#EB001B" />
              <circle cx="25" cy="12" r="9" fill="#F79E1B" opacity=".85" />
            </svg>
            <span style={{ background: '#016FD0', color: '#fff', borderRadius: 3, padding: '3px 6px', fontSize: 10 }}>AMEX</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--ff-gray-200)', marginTop: 24, paddingTop: 22,
          textAlign: 'center', fontSize: 13, color: 'var(--ff-gray-700)' }}>
          © 2026 FitFuel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
