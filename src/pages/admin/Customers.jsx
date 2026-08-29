import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { authService, orderService } from '../../services';
import { formatDate, rs } from '../../utils/format';

const TIER = (points) => (points >= 5000 ? 'Platinum' : points >= 2500 ? 'Gold' : points >= 1000 ? 'Silver' : 'Bronze');

export default function AdminCustomers() {
  useDocumentTitle('Admin · Customers');
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);

  useEffect(() => {
    Promise.all([authService.listCustomers(), orderService.getOrders()])
      .then(([c, o]) => { setCustomers(c); setOrders(o); })
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(
    () =>
      customers
        .map((c) => {
          const own = orders.filter((o) => o.userId === c.id || o.email === c.email);
          const spend = own.reduce((s, o) => s + o.total, 0);
          return { ...c, orders: own, orderCount: own.length, spend, tier: TIER(c.points || 0) };
        })
        .filter((c) => (search ? `${c.name} ${c.email}`.toLowerCase().includes(search.toLowerCase()) : true))
        .sort((a, b) => b.spend - a.spend),
    [customers, orders, search]
  );

  const totalSpend = rows.reduce((s, c) => s + c.spend, 0);

  if (loading) return <div className="ff-skel" style={{ height: 360 }} />;

  return (
    <>
      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 28 }}>Customers</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>{customers.length} registered accounts.</p>
        </div>
      </div>

      <div className="ff-grid ff-g4" style={{ marginBottom: 22 }}>
        <StatCard label="Customers" value={customers.length} icon="users" />
        <StatCard label="Lifetime revenue" value={rs(totalSpend)} icon="chart" />
        <StatCard label="Repeat buyers" value={rows.filter((c) => c.orderCount > 1).length} icon="truck" />
        <StatCard label="Points issued"
          value={customers.reduce((s, c) => s + (c.points || 0), 0).toLocaleString('en-IN')} icon="gift" />
      </div>

      <div className="ff-panel" style={{ padding: 16, marginBottom: 20 }}>
        <input className="ff-input" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email" aria-label="Search customers" />
      </div>

      {!rows.length ? (
        <EmptyState icon="users" title="No customers match that search" />
      ) : (
        <div className="ff-table-wrap">
          <table className="ff-table">
            <caption className="ff-sr">Registered customers</caption>
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col">Joined</th>
                <th scope="col">Orders</th>
                <th scope="col">Lifetime spend</th>
                <th scope="col">Points</th>
                <th scope="col">Tier</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <button type="button" className="ff-btn-ghost" style={{ fontWeight: 700, textDecoration: 'underline' }}
                      onClick={() => setOpen(c)}>{c.name}</button>
                    <span className="ff-muted" style={{ display: 'block', fontSize: 12 }}>{c.email}</span>
                  </td>
                  <td>{formatDate(c.joined)}</td>
                  <td className="ff-tnum">{c.orderCount}</td>
                  <td className="ff-tnum"><b>{rs(c.spend)}</b></td>
                  <td className="ff-tnum">{(c.points || 0).toLocaleString('en-IN')}</td>
                  <td><StatusBadge status={c.tier === 'Bronze' ? 'Active' : c.tier} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!open} title={open?.name || ''} onClose={() => setOpen(null)} width={620}>
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="ff-grid ff-g3" style={{ gap: 14 }}>
              {[
                ['Orders', open.orderCount],
                ['Lifetime spend', rs(open.spend)],
                ['Loyalty points', (open.points || 0).toLocaleString('en-IN')]
              ].map(([label, value]) => (
                <div key={label} style={{ padding: 14, background: 'var(--ff-gray-50)', borderRadius: 'var(--ff-r-sm)' }}>
                  <span className="ff-muted" style={{ fontSize: 12 }}>{label}</span>
                  <b className="ff-display ff-tnum" style={{ display: 'block', fontSize: 22 }}>{value}</b>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 14 }}>
              <b>Email:</b> {open.email}<br />
              <b>Joined:</b> {formatDate(open.joined)}<br />
              <b>Tier:</b> {open.tier}
            </p>

            <div>
              <h4 style={{ fontSize: 15, marginBottom: 10 }}>Order history</h4>
              {open.orders.length === 0 ? (
                <p className="ff-muted" style={{ fontSize: 14 }}>This customer has not ordered yet.</p>
              ) : (
                <div className="ff-table-wrap">
                  <table className="ff-table">
                    <thead><tr><th scope="col">Order</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Total</th></tr></thead>
                    <tbody>
                      {open.orders.map((o) => (
                        <tr key={o.id}>
                          <td><b>{o.id}</b></td>
                          <td>{formatDate(o.placedAt)}</td>
                          <td><StatusBadge status={o.status} /></td>
                          <td className="ff-tnum">{rs(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
