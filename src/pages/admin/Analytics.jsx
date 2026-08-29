import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import ChartCard, { BarChart, BarList, LineChart } from '../../components/admin/ChartCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { authService, orderService, productService } from '../../services';
import { GROUPS } from '../../data/categories';
import { rs } from '../../utils/format';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

/* A stable monthly baseline so the report reads like a trading year, with real orders layered on. */
const monthlyRevenue = (orders) => {
  const base = [1420000, 1268000, 1735000, 1610000, 1892000, 2044000, 1968000, 2310000];
  const series = MONTHS.map((label, i) => ({ label, value: base[i] }));
  orders.forEach((o) => {
    const m = new Date(o.placedAt).getMonth();
    if (series[m]) series[m].value += o.total;
  });
  return series;
};

export default function AdminAnalytics() {
  useDocumentTitle('Admin · Analytics');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('8m');

  useEffect(() => {
    Promise.all([productService.getProducts(), orderService.getOrders(), authService.listCustomers()])
      .then(([p, o, c]) => { setProducts(p); setOrders(o); setCustomers(c); })
      .finally(() => setLoading(false));
  }, []);

  const revenue = useMemo(() => monthlyRevenue(orders), [orders]);
  const shown = range === '3m' ? revenue.slice(-3) : range === '6m' ? revenue.slice(-6) : revenue;
  const total = shown.reduce((s, d) => s + d.value, 0);
  const growth = shown.length > 1
    ? Math.round(((shown[shown.length - 1].value - shown[0].value) / shown[0].value) * 100)
    : 0;

  const byGroup = useMemo(() => {
    const totals = { equipment: 0, supplement: 0 };
    products.forEach((p) => { totals[p.group] += p.discountPrice * Math.max(1, p.reviewCount / 100); });
    return Object.entries(totals).map(([k, v]) => ({ label: GROUPS[k].name, value: Math.round(v) }));
  }, [products]);

  const topProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.reviewCount * b.discountPrice - a.reviewCount * a.discountPrice)
        .slice(0, 6)
        .map((p) => ({ label: p.name, value: Math.round((p.reviewCount * p.discountPrice) / 100) })),
    [products]
  );

  const ratings = useMemo(() => {
    const buckets = [
      { label: '3.5–4.0', value: 0 }, { label: '4.0–4.3', value: 0 },
      { label: '4.3–4.6', value: 0 }, { label: '4.6–4.8', value: 0 }, { label: '4.8–5.0', value: 0 }
    ];
    products.forEach((p) => {
      const i = p.rating < 4 ? 0 : p.rating < 4.3 ? 1 : p.rating < 4.6 ? 2 : p.rating < 4.8 ? 3 : 4;
      buckets[i].value += 1;
    });
    return buckets;
  }, [products]);

  const stockOutlook = useMemo(
    () =>
      ['In stock (20+)', 'Reorder (11–20)', 'Low (1–10)', 'Out of stock'].map((label, i) => ({
        label,
        value: products.filter((p) =>
          (i === 0 && p.stock > 20) || (i === 1 && p.stock > 10 && p.stock <= 20) ||
          (i === 2 && p.stock > 0 && p.stock <= 10) || (i === 3 && p.stock === 0)
        ).length
      })),
    [products]
  );

  if (loading) return <div className="ff-skel" style={{ height: 460 }} />;

  return (
    <>
      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 28 }}>Analytics</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            Sales and catalogue reporting for the current trading year.
          </p>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--ff-gray-600)' }}>Range:</span>
          <select className="ff-input" style={{ width: 'auto', height: 42, fontWeight: 600 }}
            value={range} onChange={(e) => setRange(e.target.value)} aria-label="Reporting range">
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="8m">Year to date</option>
          </select>
        </label>
      </div>

      <div className="ff-grid ff-g4" style={{ marginBottom: 24 }}>
        <StatCard label="Revenue" value={rs(total)} delta={`${growth >= 0 ? '+' : ''}${growth}%`}
          tone={growth >= 0 ? 'up' : 'down'} hint="across the range" icon="chart" />
        <StatCard label="Orders" value={orders.length} hint="all time" icon="truck" />
        <StatCard label="Products live" value={products.length} icon="box" />
        <StatCard label="Customers" value={customers.length} icon="users" />
      </div>

      <div style={{ display: 'grid', gap: 24, marginBottom: 24 }}>
        <ChartCard title="Revenue trend" subtitle={`Monthly revenue · ${shown.length} months`}>
          <LineChart data={shown} height={260} valueFormat={(v) => rs(v)} />
        </ChartCard>
      </div>

      <div className="ff-grid ff-g2" style={{ marginBottom: 24, alignItems: 'start' }}>
        <ChartCard title="Rating distribution" subtitle="How the catalogue scores with shoppers">
          <BarChart data={ratings} valueFormat={(v) => `${v} products`} />
        </ChartCard>
        <ChartCard title="Stock outlook" subtitle="Products by stock band">
          <BarChart data={stockOutlook} valueFormat={(v) => `${v} products`} />
        </ChartCard>
      </div>

      <div className="ff-grid ff-g2" style={{ alignItems: 'start' }}>
        <ChartCard title="Best performing products" subtitle="Weighted by price and review volume">
          <BarList data={topProducts} valueFormat={(v) => rs(v)} />
        </ChartCard>
        <ChartCard title="Revenue by group" subtitle="Equipment against supplements">
          <BarList data={byGroup} valueFormat={(v) => rs(v)} />
        </ChartCard>
      </div>
    </>
  );
}
