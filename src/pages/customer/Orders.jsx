import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ProductArt from '../../components/product/ProductArt';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { orderService } from '../../services';
import { formatDate, rs } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

export default function Orders() {
  useDocumentTitle('My orders');
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    orderService.getOrders(user?.id)
      .then((list) => { if (alive) setOrders(list); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user?.id]);

  return (
    <div className="ff-wrap ff-sec">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My orders' }]} />
      <h1 style={{ fontSize: 34, marginBottom: 24 }}>My orders</h1>

      {loading && <div className="ff-skel" style={{ height: 200 }} />}

      {!loading && !orders.length && (
        <EmptyState
          icon="box" title="No orders yet"
          message="When you place an order it will appear here with live tracking."
          action={<Link className="ff-btn ff-btn-primary" to="/shop">Start shopping</Link>}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {orders.map((o) => (
          <article key={o.id} className="ff-panel" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
              paddingBottom: 16, borderBottom: '1px solid var(--ff-gray-200)' }}>
              <div>
                <b className="ff-display" style={{ fontSize: 19 }}>{o.id}</b>
                <span className="ff-muted" style={{ display: 'block', fontSize: 13, marginTop: 3 }}>
                  Placed {formatDate(o.placedAt)} · {o.items.length} item{o.items.length === 1 ? '' : 's'} · {o.payment}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <StatusBadge status={o.status} />
                <b className="ff-tnum ff-display" style={{ fontSize: 20 }}>{rs(o.total)}</b>
                <Link className="ff-btn ff-btn-outline ff-btn-sm" to={`/orders/${o.id}`}>Track order</Link>
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', gap: 18, margin: 0, padding: '16px 0 0', flexWrap: 'wrap' }}>
              {o.items.map((l) => (
                <li key={l.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span className="ff-line-art" style={{ width: 54, height: 54, padding: 6 }}>
                    <ProductArt artKey={l.art} />
                  </span>
                  <span style={{ fontSize: 13 }}>
                    <Link to={`/product/${l.id}`} style={{ fontWeight: 600, color: 'var(--ff-gray-900)' }}>{l.name}</Link>
                    <span className="ff-muted" style={{ display: 'block' }}>Qty {l.qty} · {rs(l.price)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
