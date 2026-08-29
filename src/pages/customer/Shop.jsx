import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import FilterSidebar from '../../components/product/FilterSidebar';
import ProductGrid from '../../components/product/ProductGrid';
import SortDropdown from '../../components/product/SortDropdown';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useProducts from '../../hooks/useProducts';
import { CATEGORIES, GROUPS, categoryBySlug } from '../../data/categories';
import { BRANDS, PRODUCTS } from '../../data/products';

const PRICE_CEILING = 320000;

/** Serves /shop, /shop?group=equipment and /category/:slug from one query model. */
export default function Shop() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const category = slug ? categoryBySlug(slug) : null;

  const groupParam = params.get('group') || (category ? category.group : '');
  const [selectedCategories, setSelectedCategories] = useState(
    () => (slug ? [slug] : params.getAll('category'))
  );
  const [selectedBrands, setSelectedBrands] = useState(() => params.getAll('brand'));
  const [maxPrice, setMaxPrice] = useState(() => Number(params.get('maxPrice')) || 0);
  const [minRating, setMinRating] = useState(() => Number(params.get('rating')) || 0);
  const [sort, setSort] = useState(() => params.get('sort') || 'popular');

  /* A category route drives the filter rather than the other way round. */
  useEffect(() => { setSelectedCategories(slug ? [slug] : []); }, [slug]);

  const title = category ? category.name : groupParam ? GROUPS[groupParam]?.name : 'Shop everything';
  useDocumentTitle(title);

  const query = useMemo(
    () => ({
      group: groupParam || undefined,
      category: selectedCategories,
      brand: selectedBrands,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      sort
    }),
    [groupParam, selectedCategories, selectedBrands, maxPrice, minRating, sort]
  );

  const { products, loading, error } = useProducts(query, [
    groupParam, selectedCategories.join(','), selectedBrands.join(','), maxPrice, minRating, sort
  ]);

  /* Keep the URL shareable without turning every keystroke into a history entry. */
  useEffect(() => {
    if (slug) return;
    const next = new URLSearchParams();
    if (groupParam) next.set('group', groupParam);
    selectedCategories.forEach((c) => next.append('category', c));
    selectedBrands.forEach((b) => next.append('brand', b));
    if (maxPrice) next.set('maxPrice', String(maxPrice));
    if (minRating) next.set('rating', String(minRating));
    if (sort !== 'popular') next.set('sort', sort);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupParam, selectedCategories, selectedBrands, maxPrice, minRating, sort, slug]);

  const scope = useMemo(
    () => (groupParam ? PRODUCTS.filter((p) => p.group === groupParam) : PRODUCTS),
    [groupParam]
  );
  const counts = useMemo(() => {
    const out = {};
    scope.forEach((p) => {
      out[p.category] = (out[p.category] || 0) + 1;
      out[p.brand] = (out[p.brand] || 0) + 1;
    });
    return out;
  }, [scope]);

  const visibleCategories = groupParam ? CATEGORIES.filter((c) => c.group === groupParam) : CATEGORIES;
  const visibleBrands = groupParam
    ? [...new Set(scope.map((p) => p.brand))].sort()
    : BRANDS;

  const toggle = (setter) => (value) =>
    setter((list) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]));

  const clearAll = () => {
    setSelectedCategories(slug ? [slug] : []);
    setSelectedBrands([]);
    setMaxPrice(0);
    setMinRating(0);
  };

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          ...(groupParam ? [{ label: GROUPS[groupParam].name, to: `/shop?group=${groupParam}` }] : []),
          { label: category ? category.name : 'Shop' }
        ]}
      />

      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 34 }}>{title}</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            {loading ? 'Loading products…' : `${products.length} products`}
            {category ? ` in ${category.name}` : ''}
          </p>
        </div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div className="ff-layout">
        <FilterSidebar
          categories={visibleCategories}
          brands={visibleBrands}
          counts={counts}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          maxPrice={maxPrice}
          minRating={minRating}
          priceCeiling={PRICE_CEILING}
          onToggleCategory={toggle(setSelectedCategories)}
          onToggleBrand={toggle(setSelectedBrands)}
          onPrice={setMaxPrice}
          onRating={setMinRating}
          onClear={clearAll}
        />

        <div>
          {error ? (
            <div className="ff-empty">
              <h3>We could not load the catalogue</h3>
              <p className="ff-muted">{error}</p>
            </div>
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              columns={3}
              emptyAction={
                <button type="button" className="ff-btn ff-btn-primary" onClick={clearAll}>
                  Clear filters
                </button>
              }
            />
          )}

          {!loading && !error && products.length > 0 && (
            <p className="ff-muted" style={{ marginTop: 32, textAlign: 'center', fontSize: 14 }}>
              Showing all {products.length} results ·{' '}
              <Link to="/shop">browse the full catalogue</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
