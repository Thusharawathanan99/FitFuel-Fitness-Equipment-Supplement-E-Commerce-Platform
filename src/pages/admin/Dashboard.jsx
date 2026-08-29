import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import ChartCard, { BarChart, BarList } from '../../components/admin/ChartCard';
import StatusBadge from '../../components/common/StatusBadge';
import Icon from '../../components/common/Icon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { authService, orderService, productService } from '../../services';
import { formatDate, rs } from '../../utils/format';

/* Twelve weeks of revenue, derived from the seeded orders plus a stable baseline. */
const weeklySeries = (orders) => {
  const weeks = Array.from({ length: 12 }, (_, i) => ({
    label: `W${i + 1}`,
    value: 180000 + ((i * 37) % 11) * 21000
  }));
  orders.forEach((o, i) => { weeks[11 - (i % 12)].value += o.total; });
  return weeks;
};

export default function Dashboard() {
  useDocumentTitle('Admin dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([productService.getProducts(), orderService.getOrders(), authService.listCustomers()])
      .then(([p, o, c]) => {
        if (!alive) return;
        setProducts(p); setOrders(o); setCustomers(c);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const units = orders.reduce((s, o) => s + o.items.reduce((n, l) => n + l.qty, 0), 0);
    const open = orders.filter((o) => o.stage < 5).length;
    const lowStock = products.filter((p) => p.stock <= 20).length;
    return { revenue, units, open, lowStock, aov: orders.length ? Math.round(revenue / orders.length) : 0 };
  }, [orders, products]);

  const topCategories = useMemo(() => {
    const totals = {};
    orders.forEach((o) => o.items.forEach((l) => {
      const p = products.find((x) => x.id === l.id);
      if (p) totals[p.category] = (totals[p.category] || 0) + l.price * l.qty;
    }));
    return Object.entries(totals)
      .map(([label, value]) => ({ label: label[0].toUpperCase() + label.slice(1), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders, products]);

  if (loading) return <div className="ff-skel" style={{ height: 420 }} />;

  return (
    <>
      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 28 }}>Dashboard</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            Store performance across {orders.length} orders and {products.length} live products.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="ff-btn ff-btn-outline ff-btn-sm" to="/admin/analytics">Full analytics</Link>
          <Link className="ff-btn ff-btn-primary ff-btn-sm" to="/admin/products/new">
            <Icon name="plus" size={16} stroke="#fff" /> Add product
          </Link>
        </div>
      </div>

      <div className="ff-grid ff-g4" style={{ marginBottom: 24 }}>
        <StatCard label="Revenue" value={rs(stats.revenue)} delta="+12.4%" hint="vs last quarter" icon="chart" />
        <StatCard label="Orders" value={orders.length} delta={`${stats.open} open`} tone="flat" icon="truck" />
        <StatCard label="Average order" value={rs(stats.aov)} delta="+4.1%" hint="vs last quarter" icon="card" />
        <StatCard label="Customers" value={customers.length} delta="+3 this month" icon="users" />
      </div>

      <div className="ff-grid ff-g2" style={{ marginBottom: 24, alignItems: 'start' }}>
        <ChartCard title="Revenue by week" subtitle="Last twelve weeks, all channels">
          <BarChart data={weeklySeries(orders)} valueFormat={(v) => rs(v)} />
        </ChartCard>
        <ChartCard title="Top categories" subtitle="Revenue share from placed orders">
          {topCategories.length ? (
            <BarList data={topCategories} valueFormat={(v) => rs(v)} />
          ) : (
            <p className="ff-muted">No orders have been placed yet.</p>
          )}
        </ChartCard>
      </div>

      <div className="ff-grid ff-g2" style={{ alignItems: 'start' }}>
        <section className="ff-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 12, padding: 20 }}>
            <h3 style={{ fontSize: 19 }}>Recent orders</h3>
            <Link className="ff-btn ff-btn-outline ff-btn-sm" to="/admin/orders">View all</Link>
          </header>
          <div className="ff-table-wrap" style={{ border: 0, borderRadius: 0, boxShadow: 'none' }}>
            <table className="ff-table">
              <thead>
                <tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Status</th><th scope="col">Total</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <b>{o.id}</b>
                      <span className="ff-muted" style={{ display: 'block', fontSize: 12 }}>{formatDate(o.placedAt)}</span>
                    </td>
                    <td>{o.customer}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="ff-tnum"><b>{rs(o.total)}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ff-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 12, padding: 20 }}>
            <h3 style={{ fontSize: 19 }}>Low stock — {stats.lowStock} items</h3>
            <Link className="ff-btn ff-btn-outline ff-btn-sm" to="/admin/inventory">Manage inventory</Link>
          </header>
          <div className="ff-table-wrap" style={{ border: 0, borderRadius: 0, boxShadow: 'none' }}>
            <table className="ff-table">
              <thead>
                <tr><th scope="col">Product</th><th scope="col">SKU</th><th scope="col">Stock</th></tr>
              </thead>
              <tbody>
                {products.filter((p) => p.stock <= 20).sort((a, b) => a.stock - b.stock).slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td><Link to={`/admin/products/${p.id}/edit`}>{p.name}</Link></td>
                    <td className="ff-muted">{p.sku}</td>
                    <td>
                      <StatusBadge status={p.stock === 0 ? 'Out of stock' : p.stock <= 10 ? 'Low stock' : 'In stock'} />
                      <b className="ff-tnum" style={{ marginLeft: 8 }}>{p.stock}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
