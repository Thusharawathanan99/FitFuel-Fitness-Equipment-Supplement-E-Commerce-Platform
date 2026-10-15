import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Seed initial memory cache in case MongoDB is offline
import { PRODUCTS_SEED, CATEGORIES_SEED } from '../data/initialData.js';

let memProducts = [...PRODUCTS_SEED];
let memCategories = [...CATEGORIES_SEED];

const safeIdQuery = (id) => {
  const isObjId = mongoose.isValidObjectId(id);
  return isObjId ? { $or: [{ id }, { _id: id }] } : { id };
};

export const getProducts = async (req, res) => {
  try {
    const { category, group, search, sort, featured, bestseller, maxPrice, minRating, brand } = req.query;

    let products = null;
    let dbSuccess = false;

    try {
      const query = {};
      if (category) {
        const catArray = Array.isArray(category) ? category : category.split(',').filter(Boolean);
        if (catArray.length) query.category = { $in: catArray };
      }
      if (group) query.group = group;
      if (featured === 'true') query.featured = true;
      if (bestseller === 'true') query.bestseller = true;
      if (brand) {
        const brandArray = Array.isArray(brand) ? brand : brand.split(',').filter(Boolean);
        if (brandArray.length) query.brand = { $in: brandArray };
      }
      if (maxPrice) {
        query.discountPrice = { $lte: Number(maxPrice) };
      }
      if (minRating) {
        query.rating = { $gte: Number(minRating) };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      products = await Product.find(query);
      dbSuccess = true;
    } catch {
      dbSuccess = false;
    }

    if (!dbSuccess) {
      // Memory fallback
      products = [...memProducts];
      if (group) products = products.filter(p => p.group === group);
      if (category) {
        const catArray = Array.isArray(category) ? category : category.split(',').filter(Boolean);
        if (catArray.length) products = products.filter(p => catArray.includes(p.category));
      }
      if (brand) {
        const brandArray = Array.isArray(brand) ? brand : brand.split(',').filter(Boolean);
        if (brandArray.length) products = products.filter(p => brandArray.includes(p.brand));
      }
      if (maxPrice) products = products.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
      if (minRating) products = products.filter(p => p.rating >= Number(minRating));
      if (featured === 'true') products = products.filter(p => p.featured);
      if (bestseller === 'true') products = products.filter(p => p.bestseller);
      if (search) {
        const q = search.toLowerCase();
        products = products.filter(p =>
          [p.name, p.brand, p.category, ...(p.tags || []), p.description || ''].join(' ').toLowerCase().includes(q)
        );
      }
    }

    // Apply sorting
    if (sort === 'low' || sort === 'price-asc') products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    else if (sort === 'high' || sort === 'price-desc') products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    else if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
    else if (sort === 'popular') products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ id }, { _id: id }, { slug: id }] }
        : { $or: [{ id }, { slug: id }] };
      const product = await Product.findOne(query);
      if (product) return res.json({ success: true, data: product });
    } catch {
      // Fallback
    }

    const memProduct = memProducts.find(p => p.id === id || p.slug === id);
    if (memProduct) {
      return res.json({ success: true, data: memProduct });
    }

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const id = productData.id || `prod-${Date.now().toString(36)}`;
    const newProduct = {
      ...productData,
      id,
      sku: productData.sku || id.toUpperCase(),
      rating: productData.rating || 0,
      reviewCount: productData.reviewCount || 0,
      slug: (productData.name || id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    try {
      const created = await Product.create(newProduct);
      return res.status(201).json({ success: true, data: created });
    } catch {
      memProducts.unshift(newProduct);
      return res.status(201).json({ success: true, data: newProduct });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    try {
      const updated = await Product.findOneAndUpdate(
        safeIdQuery(id),
        updates,
        { new: true }
      );
      if (updated) return res.json({ success: true, data: updated });
    } catch {
      // Fallback
    }

    const idx = memProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      memProducts[idx] = { ...memProducts[idx], ...updates };
      return res.json({ success: true, data: memProducts[idx] });
    }

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await Product.findOneAndDelete(safeIdQuery(id));
    } catch {
      // Fallback
    }

    memProducts = memProducts.filter(p => p.id !== id);
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    try {
      const categories = await Category.find();
      if (categories.length) return res.json({ success: true, data: categories });
    } catch {
      // Fallback
    }
    res.json({ success: true, data: memCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
