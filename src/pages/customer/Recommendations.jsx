import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import Icon from '../../components/common/Icon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { orderService, productService } from '../../services';
import { storage } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

/**
 * Recommendations are scored client-side from signals we already hold:
 * what you bought, what is in your cart and wishlist, and what your BMI suggests.
 */
const score = (product, signals) => {
  let s = product.rating * 2 + Math.log10(product.reviewCount + 1);
  if (signals.categories[product.category]) s += signals.categories[product.category] * 4;
  if (signals.brands[product.brand]) s += signals.brands[product.brand] * 2;
  if (signals.goalCategory === product.category) s += 5;
  if (product.bestseller) s += 1.5;
  if (product.featured) s += 1;
  if (product.stock === 0) s -= 10;
  return s;
};

export default function Recommendations() {
  useDocumentTitle('Recommended for you');
  const { user, isAuthenticated } = useAuth();
  const cart = useCart();
  const wishlist = useWishlist();
  const [all, setAll] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([productService.getProducts(), user ? orderService.getOrders(user.id) : Promise.resolve([])])
      .then(([products, history]) => {
        if (!alive) return;
        setAll(products);
        setOrders(history);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user]);

  const bmi = storage.get('bmi', {}).bmi;
  const goalCategory = bmi ? (bmi < 18.5 ? 'protein' : bmi < 25 ? 'creatine' : 'cardio') : null;

  const signals = useMemo(() => {
    const categories = {};
    const brands = {};
    const owned = new Set();
    const bump = (id, weight) => {
      const p = all.find((x) => x.id === id);
      if (!p) return;
      categories[p.category] = (categories[p.category] || 0) + weight;
      brands[p.brand] = (brands[p.brand] || 0) + weight;
    };
    orders.forEach((o) => o.items.forEach((l) => { bump(l.id, 1.5); owned.add(l.id); }));
    cart.items.forEach((l) => bump(l.id, 1));
    wishlist.ids.forEach((id) => bump(id, 0.75));
    return { categories, brands, owned, goalCategory };
  }, [all, orders, cart.items, wishlist.ids, goalCategory]);

  const ranked = useMemo(
    () =>
      [...all]
        .filter((p) => !signals.owned.has(p.id) && !cart.has(p.id))
        .sort((a, b) => score(b, signals) - score(a, signals)),
    [all, signals, cart]
  );

  const hasSignals = orders.length > 0 || cart.items.length > 0 || wishlist.count > 0 || !!bmi;

  const reasons = [
    orders.length > 0 && `${orders.length} past order${orders.length === 1 ? '' : 's'}`,
    cart.items.length > 0 && `${cart.items.length} item${cart.items.length === 1 ? '' : 's'} in your cart`,
    wishlist.count > 0 && `${wishlist.count} wishlist save${wishlist.count === 1 ? '' : 's'}`,
    bmi && `your BMI of ${bmi}`
  ].filter(Boolean);

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Recommended' }]} />

      <div className="ff-sec-head">
        <span className="ff-eyebrow">Personalised</span>
        <h1 style={{ fontSize: 34 }}>Recommended for you</h1>
        <p>
          {hasSignals
            ? `Ranked from ${reasons.join(', ')}.`
            : 'Right now these are our highest-rated products. Shop, save and rate a few things and this page will learn what you like.'}
        </p>
      </div>

      {!isAuthenticated && (
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: 'var(--ff-brand-50)', border: '1px solid var(--ff-brand-100)', color: 'var(--ff-brand-700)',
          padding: '12px 18px', borderRadius: 'var(--ff-r-sm)', fontSize: 14, marginBottom: 26 }}>
          <Icon name="sparkle" size={17} stroke="var(--ff-brand-600)" />
          <span>
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link> to include your order history in these picks.
          </span>
        </p>
      )}

      <section style={{ marginBottom: 48 }}>
        <div className="ff-head-row">
          <h2 style={{ fontSize: 26 }}>Top picks</h2>
          <Link className="ff-btn ff-btn-outline ff-btn-sm" to="/shop">Browse everything</Link>
        </div>
        <ProductGrid products={ranked.slice(0, 8)} loading={loading} columns={4} />
      </section>

      {goalCategory && (
        <section style={{ marginBottom: 48 }}>
          <div className="ff-head-row">
            <h2 style={{ fontSize: 26 }}>Matched to your BMI result</h2>
            <Link className="ff-btn ff-btn-outline ff-btn-sm" to="/bmi">Recalculate BMI</Link>
          </div>
          <ProductGrid
            products={ranked.filter((p) => p.category === goalCategory).slice(0, 4)}
            loading={loading} columns={4}
          />
        </section>
      )}

      {orders.length > 0 && (
        <section>
          <div className="ff-head-row">
            <h2 style={{ fontSize: 26 }}>Because you bought before</h2>
            <Link className="ff-btn ff-btn-outline ff-btn-sm" to="/orders">View my orders</Link>
          </div>
          <ProductGrid
            products={ranked.filter((p) => signals.categories[p.category]).slice(0, 4)}
            loading={loading} columns={4}
          />
        </section>
      )}
    </div>
  );
}
