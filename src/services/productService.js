import { PRODUCTS, findProduct, BRANDS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ok, fail } from './http';
import { storage } from '../utils/storage';

/** Admin edits live in localStorage on top of the seed catalogue. */
const OVERRIDES = 'productOverrides';
const readOverrides = () => storage.get(OVERRIDES, { updated: {}, added: [], removed: [] });

const merged = () => {
  const o = readOverrides();
  const base = PRODUCTS.filter((p) => !o.removed.includes(p.id)).map((p) =>
    o.updated[p.id] ? { ...p, ...o.updated[p.id] } : p
  );
  return [...o.added, ...base];
};

const applyFilters = (list, q = {}) => {
  let out = [...list];
  if (q.group) out = out.filter((p) => p.group === q.group);
  if (q.category?.length) out = out.filter((p) => q.category.includes(p.category));
  if (q.brand?.length) out = out.filter((p) => q.brand.includes(p.brand));
  if (q.maxPrice) out = out.filter((p) => p.discountPrice <= q.maxPrice);
  if (q.minRating) out = out.filter((p) => p.rating >= q.minRating);
  if (q.search) {
    const t = q.search.toLowerCase();
    out = out.filter((p) =>
      [p.name, p.brand, p.category, ...(p.tags || [])].join(' ').toLowerCase().includes(t)
    );
  }
  const sorters = {
    low: (a, b) => a.discountPrice - b.discountPrice,
    high: (a, b) => b.discountPrice - a.discountPrice,
    rating: (a, b) => b.rating - a.rating,
    discount: (a, b) =>
      1 - b.discountPrice / b.price - (1 - a.discountPrice / a.price),
    popular: (a, b) => b.reviewCount - a.reviewCount
  };
  if (q.sort && sorters[q.sort]) out.sort(sorters[q.sort]);
  return out;
};

export const productService = {
  getProducts: (query = {}) => ok(applyFilters(merged(), query)),
  getProductById: (id) => {
    const local = merged().find((p) => p.id === id || p.slug === id) || findProduct(id);
    return local ? ok(local) : fail('Product not found');
  },
  getFeatured: () => ok(merged().filter((p) => p.featured).slice(0, 4)),
  getBestsellers: () => ok(merged().filter((p) => p.bestseller).slice(0, 4)),
  getRelated: (product, n = 4) =>
    ok(
      merged()
        .filter((p) => p.id !== product.id && (p.category === product.category || p.group === product.group))
        .slice(0, n)
    ),
  getLowStock: (threshold = 20) => ok(merged().filter((p) => p.stock <= threshold)),
  getBrands: () => ok(BRANDS),
  getCategories: () => ok(CATEGORIES),

  addProduct(product) {
    const o = readOverrides();
    const id = product.id || `new${Date.now().toString(36)}`;
    o.added.unshift({
      rating: 0, reviewCount: 0, tags: [], specifications: [], art: 'tub',
      featured: false, bestseller: false, ...product,
      id, sku: id.toUpperCase(),
      slug: String(product.name || id).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
    storage.set(OVERRIDES, o);
    return ok(o.added[0]);
  },
  updateProduct(id, patch) {
    const o = readOverrides();
    const addedIdx = o.added.findIndex((p) => p.id === id);
    if (addedIdx > -1) o.added[addedIdx] = { ...o.added[addedIdx], ...patch };
    else o.updated[id] = { ...(o.updated[id] || {}), ...patch };
    storage.set(OVERRIDES, o);
    return ok({ id, ...patch });
  },
  deleteProduct(id) {
    const o = readOverrides();
    o.added = o.added.filter((p) => p.id !== id);
    if (!o.removed.includes(id)) o.removed.push(id);
    storage.set(OVERRIDES, o);
    return ok({ id });
  },
  resetCatalogue() {
    storage.remove(OVERRIDES);
    return ok(true);
  }
};
