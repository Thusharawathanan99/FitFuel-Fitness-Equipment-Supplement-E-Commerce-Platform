import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { productService } from '../../services';
import { rs } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const levelOf = (stock) => (stock === 0 ? 'Out of stock' : stock <= 10 ? 'Low stock' : 'In stock');

export default function AdminInventory() {
  useDocumentTitle('Admin · Inventory');
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [drafts, setDrafts] = useState({});

  const load = () => {
    setLoading(true);
    productService.getProducts({ sort: 'low' }).then(setProducts).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const stats = useMemo(() => {
    const units = products.reduce((s, p) => s + p.stock, 0);
    const value = products.reduce((s, p) => s + p.discountPrice * p.stock, 0);
    return {
      units, value,
      low: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
      out: products.filter((p) => p.stock === 0).length
    };
  }, [products]);

  const rows = useMemo(
    () =>
      products
        .filter((p) => {
          if (filter === 'low') return p.stock > 0 && p.stock <= 10;
          if (filter === 'out') return p.stock === 0;
          if (filter === 'reorder') return p.stock <= 20;
          return true;
        })
        .filter((p) => (search ? `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase()) : true))
        .sort((a, b) => a.stock - b.stock),
    [products, filter, search]
  );

  const save = async (product) => {
    const value = Number(drafts[product.id]);
    if (!(value >= 0)) {
      toast.error('Stock must be zero or more');
      return;
    }
    await productService.updateProduct(product.id, { stock: value });
    toast.success(`${product.name} set to ${value} units`);
    setDrafts((d) => { const next = { ...d }; delete next[product.id]; return next; });
    load();
  };

  const restockAll = async () => {
    const targets = products.filter((p) => p.stock <= 10);
    await Promise.all(targets.map((p) => productService.updateProduct(p.id, { stock: p.stock + 50 })));
    toast.success(`Restocked ${targets.length} products by 50 units each`);
    load();
  };

  return (
    <>
      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 28 }}>Inventory</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>Adjust stock levels without leaving this page.</p>
        </div>
        <button type="button" className="ff-btn ff-btn-primary ff-btn-sm" onClick={restockAll} disabled={!stats.low && !stats.out}>
          <Icon name="plus" size={16} stroke="#fff" /> Restock low items
        </button>
      </div>

      <div className="ff-grid ff-g4" style={{ marginBottom: 22 }}>
        <StatCard label="Units on hand" value={stats.units.toLocaleString('en-IN')} icon="layers" />
        <StatCard label="Stock value" value={rs(stats.value)} icon="card" />
        <StatCard label="Low stock" value={stats.low} tone="down" hint="10 units or fewer" icon="alert" />
        <StatCard label="Out of stock" value={stats.out} tone="down" hint="needs reordering" icon="box" />
      </div>

      <div className="ff-panel" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input className="ff-input" style={{ flex: 1, minWidth: 220 }} value={search}
          onChange={(e) => setSearch(e.target.value)} placeholder="Search name or SKU" aria-label="Search inventory" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['all', 'All'], ['reorder', 'Reorder soon'], ['low', 'Low stock'], ['out', 'Out of stock']].map(([id, label]) => (
            <button key={id} type="button" className={`ff-chip${filter === id ? ' is-on' : ''}`}
              aria-pressed={filter === id} onClick={() => setFilter(id)}
              style={filter === id ? { background: 'var(--ff-brand-500)', color: '#fff', borderColor: 'var(--ff-brand-500)' } : undefined}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="ff-skel" style={{ height: 340 }} />
      ) : !rows.length ? (
        <EmptyState icon="check" title="Nothing needs attention" message="Every product in this view is well stocked." />
      ) : (
        <div className="ff-table-wrap">
          <table className="ff-table">
            <caption className="ff-sr">Stock levels</caption>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">SKU</th>
                <th scope="col">Status</th>
                <th scope="col">On hand</th>
                <th scope="col">Set stock</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/products/${p.id}/edit`} style={{ fontWeight: 600 }}>{p.name}</Link>
                    <span className="ff-muted" style={{ display: 'block', fontSize: 12 }}>{p.brand}</span>
                  </td>
                  <td className="ff-muted">{p.sku}</td>
                  <td><StatusBadge status={levelOf(p.stock)} /></td>
                  <td className="ff-tnum"><b>{p.stock}</b></td>
                  <td>
                    <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        className="ff-input" style={{ width: 92, height: 38 }} inputMode="numeric"
                        aria-label={`Set stock for ${p.name}`}
                        value={drafts[p.id] ?? p.stock}
                        onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                      />
                      <button type="button" className="ff-btn ff-btn-outline ff-btn-sm"
                        disabled={drafts[p.id] === undefined || String(drafts[p.id]) === String(p.stock)}
                        onClick={() => save(p)}>
                        Save
                      </button>
                    </span>
                  </td>
                  <td className="ff-tnum">{rs(p.discountPrice * p.stock)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
