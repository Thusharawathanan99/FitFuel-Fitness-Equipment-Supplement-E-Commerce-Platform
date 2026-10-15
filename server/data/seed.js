import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import { PRODUCTS_SEED, CATEGORIES_SEED } from './initialData.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitfuel';
  try {
    await mongoose.connect(uri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();

    // Create Demo Users
    const users = await User.create([
      {
        name: 'Demo Customer',
        email: 'demo@fitfuel.lk',
        password: 'demo1234',
        role: 'customer',
        points: 1450
      },
      {
        name: 'Store Admin',
        email: 'admin@fitfuel.lk',
        password: 'admin1234',
        role: 'admin',
        points: 0
      }
    ]);
    console.log(`[Seed] Seeded ${users.length} users (passwords hashed with bcrypt)`);

    // Create Categories
    const categories = await Category.insertMany(CATEGORIES_SEED);
    console.log(`[Seed] Seeded ${categories.length} categories`);

    // Create Products
    const products = await Product.insertMany(PRODUCTS_SEED);
    console.log(`[Seed] Seeded ${products.length} products`);

    console.log('[Seed] Database successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error.message);
    process.exit(1);
  }
};

seedDatabase();
