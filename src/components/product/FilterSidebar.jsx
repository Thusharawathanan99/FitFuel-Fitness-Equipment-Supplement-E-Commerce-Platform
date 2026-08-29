import { Link } from 'react-router-dom';
import Icon from '../common/Icon';
import { rs } from '../../utils/format';

function Check({ label, count, checked, onChange }) {
  return (
    <label className="ff-check">
      <span>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="ff-box" aria-hidden="true">
          <Icon name="check" size={11} stroke="#fff" strokeWidth={3.2} />
        </span>
        <span style={{ fontWeight: checked ? 600 : 400 }}>{label}</span>
      </span>
      {count != null && <span style={{ fontSize: 13, color: 'var(--ff-gray-500)' }}>{count}</span>}
    </label>
  );
}

export default function FilterSidebar({
  categories = [], brands = [], counts = {},
  selectedCategories = [], selectedBrands = [], maxPrice, minRating,
  priceCeiling = 320000, onToggleCategory, onToggleBrand, onPrice, onRating, onClear
}) {
  const active = selectedCategories.length + selectedBrands.length + (maxPrice ? 1 : 0) + (minRating ? 1 : 0);

  return (
    <aside className="ff-filters" aria-label="Product filters">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 14, borderBottom: '1px solid var(--ff-gray-200)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 600, fontSize: 16 }}>
          <Icon name="filter" size={18} strokeWidth={1.8} /> Filters
        </span>
        {active > 0 && (
          <button type="button" className="ff-btn-ghost" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ff-brand-500)' }}
            onClick={onClear}>Clear all</button>
        )}
      </div>

      {active > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {selectedCategories.map((slug) => {
            const c = categories.find((x) => x.slug === slug);
            return (
              <span key={slug} className="ff-chip">
                {c?.name || slug}
                <button type="button" onClick={() => onToggleCategory(slug)} aria-label={`Remove ${c?.name || slug} filter`}>
                  <Icon name="close" size={11} strokeWidth={2.6} />
                </button>
              </span>
            );
          })}
          {selectedBrands.map((b) => (
            <span key={b} className="ff-chip">
              {b}
              <button type="button" onClick={() => onToggleBrand(b)} aria-label={`Remove ${b} filter`}>
                <Icon name="close" size={11} strokeWidth={2.6} />
              </button>
            </span>
          ))}
          {maxPrice > 0 && (
            <span className="ff-chip">
              Under {rs(maxPrice)}
              <button type="button" onClick={() => onPrice(0)} aria-label="Remove price filter">
                <Icon name="close" size={11} strokeWidth={2.6} />
              </button>
            </span>
          )}
        </div>
      )}

      {categories.length > 0 && (
        <div className="ff-fgroup">
          <h4>Category</h4>
          {categories.map((c) => (
            <Check key={c.slug} label={c.name} count={counts[c.slug]}
              checked={selectedCategories.includes(c.slug)} onChange={() => onToggleCategory(c.slug)} />
          ))}
        </div>
      )}

      <div className="ff-fgroup">
        <h4>Brand</h4>
        {brands.map((b) => (
          <Check key={b} label={b} count={counts[b]} checked={selectedBrands.includes(b)}
            onChange={() => onToggleBrand(b)} />
        ))}
      </div>

      <div className="ff-fgroup">
        <h4>Max price</h4>
        <input
          type="range" min={2000} max={priceCeiling} step={1000}
          value={maxPrice || priceCeiling} onChange={(e) => onPrice(Number(e.target.value))}
          style={{ accentColor: 'var(--ff-brand-500)', width: '100%' }}
          aria-label="Maximum price"
        />
        <span style={{ fontSize: 13, color: 'var(--ff-gray-500)' }}>
          {maxPrice ? `Up to ${rs(maxPrice)}` : 'Any price'}
        </span>
      </div>

      <div className="ff-fgroup" style={{ border: 0 }}>
        <h4>Rating</h4>
        {[4.5, 4, 3.5].map((r) => (
          <Check key={r} label={`${r} & up`} checked={minRating === r}
            onChange={() => onRating(minRating === r ? 0 : r)} />
        ))}
      </div>

      <div className="ff-panel" style={{ background: 'var(--ff-dark)', border: 0, color: '#fff',
        display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong style={{ fontSize: 14, color: 'var(--ff-brand-500)' }}>Not sure what to buy?</strong>
        <p style={{ fontSize: 14, color: '#D4D4D4', lineHeight: 1.5 }}>
          Answer four questions and we will shortlist the right products for your goal and budget.
        </p>
        <Link className="ff-btn ff-btn-primary" to="/recommendations">Get recommendations</Link>
      </div>
    </aside>
  );
}
