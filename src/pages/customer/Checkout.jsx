import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import OrderSteps from '../../components/order/OrderSteps';
import CouponInput from '../../components/checkout/CouponInput';
import ProductArt from '../../components/product/ProductArt';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { orderService } from '../../services';
import { apiRequest } from '../../services/http';
import { rs } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const PAYMENTS = [
  { id: 'Card', label: 'Card payment (Stripe Gateway)', hint: 'Secured via Stripe PaymentIntent — Visa, Mastercard, Amex' },
  { id: 'Cash on delivery', label: 'Cash on delivery', hint: 'Pay the courier when your order arrives' },
  { id: 'Bank transfer', label: 'Bank transfer', hint: 'We email account details after you place the order' }
];

const required = (v) => String(v || '').trim().length > 0;

export default function Checkout() {
  useDocumentTitle('Checkout');
  const cart = useCart();
  const { user, awardPoints } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { totals } = cart;

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: '',
    line1: '', city: '', zip: '', notes: '', payment: 'Card',
    cardNumber: '', cardExpiry: '', cardCvc: ''
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((x) => ({ ...x, [key]: undefined }));
  };

  if (!cart.items.length)
    return (
      <div className="ff-wrap ff-sec">
        <EmptyState
          icon="cart" title="There is nothing to check out"
          message="Add a product to your cart first."
          action={<Link className="ff-btn ff-btn-primary" to="/shop">Browse products</Link>}
        />
      </div>
    );

  const validate = () => {
    const next = {};
    if (!required(form.name)) next.name = 'Enter the name for this delivery.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!/^[0-9+\s-]{9,15}$/.test(form.phone)) next.phone = 'Enter a contact number we can reach you on.';
    if (!required(form.line1)) next.line1 = 'Enter your street address.';
    if (!required(form.city)) next.city = 'Enter your city.';
    if (!/^[0-9]{5}$/.test(form.zip)) next.zip = 'Postcodes are five digits.';
    if (form.payment === 'Card') {
      if (!/^[0-9\s]{15,19}$/.test(form.cardNumber)) next.cardNumber = 'Enter a 16-digit card number.';
      if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(form.cardExpiry)) next.cardExpiry = 'Use MM/YY.';
      if (!/^[0-9]{3,4}$/.test(form.cardCvc)) next.cardCvc = 'CVC is 3 or 4 digits.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the highlighted fields');
      document.querySelector('.is-invalid')?.focus();
      return;
    }
    setPlacing(true);
    try {
      let stripePaymentIntentId = null;
      if (form.payment === 'Card') {
        try {
          const paymentRes = await apiRequest('/payments/create-intent', {
            method: 'POST',
            body: JSON.stringify({
              amount: totals.total,
              currency: 'lkr',
              metadata: {
                customerName: form.name,
                customerEmail: form.email
              }
            })
          });
          stripePaymentIntentId = paymentRes?.paymentIntentId;
          if (stripePaymentIntentId) {
            await apiRequest('/payments/verify', {
              method: 'POST',
              body: JSON.stringify({ paymentIntentId: stripePaymentIntentId })
            }).catch(() => null);
          }
        } catch (stripeErr) {
          console.warn('[Stripe Gateway]', stripeErr.message);
        }
      }

      const order = await orderService.createOrder({
        userId: user?.id || user?._id || 'u1',
        customer: form.name,
        email: form.email,
        phone: form.phone,
        items: cart.items.map((l) => ({ id: l.id, name: l.name, qty: l.qty, price: l.price, art: l.art })),
        subtotal: totals.subtotal,
        discount: totals.couponDiscount,
        coupon: cart.coupon?.code || null,
        delivery: totals.delivery,
        total: totals.total,
        points: totals.pointsEarned,
        address: { line1: form.line1, city: form.city, zip: form.zip },
        notes: form.notes,
        payment: form.payment,
        stripePaymentIntentId
      });
      await awardPoints(totals.pointsEarned);
      cart.clear();
      toast.success(form.payment === 'Card' ? 'Stripe Payment confirmed & Order placed successfully!' : 'Order placed successfully');
      navigate(`/order-success/${order.id}`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'We could not place your order');
      setPlacing(false);
    }
  };

  const field = (key, label, props = {}) => (
    <label className="ff-field">
      <span>{label}</span>
      <input
        className={`ff-input${errors[key] ? ' is-invalid' : ''}`}
        value={form[key]} onChange={set(key)} aria-invalid={!!errors[key]} {...props}
      />
      {errors[key] && <em className="ff-field-error">{errors[key]}</em>}
    </label>
  );

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 style={{ fontSize: 34, marginBottom: 18 }}>Checkout</h1>
      <OrderSteps stage={2} compact />

      <form className="ff-layout" style={{ gridTemplateColumns: 'minmax(0, 1fr) 360px' }} onSubmit={placeOrder} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <section className="ff-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 20 }}>Delivery details</h2>
            <div className="ff-grid ff-g2">
              {field('name', 'Full name', { autoComplete: 'name' })}
              {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
            </div>
            <div className="ff-grid ff-g2">
              {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel', placeholder: '077 123 4567' })}
              {field('zip', 'Postcode', { inputMode: 'numeric', placeholder: '00300' })}
            </div>
            {field('line1', 'Street address', { autoComplete: 'address-line1' })}
            {field('city', 'City', { autoComplete: 'address-level2' })}
            <label className="ff-field">
              <span>Delivery notes <span className="ff-muted">(optional)</span></span>
              <textarea className="ff-input" rows={3} value={form.notes} onChange={set('notes')}
                style={{ height: 'auto', padding: 12, resize: 'vertical' }}
                placeholder="Gate code, landmark, best time to deliver…" />
            </label>
          </section>

          <section className="ff-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 20 }}>Payment method</h2>
            <p className="ff-muted" style={{ fontSize: 13, marginTop: -6 }}>
              This is a demonstration storefront — no payment is processed and no card details leave your browser.
            </p>
            <div role="radiogroup" aria-label="Payment method" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PAYMENTS.map((p) => (
                <label key={p.id}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, cursor: 'pointer',
                    border: `1px solid ${form.payment === p.id ? 'var(--ff-brand-500)' : 'var(--ff-gray-200)'}`,
                    background: form.payment === p.id ? 'var(--ff-brand-50)' : '#fff',
                    borderRadius: 'var(--ff-r-sm)' }}>
                  <input type="radio" name="payment" value={p.id} checked={form.payment === p.id}
                    onChange={set('payment')} style={{ marginTop: 3 }} />
                  <span>
                    <b style={{ display: 'block', fontSize: 15 }}>{p.label}</b>
                    <span className="ff-muted" style={{ fontSize: 13 }}>{p.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            {form.payment === 'Card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
                {field('cardNumber', 'Card number', { inputMode: 'numeric', placeholder: '4242 4242 4242 4242', autoComplete: 'cc-number' })}
                <div className="ff-grid ff-g2">
                  {field('cardExpiry', 'Expiry', { placeholder: 'MM/YY', autoComplete: 'cc-exp' })}
                  {field('cardCvc', 'CVC', { inputMode: 'numeric', placeholder: '123', autoComplete: 'cc-csc' })}
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="ff-panel" style={{ padding: 24, position: 'sticky', top: 150,
          display: 'flex', flexDirection: 'column', gap: 14, alignSelf: 'start' }}>
          <h2 style={{ fontSize: 20 }}>Your order</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.items.map((l) => (
              <li key={l.id} style={{ display: 'grid', gridTemplateColumns: '46px minmax(0,1fr) auto', gap: 12, alignItems: 'center' }}>
                <span className="ff-line-art" style={{ width: 46, height: 46, padding: 5 }}>
                  <ProductArt artKey={l.art} />
                </span>
                <span style={{ fontSize: 13, minWidth: 0 }}>
                  <b style={{ display: 'block', fontWeight: 600 }}>{l.name}</b>
                  <span className="ff-muted">Qty {l.qty}</span>
                </span>
                <b className="ff-tnum" style={{ fontSize: 14 }}>{rs(l.price * l.qty)}</b>
              </li>
            ))}
          </ul>

          <div style={{ borderTop: '1px solid var(--ff-gray-200)', paddingTop: 8 }}>
            <div className="ff-sumrow"><span>Subtotal</span><b className="ff-tnum">{rs(totals.subtotal)}</b></div>
            {totals.couponDiscount > 0 && (
              <div className="ff-sumrow" style={{ color: 'var(--ff-success-700)' }}>
                <span>Coupon {cart.coupon.code}</span><b className="ff-tnum">− {rs(totals.couponDiscount)}</b>
              </div>
            )}
            <div className="ff-sumrow"><span>Delivery</span><b className="ff-tnum">{totals.delivery === 0 ? 'Free' : rs(totals.delivery)}</b></div>
            <div className="ff-sumrow is-total"><span>Total</span><b className="ff-tnum">{rs(totals.total)}</b></div>
          </div>

          <CouponInput />

          <button className="ff-btn ff-btn-primary ff-btn-lg ff-btn-block" type="submit" disabled={placing}>
            {placing ? 'Placing order…' : `Place order · ${rs(totals.total)}`}
          </button>
          <p className="ff-muted" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, justifyContent: 'center' }}>
            <Icon name="shield" size={15} stroke="var(--ff-success-500)" /> Secure simulated checkout
          </p>
        </aside>
      </form>
    </div>
  );
}
