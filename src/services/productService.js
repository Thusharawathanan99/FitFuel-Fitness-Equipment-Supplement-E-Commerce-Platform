import { PRODUCTS, findProduct, BRANDS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ok, fail, apiRequest } from './http';
import { storage } from '../utils/storage';

/** Admin edits live in localStorage on top of the seed catalogue as offline fallback. */
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
  if (q.category?.length) {
    const cats = Array.isArray(q.category) ? q.category : [q.category];
    out = out.filter((p) => cats.includes(p.category));
  }
  if (q.brand?.length) {
    const brands = Array.isArray(q.brand) ? q.brand : [q.brand];
    out = out.filter((p) => brands.includes(p.brand));
  }
  if (q.maxPrice) out = out.filter((p) => (p.discountPrice || p.price) <= q.maxPrice);
  if (q.minRating) out = out.filter((p) => p.rating >= q.minRating);
  if (q.search) {
    const t = q.search.toLowerCase();
    out = out.filter((p) =>
      [p.name, p.brand, p.category, ...(p.tags || []), p.description || ''].join(' ').toLowerCase().includes(t)
    );
  }
  const sorters = {
    low: (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
    high: (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
    rating: (a, b) => b.rating - a.rating,
    discount: (a, b) =>
      1 - (b.discountPrice || b.price) / b.price - (1 - (a.discountPrice || a.price) / a.price),
    popular: (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)
  };
  if (q.sort && sorters[q.sort]) out.sort(sorters[q.sort]);
  return out;
};

export const productService = {
  async getProducts(query = {}) {
    try {
      const params = new URLSearchParams();
      if (query.group) params.append('group', query.group);
      if (query.category) params.append('category', Array.isArray(query.category) ? query.category.join(',') : query.category);
      if (query.brand) params.append('brand', Array.isArray(query.brand) ? query.brand.join(',') : query.brand);
      if (query.search) params.append('search', query.search);
      if (query.sort) params.append('sort', query.sort);
      if (query.maxPrice) params.append('maxPrice', query.maxPrice);
      if (query.minRating) params.append('minRating', query.minRating);
      if (query.featured) params.append('featured', 'true');
      if (query.bestseller) params.append('bestseller', 'true');

      const qStr = params.toString();
      const res = await apiRequest(`/products${qStr ? `?${qStr}` : ''}`);
      if (res?.data) return res.data;
    } catch {
      // Fallback to local
    }
    return ok(applyFilters(merged(), query));
  },

  async getProductById(id) {
    try {
      const res = await apiRequest(`/products/${id}`);
      if (res?.data) return res.data;
    } catch {
      // Fallback
    }
    const local = merged().find((p) => p.id === id || p.slug === id) || findProduct(id);
    return local ? ok(local) : fail('Product not found');
  },

  async getFeatured() {
    try {
      const res = await apiRequest('/products?featured=true');
      if (res?.data?.length) return res.data.slice(0, 4);
    } catch {}
    return ok(merged().filter((p) => p.featured).slice(0, 4));
  },

  async getBestsellers() {
    try {
      const res = await apiRequest('/products?bestseller=true');
      if (res?.data?.length) return res.data.slice(0, 4);
    } catch {}
    return ok(merged().filter((p) => p.bestseller).slice(0, 4));
  },

  async getRelated(product, n = 4) {
    try {
      const res = await apiRequest(`/products?category=${product.category}`);
      if (res?.data?.length) {
        const filtered = res.data.filter((p) => p.id !== product.id).slice(0, n);
        if (filtered.length) return filtered;
      }
    } catch {}
    return ok(
      merged()
        .filter((p) => p.id !== product.id && (p.category === product.category || p.group === product.group))
        .slice(0, n)
    );
  },

  async getLowStock(threshold = 20) {
    try {
      const res = await apiRequest('/products');
      if (res?.data?.length) {
        return res.data.filter((p) => p.stock <= threshold);
      }
    } catch {}
    return ok(merged().filter((p) => p.stock <= threshold));
  },

  getBrands: () => ok(BRANDS),

  async getCategories() {
    try {
      const res = await apiRequest('/products/categories');
      if (res?.data?.length) return res.data;
    } catch {}
    return ok(CATEGORIES);
  },

  async addProduct(product) {
    try {
      const res = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(product)
      });
      if (res?.data) {
        const o = readOverrides();
        o.added.unshift(res.data);
        storage.set(OVERRIDES, o);
        return res.data;
      }
    } catch {
      // Local fallback
    }

    const o = readOverrides();
    const id = product.id || `new${Date.now().toString(36)}`;
    const newRecord = {
      rating: 0, reviewCount: 0, tags: [], specifications: [], art: 'tub',
      featured: false, bestseller: false, ...product,
      id, sku: id.toUpperCase(),
      slug: String(product.name || id).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    o.added.unshift(newRecord);
    storage.set(OVERRIDES, o);
    return ok(newRecord);
  },

  async updateProduct(id, patch) {
    try {
      const res = await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patch)
      });
      if (res?.data) {
        const o = readOverrides();
        const addedIdx = o.added.findIndex((p) => p.id === id);
        if (addedIdx > -1) o.added[addedIdx] = { ...o.added[addedIdx], ...patch };
        else o.updated[id] = { ...(o.updated[id] || {}), ...patch };
        storage.set(OVERRIDES, o);
        return res.data;
      }
    } catch {
      // Fallback
    }

    const o = readOverrides();
    const addedIdx = o.added.findIndex((p) => p.id === id);
    if (addedIdx > -1) o.added[addedIdx] = { ...o.added[addedIdx], ...patch };
    else o.updated[id] = { ...(o.updated[id] || {}), ...patch };
    storage.set(OVERRIDES, o);
    return ok({ id, ...patch });
  },

  async deleteProduct(id) {
    try {
      await apiRequest(`/products/${id}`, {
        method: 'DELETE'
      });
    } catch {
      // Fallback
    }

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
