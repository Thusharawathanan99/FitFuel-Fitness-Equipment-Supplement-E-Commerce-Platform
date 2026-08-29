import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import QuantitySelector from '../../components/common/QuantitySelector';
import OrderSteps from '../../components/order/OrderSteps';
import CouponInput from '../../components/checkout/CouponInput';
import ProductArt from '../../components/product/ProductArt';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { rs } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function Cart() {
  useDocumentTitle('Your cart');
  const cart = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const { totals } = cart;

  if (!cart.items.length)
    return (
      <div className="ff-wrap ff-sec">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          message="Once you add equipment or supplements they will show up here."
          action={<Link className="ff-btn ff-btn-primary ff-btn-lg" to="/shop">Start shopping</Link>}
        />
      </div>
    );

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <h1 style={{ fontSize: 34, marginBottom: 4 }}>Your cart</h1>
      <p className="ff-muted" style={{ marginBottom: 18 }}>
        {cart.count} item{cart.count === 1 ? '' : 's'} ready to check out
      </p>
      <OrderSteps stage={0} compact />

      <div className="ff-layout" style={{ gridTemplateColumns: 'minmax(0, 1fr) 360px' }}>
        <div>
          {totals.freeDeliveryGap > 0 && (
            <p style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ff-brand-50)',
              border: '1px solid var(--ff-brand-100)', color: 'var(--ff-brand-700)',
              padding: '12px 16px', borderRadius: 'var(--ff-r-sm)', fontSize: 14, marginBottom: 8 }}>
              <Icon name="truck" size={18} stroke="var(--ff-brand-600)" />
              Add {rs(totals.freeDeliveryGap)} more to unlock free island-wide delivery.
            </p>
          )}

          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {cart.items.map((line) => (
              <li key={line.id} className="ff-line">
                <Link to={`/product/${line.id}`} className="ff-line-art" aria-label={line.name}>
                  <ProductArt artKey={line.art} />
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                  <span className="ff-eyebrow" style={{ fontSize: 12 }}>{line.brand}</span>
                  <Link to={`/product/${line.id}`} style={{ fontWeight: 600, fontSize: 16, color: 'var(--ff-gray-900)' }}>
                    {line.name}
                  </Link>
                  <span className="ff-tnum ff-muted" style={{ fontSize: 14 }}>
                    {rs(line.price)} each
                    {line.listPrice > line.price && <span className="ff-strike" style={{ marginLeft: 8 }}>{rs(line.listPrice)}</span>}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 4 }}>
                    <QuantitySelector value={line.qty} onChange={(q) => cart.setQty(line.id, q)} />
                    <button
                      type="button" className="ff-btn-ghost"
                      style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--ff-error-700)' }}
                      onClick={() => { cart.remove(line.id); toast.info(`${line.name} removed from cart`); }}
                    >
                      <Icon name="trash" size={16} stroke="var(--ff-error-700)" /> Remove
                    </button>
                  </div>
                </div>
                <b className="ff-display ff-tnum" style={{ fontSize: 22, whiteSpace: 'nowrap' }}>
                  {rs(line.price * line.qty)}
                </b>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', paddingTop: 22 }}>
            <Link className="ff-btn ff-btn-outline" to="/shop">
              <Icon name="chevronLeft" size={17} /> Continue shopping
            </Link>
            <button type="button" className="ff-btn ff-btn-ghost" style={{ color: 'var(--ff-gray-600)' }}
              onClick={() => { cart.clear(); toast.info('Cart cleared'); }}>
              Clear cart
            </button>
          </div>
        </div>

        <aside className="ff-panel" style={{ padding: 24, position: 'sticky', top: 150,
          display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontSize: 20 }}>Order summary</h2>

          <div>
            <div className="ff-sumrow"><span>Subtotal ({cart.count} items)</span><b className="ff-tnum">{rs(totals.subtotal)}</b></div>
            {totals.productSaving > 0 && (
              <div className="ff-sumrow" style={{ color: 'var(--ff-success-700)' }}>
                <span>Product savings</span><b className="ff-tnum">− {rs(totals.productSaving)}</b>
              </div>
            )}
            {totals.couponDiscount > 0 && (
              <div className="ff-sumrow" style={{ color: 'var(--ff-success-700)' }}>
                <span>Coupon {cart.coupon.code}</span><b className="ff-tnum">− {rs(totals.couponDiscount)}</b>
              </div>
            )}
            <div className="ff-sumrow">
              <span>Delivery</span>
              <b className="ff-tnum">{totals.delivery === 0 ? 'Free' : rs(totals.delivery)}</b>
            </div>
            <div className="ff-sumrow is-total"><span>Total</span><b className="ff-tnum">{rs(totals.total)}</b></div>
          </div>

          <CouponInput />

          <p style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--ff-brand-700)' }}>
            <Icon name="gift" size={17} stroke="var(--ff-brand-500)" />
            You will earn {totals.pointsEarned} loyalty points on this order.
          </p>

          <button className="ff-btn ff-btn-primary ff-btn-lg ff-btn-block" onClick={() => navigate('/checkout')}>
            Proceed to checkout <Icon name="arrowRight" size={18} stroke="#fff" />
          </button>
          <p className="ff-muted" style={{ fontSize: 12, textAlign: 'center' }}>
            Taxes calculated at checkout. Prices in Sri Lankan rupees.
          </p>
        </aside>
      </div>
    </div>
  );
}
