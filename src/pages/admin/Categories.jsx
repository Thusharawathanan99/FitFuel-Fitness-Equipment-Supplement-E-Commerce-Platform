import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductArt from '../../components/product/ProductArt';
import Icon from '../../components/common/Icon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { productService } from '../../services';
import { CATEGORIES, GROUPS } from '../../data/categories';
import { rs } from '../../utils/format';

export default function AdminCategories() {
  useDocumentTitle('Admin · Categories');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  const rows = useMemo(
    () =>
      CATEGORIES.map((c) => {
        const items = products.filter((p) => p.category === c.slug);
        const stock = items.reduce((s, p) => s + p.stock, 0);
        const value = items.reduce((s, p) => s + p.discountPrice * p.stock, 0);
        const rating = items.length
          ? Math.round((items.reduce((s, p) => s + p.rating, 0) / items.length) * 10) / 10
          : 0;
        return { ...c, count: items.length, stock, value, rating };
      }),
    [products]
  );

  const byGroup = (group) => rows.filter((r) => r.group === group);

  if (loading) return <div className="ff-skel" style={{ height: 360 }} />;

  return (
    <>
      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 28 }}>Categories</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            {CATEGORIES.length} categories across {Object.keys(GROUPS).length} groups
          </p>
        </div>
        <Link className="ff-btn ff-btn-primary ff-btn-sm" to="/admin/products/new">
          <Icon name="plus" size={16} stroke="#fff" /> Add product
        </Link>
      </div>

      {['equipment', 'supplement'].map((group) => (
        <section key={group} style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 20, marginBottom: 14 }}>{GROUPS[group].name}</h2>
          <div className="ff-grid ff-g4">
            {byGroup(group).map((c) => (
              <article key={c.slug} className="ff-panel" style={{ padding: 20, display: 'flex',
                flexDirection: 'column', gap: 12 }}>
                <span style={{ height: 52, display: 'grid', placeItems: 'center' }}>
                  <ProductArt artKey={c.art} />
                </span>
                <div>
                  <b className="ff-display" style={{ fontSize: 17 }}>{c.name}</b>
                  <span className="ff-muted" style={{ display: 'block', fontSize: 12 }}>/{c.slug}</span>
                </div>
                <dl style={{ margin: 0, display: 'grid', gap: 6, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt className="ff-muted">Products</dt><dd style={{ margin: 0 }}><b>{c.count}</b></dd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt className="ff-muted">Units in stock</dt><dd style={{ margin: 0 }}><b className="ff-tnum">{c.stock}</b></dd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt className="ff-muted">Stock value</dt><dd style={{ margin: 0 }}><b className="ff-tnum">{rs(c.value)}</b></dd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt className="ff-muted">Avg rating</dt><dd style={{ margin: 0 }}><b className="ff-tnum">{c.rating || '—'}</b></dd>
                  </div>
                </dl>
                <Link className="ff-btn ff-btn-outline ff-btn-sm" to={`/category/${c.slug}`}>
                  View on storefront
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
