import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ErrorState from '../../components/common/ErrorState';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import OrderSteps from '../../components/order/OrderSteps';
import ProductArt from '../../components/product/ProductArt';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { ORDER_STAGES, orderService } from '../../services';
import { formatDate, rs } from '../../utils/format';

export default function OrderDetail() {
  const { id } = useParams();
  useDocumentTitle(`Order ${id}`);
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
    return (
      <div className="ff-wrap ff-sec">
        <ErrorState title="Order not found" message={error} />
      </div>
    );

  if (!order)
    return <div className="ff-wrap ff-sec"><div className="ff-skel" style={{ height: 340 }} /></div>;

  const placed = new Date(order.placedAt);
  const timeline = ORDER_STAGES.map((label, i) => ({
    label,
    done: i <= order.stage,
    at: i <= order.stage ? new Date(placed.getTime() + i * 18 * 3600 * 1000) : null
  }));

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My orders', to: '/orders' }, { label: order.id }]} />

      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 32 }}>Order {order.id}</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            Placed {formatDate(order.placedAt)} · Estimated delivery {formatDate(order.eta)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <OrderSteps stage={order.stage} />

      <div className="ff-layout" style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <section className="ff-panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 14 }}>Tracking history</h2>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {timeline.map((t) => (
                <li key={t.label} style={{ display: 'grid', gridTemplateColumns: '26px minmax(0,1fr)',
                  gap: 14, paddingBottom: 18 }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, borderRadius: '50%',
                    background: t.done ? 'var(--ff-brand-500)' : 'var(--ff-gray-100)' }}>
                    <Icon name={t.done ? 'check' : 'clock'} size={14}
                      stroke={t.done ? '#fff' : 'var(--ff-gray-400)'} strokeWidth={2.6} />
                  </span>
                  <span>
                    <b style={{ fontSize: 15, color: t.done ? 'var(--ff-gray-900)' : 'var(--ff-gray-500)' }}>{t.label}</b>
                    <span className="ff-muted" style={{ display: 'block', fontSize: 13 }}>
                      {t.at ? formatDate(t.at.toISOString()) : 'Pending'}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="ff-panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 6 }}>Items in this order</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {order.items.map((l) => (
                <li key={l.id} className="ff-line" style={{ gridTemplateColumns: '72px minmax(0,1fr) auto' }}>
                  <span className="ff-line-art" style={{ width: 72, height: 72 }}>
                    <ProductArt artKey={l.art} />
                  </span>
                  <span>
                    <Link to={`/product/${l.id}`} style={{ fontWeight: 600, fontSize: 15, color: 'var(--ff-gray-900)' }}>
                      {l.name}
                    </Link>
                    <span className="ff-muted" style={{ display: 'block', fontSize: 13, marginTop: 4 }}>
                      Qty {l.qty} · {rs(l.price)} each
                    </span>
                  </span>
                  <b className="ff-tnum">{rs(l.price * l.qty)}</b>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section className="ff-panel" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>Payment summary</h2>
            <div className="ff-sumrow"><span>Subtotal</span><b className="ff-tnum">{rs(order.subtotal)}</b></div>
            {order.discount > 0 && (
              <div className="ff-sumrow" style={{ color: 'var(--ff-success-700)' }}>
                <span>Discount{order.coupon ? ` (${order.coupon})` : ''}</span>
                <b className="ff-tnum">− {rs(order.discount)}</b>
              </div>
            )}
            <div className="ff-sumrow"><span>Delivery</span><b className="ff-tnum">{order.delivery === 0 ? 'Free' : rs(order.delivery)}</b></div>
            <div className="ff-sumrow is-total"><span>Total</span><b className="ff-tnum">{rs(order.total)}</b></div>
            <p className="ff-muted" style={{ fontSize: 13, marginTop: 12 }}>Paid by {order.payment}</p>
          </section>

          <section className="ff-panel" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>Delivery address</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>
              <b>{order.customer}</b><br />
              {order.address?.line1}<br />
              {order.address?.city} {order.address?.zip}<br />
              {order.phone && <>{order.phone}<br /></>}
              <span className="ff-muted">{order.email}</span>
            </p>
          </section>

          <Link className="ff-btn ff-btn-outline ff-btn-block" to="/orders">
            <Icon name="chevronLeft" size={17} /> Back to my orders
          </Link>
        </aside>
      </div>
    </div>
  );
}
