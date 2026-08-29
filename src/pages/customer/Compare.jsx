import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import Rating from '../../components/common/Rating';
import ProductArt from '../../components/product/ProductArt';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { productService } from '../../services';
import { discountPct, rs } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';

export default function Compare() {
  useDocumentTitle('Compare products');
  const compare = useCompare();
  const cart = useCart();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    productService.getProducts()
      .then((all) => {
        if (!alive) return;
        /* Preserve the order the shopper added them in. */
        setProducts(compare.ids.map((id) => all.find((p) => p.id === id)).filter(Boolean));
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [compare.ids]);

  /* Union of every spec label across the selection, so rows line up even when models differ. */
  const specRows = useMemo(() => {
    const labels = [];
    products.forEach((p) => (p.specifications || []).forEach(([k]) => {
      if (!labels.includes(k)) labels.push(k);
    }));
    return labels;
  }, [products]);

  const cheapest = products.length > 1 ? Math.min(...products.map((p) => p.discountPrice)) : null;
  const bestRated = products.length > 1 ? Math.max(...products.map((p) => p.rating)) : null;

  if (!loading && !products.length)
    return (
      <div className="ff-wrap ff-sec">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Compare' }]} />
        <EmptyState
          icon="scale" title="Nothing to compare yet"
          message={`Add up to ${compare.max} products from any product page to see them side by side.`}
          action={<Link className="ff-btn ff-btn-primary" to="/shop">Browse products</Link>}
        />
      </div>
    );

  const spec = (p, label) => (p.specifications || []).find(([k]) => k === label)?.[1] || '—';

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Compare' }]} />

      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 32 }}>Compare products</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            {products.length} of {compare.max} slots used
          </p>
        </div>
        <button type="button" className="ff-btn ff-btn-outline"
          onClick={() => { compare.clear(); toast.info('Comparison cleared'); }}>
          Clear all
        </button>
      </div>

      {loading ? (
        <div className="ff-skel" style={{ height: 380 }} />
      ) : (
        <div className="ff-table-wrap">
          <table className="ff-table">
            <caption className="ff-sr">Side-by-side product comparison</caption>
            <thead>
              <tr>
                <th scope="col" style={{ width: 180 }}>Product</th>
                {products.map((p) => (
                  <th key={p.id} scope="col" style={{ minWidth: 220, textTransform: 'none', fontSize: 13 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', padding: '6px 0' }}>
                      <span className="ff-line-art" style={{ width: 84, height: 84 }}>
                        <ProductArt product={p} />
                      </span>
                      <Link to={`/product/${p.id}`} style={{ fontWeight: 600, fontSize: 14, color: 'var(--ff-gray-900)' }}>
                        {p.name}
                      </Link>
                      <button type="button" className="ff-btn-ghost"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ff-error-700)' }}
                        onClick={() => compare.remove(p.id)}>
                        <Icon name="close" size={13} stroke="var(--ff-error-700)" /> Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Price</th>
                {products.map((p) => (
                  <td key={p.id}>
                    <b className="ff-tnum ff-display" style={{ fontSize: 19, color: 'var(--ff-brand-600)' }}>
                      {rs(p.discountPrice)}
                    </b>
                    {discountPct(p) > 0 && (
                      <span className="ff-strike ff-tnum" style={{ display: 'block', fontSize: 13 }}>{rs(p.price)}</span>
                    )}
                    {p.discountPrice === cheapest && (
                      <span className="ff-badge ff-badge-good" style={{ marginTop: 6 }}>Lowest price</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Rating</th>
                {products.map((p) => (
                  <td key={p.id}>
                    <Rating value={p.rating} count={p.reviewCount} tone="light" size={14} />
                    {p.rating === bestRated && (
                      <span className="ff-badge ff-badge-info" style={{ marginTop: 6 }}>Best rated</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Brand</th>
                {products.map((p) => <td key={p.id}>{p.brand}</td>)}
              </tr>
              <tr>
                <th scope="row">Availability</th>
                {products.map((p) => (
                  <td key={p.id}>
                    <span className={`ff-badge ${p.stock > 10 ? 'ff-badge-good' : p.stock > 0 ? 'ff-badge-warn' : 'ff-badge-bad'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                ))}
              </tr>
              {specRows.map((label) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {products.map((p) => <td key={p.id}>{spec(p, label)}</td>)}
                </tr>
              ))}
              <tr>
                <th scope="row" />
                {products.map((p) => (
                  <td key={p.id}>
                    <button type="button" className="ff-btn ff-btn-primary ff-btn-sm" disabled={p.stock === 0}
                      onClick={() => { cart.add(p); toast.success('Added to cart successfully'); }}>
                      Add to cart
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
