import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import ProductArt from '../../components/product/ProductArt';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { productService } from '../../services';
import { apiRequest } from '../../services/http';
import { CATEGORIES, categoryBySlug } from '../../data/categories';
import { BRANDS } from '../../data/products';
import { rs } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const ART_KEYS = ['tub', 'whey', 'creatine', 'preworkout', 'gainer', 'bottle', 'bar', 'shaker',
  'dumbbell', 'kettlebell', 'barbell', 'plate', 'rack', 'bench', 'treadmill', 'mat', 'belt', 'tree', 'band', 'rope'];

const BLANK = {
  name: '', brand: BRANDS[0] || '', category: 'protein', group: 'supplement',
  price: '', discountPrice: '', stock: '', description: '', art: 'tub',
  imageUrl: '', tags: '', featured: false, bestseller: false
};

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = !!id;
  useDocumentTitle(editing ? 'Admin · Edit product' : 'Admin · New product');
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(BLANK);
  const [specs, setSpecs] = useState([['', '']]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const data = await apiRequest('/upload', {
        method: 'POST',
        body: formData
      });
      if (data?.imageUrl) {
        setForm((f) => ({ ...f, imageUrl: data.imageUrl }));
        toast.success('Product image uploaded successfully!');
      } else {
        toast.error(data?.message || 'Image upload failed');
      }
    } catch (uploadErr) {
      toast.error(uploadErr.message || 'Could not connect to image upload endpoint');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (!editing) return;
    let alive = true;
    productService.getProductById(id)
      .then((p) => {
        if (!alive) return;
        setForm({
          name: p.name, brand: p.brand, category: p.category, group: p.group,
          price: String(p.price), discountPrice: String(p.discountPrice), stock: String(p.stock),
          description: p.description, art: p.art, imageUrl: p.imageUrl || '', tags: (p.tags || []).join(', '),
          featured: p.featured, bestseller: p.bestseller
        });
        setSpecs(p.specifications?.length ? p.specifications.map((s) => [...s]) : [['', '']]);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, editing]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      /* Keep group and category consistent whichever one the admin changes. */
      if (key === 'category') next.group = categoryBySlug(value)?.group || next.group;
      if (key === 'group' && categoryBySlug(next.category)?.group !== value)
        next.category = CATEGORIES.find((c) => c.group === value).slug;
      return next;
    });
    setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const setSpec = (i, j) => (e) => {
    const value = e.target.value;
    setSpecs((list) => list.map((row, k) => (k === i ? row.map((cell, l) => (l === j ? value : cell)) : row)));
  };

  const validate = () => {
    const next = {};
    const price = Number(form.price);
    const discount = Number(form.discountPrice);
    if (form.name.trim().length < 3) next.name = 'Enter a product name.';
    if (!form.brand.trim()) next.brand = 'Enter a brand.';
    if (!(price > 0)) next.price = 'Enter a list price above zero.';
    if (!(discount > 0)) next.discountPrice = 'Enter a selling price above zero.';
    else if (discount > price) next.discountPrice = 'The selling price cannot exceed the list price.';
    if (!(Number(form.stock) >= 0)) next.stock = 'Enter the stock on hand.';
    if (form.description.trim().length < 20) next.description = 'Write at least 20 characters of description.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the highlighted fields');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(), brand: form.brand.trim(), category: form.category, group: form.group,
      price: Number(form.price), discountPrice: Number(form.discountPrice), stock: Number(form.stock),
      description: form.description.trim(), art: form.art, imageUrl: form.imageUrl,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      specifications: specs.filter(([k, v]) => k.trim() && v.trim()),
      featured: form.featured, bestseller: form.bestseller
    };
    try {
      if (editing) {
        await productService.updateProduct(id, payload);
        toast.success('Product updated');
      } else {
        await productService.addProduct(payload);
        toast.success('Product added to the catalogue');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="ff-skel" style={{ height: 420 }} />;

  const margin = Number(form.price) > 0 && Number(form.discountPrice) > 0
    ? Math.round((1 - Number(form.discountPrice) / Number(form.price)) * 100)
    : 0;

  const field = (key, label, props = {}) => (
    <label className="ff-field">
      <span>{label}</span>
      <input className={`ff-input${errors[key] ? ' is-invalid' : ''}`} value={form[key]}
        onChange={set(key)} aria-invalid={!!errors[key]} {...props} />
      {errors[key] && <em className="ff-field-error">{errors[key]}</em>}
    </label>
  );

  return (
    <>
      <div className="ff-head-row">
        <div>
          <h1 style={{ fontSize: 28 }}>{editing ? 'Edit product' : 'Add a product'}</h1>
          <p className="ff-muted" style={{ marginTop: 6 }}>
            {editing ? 'Changes apply to the storefront immediately.' : 'New products appear at the top of the catalogue.'}
          </p>
        </div>
        <Link className="ff-btn ff-btn-outline ff-btn-sm" to="/admin/products">
          <Icon name="chevronLeft" size={16} /> Back to products
        </Link>
      </div>

      <form onSubmit={submit} noValidate className="ff-layout" style={{ gridTemplateColumns: 'minmax(0, 1fr) 320px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <section className="ff-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 19 }}>Basics</h2>
            {field('name', 'Product name', { placeholder: 'Rubber Hex Dumbbell 20kg Pair' })}
            <div className="ff-grid ff-g2">
              {field('brand', 'Brand', { list: 'ff-brands', placeholder: 'IronCore' })}
              <datalist id="ff-brands">{BRANDS.map((b) => <option key={b} value={b} />)}</datalist>
              <label className="ff-field">
                <span>Group</span>
                <select className="ff-input" value={form.group} onChange={set('group')}>
                  <option value="equipment">Fitness Equipment</option>
                  <option value="supplement">Supplements</option>
                </select>
              </label>
            </div>
            <div className="ff-grid ff-g2">
              <label className="ff-field">
                <span>Category</span>
                <select className="ff-input" value={form.category} onChange={set('category')}>
                  {CATEGORIES.filter((c) => c.group === form.group).map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="ff-field">
                <span>Illustration</span>
                <select className="ff-input" value={form.art} onChange={set('art')}>
                  {ART_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </label>
            </div>
            <div style={{
              background: 'var(--ff-surface-2, #fafafa)',
              border: '1px dashed var(--ff-border, #ccc)',
              borderRadius: 8,
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Cloudinary Product Media</span>
                <span style={{ fontSize: 11, background: '#29ABE2', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>
                  Cloud Storage
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                style={{ fontSize: 13 }}
              />
              {uploadingImage && <small style={{ color: '#29ABE2' }}>Uploading image to Cloudinary storage...</small>}
              {form.imageUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <img src={form.imageUrl} alt="Uploaded preview" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                  <small style={{ wordBreak: 'break-all', color: '#666' }}>{form.imageUrl}</small>
                </div>
              )}
            </div>
            <label className="ff-field">
              <span>Description</span>
              <textarea className={`ff-input${errors.description ? ' is-invalid' : ''}`} rows={4}
                value={form.description} onChange={set('description')}
                style={{ height: 'auto', padding: 12, resize: 'vertical' }}
                placeholder="What makes this product worth buying?" aria-invalid={!!errors.description} />
              {errors.description && <em className="ff-field-error">{errors.description}</em>}
            </label>
            {field('tags', 'Tags', { placeholder: 'strength, home gym' })}
          </section>

          <section className="ff-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 19 }}>Pricing &amp; stock</h2>
            <div className="ff-grid ff-g3">
              {field('price', 'List price (Rs)', { inputMode: 'numeric', placeholder: '22000' })}
              {field('discountPrice', 'Selling price (Rs)', { inputMode: 'numeric', placeholder: '18900' })}
              {field('stock', 'Stock on hand', { inputMode: 'numeric', placeholder: '42' })}
            </div>
            {margin > 0 && (
              <p className="ff-muted" style={{ fontSize: 13 }}>
                Shoppers will see a <b>{margin}% off</b> badge — a saving of{' '}
                {rs(Number(form.price) - Number(form.discountPrice))}.
              </p>
            )}
          </section>

          <section className="ff-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: 19 }}>Specifications</h2>
              <button type="button" className="ff-btn ff-btn-outline ff-btn-sm"
                onClick={() => setSpecs((s) => [...s, ['', '']])}>
                <Icon name="plus" size={15} /> Add row
              </button>
            </div>
            {specs.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) 44px', gap: 10 }}>
                <input className="ff-input" value={row[0]} onChange={setSpec(i, 0)}
                  placeholder="Label (e.g. Weight)" aria-label={`Specification ${i + 1} label`} />
                <input className="ff-input" value={row[1]} onChange={setSpec(i, 1)}
                  placeholder="Value (e.g. 20 kg × 2)" aria-label={`Specification ${i + 1} value`} />
                <button type="button" className="ff-icon-btn" aria-label={`Remove specification ${i + 1}`}
                  onClick={() => setSpecs((s) => (s.length === 1 ? [['', '']] : s.filter((_, k) => k !== i)))}>
                  <Icon name="trash" size={16} stroke="var(--ff-error-700)" />
                </button>
              </div>
            ))}
          </section>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 24, alignSelf: 'start' }}>
          <section className="ff-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 18 }}>Preview</h2>
            <span className="ff-line-art" style={{ width: '100%', height: 150 }}>
              <ProductArt artKey={form.art} />
            </span>
            <div>
              <b style={{ display: 'block', fontSize: 15 }}>{form.name || 'Product name'}</b>
              <span className="ff-muted" style={{ fontSize: 13 }}>{form.brand || 'Brand'}</span>
            </div>
            <span className="ff-display ff-tnum" style={{ fontSize: 24, color: 'var(--ff-brand-600)' }}>
              {rs(Number(form.discountPrice) || 0)}
            </span>
          </section>

          <section className="ff-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 18 }}>Visibility</h2>
            <label className="ff-check">
              <span>
                <input type="checkbox" checked={form.featured} onChange={set('featured')} />
                <span className="ff-box" aria-hidden="true" />
                <span>Feature on the home page</span>
              </span>
            </label>
            <label className="ff-check">
              <span>
                <input type="checkbox" checked={form.bestseller} onChange={set('bestseller')} />
                <span className="ff-box" aria-hidden="true" />
                <span>Mark as a best seller</span>
              </span>
            </label>
          </section>

          <button className="ff-btn ff-btn-primary ff-btn-lg ff-btn-block" type="submit" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
          </button>
          <Link className="ff-btn ff-btn-outline ff-btn-block" to="/admin/products">Cancel</Link>
        </aside>
      </form>
    </>
  );
}
