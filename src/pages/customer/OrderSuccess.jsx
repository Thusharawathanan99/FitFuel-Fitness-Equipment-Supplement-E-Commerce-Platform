import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import ErrorState from '../../components/common/ErrorState';
import OrderSteps from '../../components/order/OrderSteps';
import ProductArt from '../../components/product/ProductArt';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { orderService } from '../../services';
import { formatDate, rs } from '../../utils/format';

export default function OrderSuccess() {
  useDocumentTitle('Order confirmed');
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    orderService.getOrderById(id)
      .then((o) => { if (alive) setOrder(o); })
      .catch((e) => { if (alive) setError(e.message); });
    return () => { alive = false; };
  }, [id]);

  if (error)
    return <div className="ff-wrap ff-sec"><ErrorState title="Order not found" message={error} /></div>;

  if (!order)
    return <div className="ff-wrap ff-sec"><div className="ff-skel" style={{ height: 360 }} /></div>;

  return (
    <div className="ff-wrap ff-sec">
      <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 40px' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 74, height: 74, borderRadius: '50%',
          background: 'var(--ff-success-100)', margin: '0 auto 20px' }}>
          <Icon name="check" size={36} stroke="var(--ff-success-700)" strokeWidth={2.6} />
        </span>
        <h1 style={{ fontSize: 34, marginBottom: 10 }}>Thank you — your order is confirmed</h1>
        <p className="ff-muted" style={{ fontSize: 16 }}>
          We have emailed a receipt to {order.email}. Your order reference is{' '}
          <b style={{ color: 'var(--ff-gray-900)' }}>{order.id}</b>.
        </p>
      </div>

      <div className="ff-panel" style={{ padding: 28, maxWidth: 820, margin: '0 auto' }}>
        <OrderSteps stage={order.stage} />

        <div className="ff-grid ff-g3" style={{ gap: 20, paddingBottom: 22, borderBottom: '1px solid var(--ff-gray-200)' }}>
          {[
            ['Order placed', formatDate(order.placedAt)],
            ['Estimated delivery', formatDate(order.eta)],
            ['Payment method', order.payment]
          ].map(([label, value]) => (
            <div key={label}>
              <span className="ff-muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
              <b style={{ display: 'block', fontSize: 15, marginTop: 5 }}>{value}</b>
            </div>
          ))}
        </div>

        <ul style={{ listStyle: 'none', margin: 0, padding: '18px 0 0' }}>
          {order.items.map((l) => (
            <li key={l.id} style={{ display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) auto',
              gap: 14, alignItems: 'center', padding: '10px 0' }}>
              <span className="ff-line-art" style={{ width: 56, height: 56, padding: 6 }}>
                <ProductArt artKey={l.art} />
              </span>
              <span>
                <Link to={`/product/${l.id}`} style={{ fontWeight: 600, color: 'var(--ff-gray-900)' }}>{l.name}</Link>
                <span className="ff-muted" style={{ display: 'block', fontSize: 13 }}>Qty {l.qty}</span>
              </span>
              <b className="ff-tnum">{rs(l.price * l.qty)}</b>
            </li>
          ))}
        </ul>

        <div style={{ borderTop: '1px solid var(--ff-gray-200)', marginTop: 14, paddingTop: 6 }}>
          <div className="ff-sumrow"><span>Subtotal</span><b className="ff-tnum">{rs(order.subtotal)}</b></div>
          {order.discount > 0 && (
            <div className="ff-sumrow" style={{ color: 'var(--ff-success-700)' }}>
              <span>Discount{order.coupon ? ` (${order.coupon})` : ''}</span>
              <b className="ff-tnum">− {rs(order.discount)}</b>
            </div>
          )}
          <div className="ff-sumrow"><span>Delivery</span><b className="ff-tnum">{order.delivery === 0 ? 'Free' : rs(order.delivery)}</b></div>
          <div className="ff-sumrow is-total"><span>Total paid</span><b className="ff-tnum">{rs(order.total)}</b></div>
        </div>

        {order.points > 0 && (
          <p style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, padding: '12px 16px',
            background: 'var(--ff-brand-50)', borderRadius: 'var(--ff-r-sm)', color: 'var(--ff-brand-700)', fontSize: 14 }}>
            <Icon name="gift" size={18} stroke="var(--ff-brand-600)" />
            {order.points} loyalty points have been added to your account.
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 26 }}>
          <Link className="ff-btn ff-btn-primary" to={`/orders/${order.id}`}>Track this order</Link>
          <Link className="ff-btn ff-btn-outline" to="/shop">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
