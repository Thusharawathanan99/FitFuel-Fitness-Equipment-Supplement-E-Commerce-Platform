import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { CATEGORIES } from '../../data/categories';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="ff-wrap ff-sec" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 90 }}>
      <span className="ff-display" style={{ fontSize: 96, fontWeight: 600, color: 'var(--ff-brand-500)', lineHeight: 1 }}>
        404
      </span>
      <h1 style={{ fontSize: 32, margin: '14px 0 10px' }}>We could not find that page</h1>
      <p className="ff-muted" style={{ maxWidth: 460, margin: '0 auto 26px' }}>
        The link may be out of date, or the product may have been removed from the catalogue.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
        <Link className="ff-btn ff-btn-primary ff-btn-lg" to="/">
          <Icon name="chevronLeft" size={18} stroke="#fff" /> Back to home
        </Link>
        <Link className="ff-btn ff-btn-outline ff-btn-lg" to="/shop">Browse the shop</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} className="ff-chip" to={`/category/${c.slug}`}>{c.name}</Link>
        ))}
      </div>
    </div>
  );
}
