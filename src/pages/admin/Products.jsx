import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ProductArt from '../../components/product/ProductArt';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { productService } from '../../services';
import { CATEGORIES } from '../../data/categories';
import { discountPct, rs } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

export default function AdminProducts() {
  useDocumentTitle('Admin · Products');
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('');
  const [category, setCategory] = useState('');
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    productService.getProducts().then(setProducts).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const rows = useMemo(
    () =>
      products.filter((p) => {
        if (group && p.group !== group) return false;
        if (category && p.category !== category) return false;
        if (search) {
          const t = search.toLowerCase();
          return `${p.name} ${p.brand} ${p.sku}`.toLowerCase().includes(t);
        }
        return true;
      }),
    [products, search, group, category]
  );

  const remove = async () => {
    await productService.deleteProduct(confirm.id);
    toast.success(`${confirm.name} removed from the catalogue`);
    setConfirm(null);
    load();
  };

  const reset = async () => {
    await productService.resetCatalogue();
    toast.info('Catalogue reset to the seed data');
    load();
  };

  return (
    <>
      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 28 }}>Products</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>{products.length} products in the catalogue</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="ff-btn ff-btn-outline ff-btn-sm" onClick={reset}>Reset catalogue</button>
          <Link className="ff-btn ff-btn-primary ff-btn-sm" to="/admin/products/new">
            <Icon name="plus" size={16} stroke="#fff" /> Add product
          </Link>
        </div>
      </div>

      <div className="ff-panel" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input className="ff-input" style={{ flex: 1, minWidth: 220 }} value={search}
          onChange={(e) => setSearch(e.target.value)} placeholder="Search name, brand or SKU"
          aria-label="Search products" />
        <select className="ff-input" style={{ width: 'auto' }} value={group}
          onChange={(e) => { setGroup(e.target.value); setCategory(''); }} aria-label="Filter by group">
          <option value="">All groups</option>
          <option value="equipment">Fitness Equipment</option>
          <option value="supplement">Supplements</option>
        </select>
        <select className="ff-input" style={{ width: 'auto' }} value={category}
          onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {CATEGORIES.filter((c) => !group || c.group === group).map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="ff-skel" style={{ height: 340 }} />
      ) : !rows.length ? (
        <EmptyState icon="box" title="No products match those filters"
          message="Try clearing the search or picking a different category." />
      ) : (
        <div className="ff-table-wrap">
          <table className="ff-table">
            <caption className="ff-sr">Catalogue products</caption>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Stock</th>
                <th scope="col">Rating</th>
                <th scope="col"><span className="ff-sr">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="ff-line-art" style={{ width: 46, height: 46, padding: 5 }}>
                        <ProductArt product={p} />
                      </span>
                      <span>
                        <b style={{ display: 'block' }}>{p.name}</b>
                        <span className="ff-muted" style={{ fontSize: 12 }}>{p.brand} · {p.sku}</span>
                      </span>
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                  <td className="ff-tnum">
                    <b>{rs(p.discountPrice)}</b>
                    {discountPct(p) > 0 && (
                      <span className="ff-strike" style={{ display: 'block', fontSize: 12 }}>{rs(p.price)}</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={p.stock === 0 ? 'Out of stock' : p.stock <= 10 ? 'Low stock' : 'In stock'} />
                    <b className="ff-tnum" style={{ marginLeft: 8 }}>{p.stock}</b>
                  </td>
                  <td className="ff-tnum">{p.rating} ({p.reviewCount})</td>
                  <td>
                    <span style={{ display: 'flex', gap: 8 }}>
                      <Link className="ff-icon-btn" to={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`}>
                        <Icon name="edit" size={17} />
                      </Link>
                      <button type="button" className="ff-icon-btn" onClick={() => setConfirm(p)}
                        aria-label={`Delete ${p.name}`}>
                        <Icon name="trash" size={17} stroke="var(--ff-error-700)" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!confirm} title="Delete this product?" onClose={() => setConfirm(null)}
        footer={
          <>
            <button type="button" className="ff-btn ff-btn-outline" onClick={() => setConfirm(null)}>Cancel</button>
            <button type="button" className="ff-btn ff-btn-danger" onClick={remove}>Delete product</button>
          </>
        }
      >
        <p>
          <b>{confirm?.name}</b> will be hidden from the storefront. This is a local change — you can
          restore the full catalogue at any time with “Reset catalogue”.
        </p>
      </Modal>
    </>
  );
}
