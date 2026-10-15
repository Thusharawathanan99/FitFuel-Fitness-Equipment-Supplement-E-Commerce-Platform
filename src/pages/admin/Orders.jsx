import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import OrderSteps from '../../components/order/OrderSteps';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { ORDER_STAGES, orderService } from '../../services';
import { formatDate, rs } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

export default function AdminOrders() {
  useDocumentTitle('Admin · Orders');
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);

  const load = () => {
    setLoading(true);
    orderService.getAllOrders().then(setOrders).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    return {
      revenue,
      open: orders.filter((o) => o.stage < 5).length,
      delivered: orders.filter((o) => o.stage === 5).length,
      aov: orders.length ? Math.round(revenue / orders.length) : 0
    };
  }, [orders]);

  const rows = useMemo(
    () =>
      orders
        .filter((o) => (status ? o.status === status : true))
        .filter((o) => (search ? `${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(search.toLowerCase()) : true)),
    [orders, status, search]
  );

  const advance = async (order, stage) => {
    const updated = await orderService.updateOrderStatus(order.id, stage);
    toast.success(`${order.id} marked ${ORDER_STAGES[stage]}`);
    setOpen((o) => (o && o.id === order.id ? updated : o));
    load();
  };

  return (
    <>
      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 28 }}>Orders</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>{orders.length} orders placed on the store.</p>
        </div>
      </div>

      <div className="ff-grid ff-g4" style={{ marginBottom: 22 }}>
        <StatCard label="Revenue" value={rs(stats.revenue)} icon="chart" />
        <StatCard label="Open orders" value={stats.open} hint="not yet delivered" icon="truck" />
        <StatCard label="Delivered" value={stats.delivered} icon="check" />
        <StatCard label="Average order" value={rs(stats.aov)} icon="card" />
      </div>

      <div className="ff-panel" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input className="ff-input" style={{ flex: 1, minWidth: 220 }} value={search}
          onChange={(e) => setSearch(e.target.value)} placeholder="Search order, customer or email"
          aria-label="Search orders" />
        <select className="ff-input" style={{ width: 'auto' }} value={status}
          onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {ORDER_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="ff-skel" style={{ height: 320 }} />
      ) : !rows.length ? (
        <EmptyState icon="truck" title="No orders match those filters"
          message="Try a different status or clear the search." />
      ) : (
        <div className="ff-table-wrap">
          <table className="ff-table">
            <caption className="ff-sr">Store orders</caption>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Customer</th>
                <th scope="col">Items</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col">Update</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td>
                    <button type="button" className="ff-btn-ghost" style={{ fontWeight: 700, textDecoration: 'underline' }}
                      onClick={() => setOpen(o)}>{o.id}</button>
                    <span className="ff-muted" style={{ display: 'block', fontSize: 12 }}>{formatDate(o.placedAt)}</span>
                  </td>
                  <td>
                    {o.customer}
                    <span className="ff-muted" style={{ display: 'block', fontSize: 12 }}>{o.email}</span>
                  </td>
                  <td className="ff-tnum">{o.items.reduce((s, l) => s + l.qty, 0)}</td>
                  <td className="ff-tnum"><b>{rs(o.total)}</b></td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <select className="ff-input" style={{ width: 'auto', height: 38, fontSize: 13 }}
                      value={o.stage} onChange={(e) => advance(o, Number(e.target.value))}
                      aria-label={`Update status for ${o.id}`}>
                      {ORDER_STAGES.map((s, i) => <option key={s} value={i}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!open} title={`Order ${open?.id || ''}`} onClose={() => setOpen(null)} width={680}>
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <OrderSteps stage={open.stage} />
            <div className="ff-grid ff-g2" style={{ gap: 18 }}>
              <div>
                <h4 style={{ fontSize: 14, marginBottom: 6 }}>Customer</h4>
                <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                  {open.customer}<br />
                  <span className="ff-muted">{open.email}</span><br />
                  {open.phone}
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, marginBottom: 6 }}>Delivery address</h4>
                <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                  {open.address?.line1}<br />{open.address?.city} {open.address?.zip}
                </p>
              </div>
            </div>
            <div className="ff-table-wrap">
              <table className="ff-table">
                <thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Line total</th></tr></thead>
                <tbody>
                  {open.items.map((l) => (
                    <tr key={l.id}>
                      <td>{l.name}</td>
                      <td className="ff-tnum">{l.qty}</td>
                      <td className="ff-tnum">{rs(l.price * l.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="ff-sumrow"><span>Subtotal</span><b className="ff-tnum">{rs(open.subtotal)}</b></div>
              {open.discount > 0 && (
                <div className="ff-sumrow" style={{ color: 'var(--ff-success-700)' }}>
                  <span>Discount{open.coupon ? ` (${open.coupon})` : ''}</span>
                  <b className="ff-tnum">− {rs(open.discount)}</b>
                </div>
              )}
              <div className="ff-sumrow"><span>Delivery</span><b className="ff-tnum">{open.delivery === 0 ? 'Free' : rs(open.delivery)}</b></div>
              <div className="ff-sumrow is-total"><span>Total</span><b className="ff-tnum">{rs(open.total)}</b></div>
            </div>
            {open.notes && (
              <p className="ff-muted" style={{ fontSize: 13 }}><b>Delivery notes:</b> {open.notes}</p>
            )}
            {open.stage < 5 && (
              <button type="button" className="ff-btn ff-btn-primary"
                onClick={() => advance(open, open.stage + 1)}>
                Advance to {ORDER_STAGES[open.stage + 1]}
              </button>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
