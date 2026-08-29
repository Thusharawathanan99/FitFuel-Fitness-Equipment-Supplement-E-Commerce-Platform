import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import Icon from '../../components/common/Icon';
import QuantitySelector from '../../components/common/QuantitySelector';
import Rating from '../../components/common/Rating';
import ErrorState from '../../components/common/ErrorState';
import ProductArt from '../../components/product/ProductArt';
import ProductGrid from '../../components/product/ProductGrid';
import ReviewForm from '../../components/product/ReviewForm';
import ReviewList from '../../components/product/ReviewList';
import WishlistButton from '../../components/product/WishlistButton';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { productService, reviewService } from '../../services';
import { categoryBySlug, GROUPS } from '../../data/categories';
import { discountPct, rs } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' }
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const compare = useCompare();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useDocumentTitle(product?.name);

  const loadReviews = useCallback(async (p) => {
    const list = await reviewService.getReviews(p);
    setReviews(list);
    setSummary(reviewService.summarise(p, list));
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setQty(1);
    setTab('description');
    productService
      .getProductById(id)
      .then(async (p) => {
        if (!alive) return;
        setProduct(p);
        const [rel] = await Promise.all([productService.getRelated(p, 4), loadReviews(p)]);
        if (alive) setRelated(rel);
      })
      .catch((e) => { if (alive) setError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, loadReviews]);

  if (loading)
    return (
      <div className="ff-wrap ff-sec">
        <span className="ff-sr" role="status">Loading product</span>
        <div className="ff-grid ff-g2" style={{ gap: 48 }}>
          <div className="ff-skel" style={{ height: 460 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ff-skel" style={{ height: 42 }} />
            <div className="ff-skel" style={{ height: 22, width: '60%' }} />
            <div className="ff-skel" style={{ height: 120 }} />
            <div className="ff-skel" style={{ height: 52 }} />
          </div>
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="ff-wrap ff-sec">
        <ErrorState
          title="We could not find that product"
          message={error || 'It may have been removed from the catalogue.'}
          onRetry={() => navigate('/shop')}
        />
      </div>
    );

  const off = discountPct(product);
  const category = categoryBySlug(product.category);
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  const addToCart = () => {
    cart.add(product, qty);
    toast.success(`${qty} × ${product.name} added to cart`);
  };

  const buyNow = () => {
    cart.add(product, qty);
    navigate('/cart');
  };

  const toggleCompare = () => {
    const result = compare.toggle(product.id);
    if (result.full) toast.error(`You can compare up to ${compare.max} products at a time`);
    else if (result.added) toast.success('Added to comparison');
    else toast.info('Removed from comparison');
  };

  const postReview = async (draft) => {
    await reviewService.addReview({ ...draft, productId: product.id });
    await loadReviews(product);
    setTab('reviews');
  };

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: GROUPS[product.group].name, to: `/shop?group=${product.group}` },
          ...(category ? [{ label: category.name, to: `/category/${category.slug}` }] : []),
          { label: product.name }
        ]}
      />

      <div className="ff-grid ff-g2" style={{ gap: 48, alignItems: 'start' }}>
        <div className="ff-panel" style={{ position: 'relative', display: 'grid', placeItems: 'center',
          padding: 40, minHeight: 460, background: 'var(--ff-gray-50)' }}>
          {off > 0 && (
            <span className="ff-badge ff-badge-off" style={{ position: 'absolute', top: 20, left: 20 }}>
              {off}% off
            </span>
          )}
          <WishlistButton product={product} className="ff-icon-btn" />
          <ProductArt product={product} style={{ width: 300, maxWidth: '100%', height: 'auto' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <p className="ff-eyebrow">{product.brand}</p>
            <h1 style={{ fontSize: 34, marginTop: 6 }}>{product.name}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Rating value={summary?.average ?? product.rating} count={summary?.total ?? product.reviewCount} tone="light" size={18} />
            <button type="button" className="ff-btn-ghost" style={{ fontSize: 13, textDecoration: 'underline' }}
              onClick={() => setTab('reviews')}>
              Read reviews
            </button>
            <span className="ff-muted" style={{ fontSize: 13 }}>SKU {product.sku}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span className="ff-display ff-tnum" style={{ fontSize: 38, fontWeight: 600, color: 'var(--ff-brand-600)' }}>
              {rs(product.discountPrice)}
            </span>
            {off > 0 && <span className="ff-strike ff-tnum" style={{ fontSize: 20 }}>{rs(product.price)}</span>}
            {off > 0 && (
              <span style={{ color: 'var(--ff-success-700)', fontWeight: 600, fontSize: 15 }}>
                You save {rs(product.price - product.discountPrice)}
              </span>
            )}
          </div>

          <p className="ff-muted" style={{ fontSize: 16, maxWidth: 560 }}>{product.description}</p>

          <p style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, fontWeight: 600,
            color: soldOut ? 'var(--ff-error-700)' : lowStock ? 'var(--ff-warning-400)' : 'var(--ff-success-700)' }}>
            <Icon name={soldOut ? 'alert' : 'check'} size={17} strokeWidth={2.2} />
            {soldOut ? 'Out of stock' : lowStock ? `Only ${product.stock} left in stock` : `In stock — ${product.stock} available`}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <QuantitySelector value={qty} onChange={setQty} max={Math.max(1, product.stock)} />
            <button className="ff-btn ff-btn-dark ff-btn-lg" onClick={addToCart} disabled={soldOut}>
              <Icon name="cart" size={19} stroke="#fff" /> Add to cart
            </button>
            <button className="ff-btn ff-btn-primary ff-btn-lg" onClick={buyNow} disabled={soldOut}>
              Buy now
            </button>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14 }}>
            <button type="button" className="ff-btn-ghost" onClick={toggleCompare}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
              <Icon name="scale" size={18} />
              {compare.has(product.id) ? 'Remove from compare' : 'Add to compare'}
            </button>
            {compare.count > 0 && <Link to="/compare" style={{ fontWeight: 600 }}>Compare {compare.count} products</Link>}
          </div>

          <ul className="ff-panel" style={{ listStyle: 'none', margin: 0, padding: 18, display: 'grid',
            gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', fontSize: 13 }}>
            {[
              ['truck', 'Free delivery over Rs 15,000'],
              ['shield', 'Genuine product guarantee'],
              ['card', '3 & 6 month instalments'],
              ['headset', '7-day returns on equipment']
            ].map(([icon, label]) => (
              <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name={icon} size={18} stroke="var(--ff-brand-500)" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section style={{ marginTop: 56 }}>
        <div role="tablist" aria-label="Product information"
          style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--ff-gray-200)', flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button
              key={t.id} role="tab" type="button" id={`tab-${t.id}`} aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`} onClick={() => setTab(t.id)}
              style={{ background: 'none', border: 0, padding: '14px 18px', cursor: 'pointer',
                fontWeight: 600, fontSize: 15,
                color: tab === t.id ? 'var(--ff-brand-700)' : 'var(--ff-gray-600)',
                borderBottom: `2px solid ${tab === t.id ? 'var(--ff-brand-500)' : 'transparent'}`, marginBottom: -1 }}
            >
              {t.label}
              {t.id === 'reviews' && ` (${reviews.length})`}
            </button>
          ))}
        </div>

        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} style={{ paddingTop: 28 }}>
          {tab === 'description' && (
            <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 16, color: 'var(--ff-gray-700)' }}>{product.description}</p>
              <p style={{ fontSize: 16, color: 'var(--ff-gray-700)' }}>
                Every {category?.name.toLowerCase() || 'product'} we list is bought direct from{' '}
                {product.brand} or their authorised Sri Lankan distributor, stored in our Colombo
                warehouse, and dispatched island-wide within 48 hours of your order being confirmed.
              </p>
              {product.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {product.tags.map((t) => <span key={t} className="ff-chip">{t}</span>)}
                </div>
              )}
            </div>
          )}

          {tab === 'specifications' && (
            <div className="ff-table-wrap" style={{ maxWidth: 760 }}>
              <table className="ff-table">
                <caption className="ff-sr">Specifications for {product.name}</caption>
                <tbody>
                  {(product.specifications || []).map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row" style={{ width: 220, background: 'var(--ff-gray-50)' }}>{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" style={{ background: 'var(--ff-gray-50)' }}>Brand</th>
                    <td>{product.brand}</td>
                  </tr>
                  <tr>
                    <th scope="row" style={{ background: 'var(--ff-gray-50)' }}>SKU</th>
                    <td>{product.sku}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {tab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <ReviewList reviews={reviews} summary={summary} />
              <div style={{ maxWidth: 640 }}>
                <ReviewForm onSubmit={postReview} />
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <div className="ff-head-row">
            <h2 style={{ fontSize: 28 }}>You may also like</h2>
            <Link className="ff-btn ff-btn-outline ff-btn-sm" to={`/category/${product.category}`}>
              View all {category?.name}
            </Link>
          </div>
          <ProductGrid products={related} columns={4} />
        </section>
      )}
    </div>
  );
}
