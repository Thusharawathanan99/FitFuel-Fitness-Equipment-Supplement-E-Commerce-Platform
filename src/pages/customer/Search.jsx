import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import SortDropdown from '../../components/product/SortDropdown';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useProducts from '../../hooks/useProducts';
import { CATEGORIES } from '../../data/categories';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'popular';
  useDocumentTitle(q ? `Search: ${q}` : 'Search');

  const query = useMemo(() => ({ search: q, sort }), [q, sort]);
  const { products, loading } = useProducts(query, [q, sort]);

  const setSort = (value) => {
    const next = new URLSearchParams(params);
    next.set('sort', value);
    setParams(next, { replace: true });
  };

  /* When nothing matches, point people at categories rather than a dead end. */
  const suggestions = CATEGORIES.slice(0, 6);

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />

      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 32 }}>
            {q ? <>Results for “{q}”</> : 'Search the catalogue'}
          </h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            {loading ? 'Searching…' : `${products.length} product${products.length === 1 ? '' : 's'} found`}
          </p>
        </div>
        {products.length > 0 && <SortDropdown value={sort} onChange={setSort} />}
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        columns={4}
        emptyTitle={q ? `Nothing matched “${q}”` : 'Type something to search'}
        emptyMessage="Check the spelling, try a shorter phrase, or browse a category below."
        emptyAction={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {suggestions.map((c) => (
              <Link key={c.slug} className="ff-chip" to={`/category/${c.slug}`}>{c.name}</Link>
            ))}
          </div>
        }
      />
    </div>
  );
}
