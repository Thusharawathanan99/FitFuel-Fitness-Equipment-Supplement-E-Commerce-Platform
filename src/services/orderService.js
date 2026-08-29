import { ok, fail } from './http';
import { storage } from '../utils/storage';
import { orderRef } from '../utils/format';

const ORDERS = 'orders';

export const ORDER_STAGES = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

const seed = () => {
  const existing = storage.get(ORDERS, null);
  if (existing) return existing;
  const initial = [
    {
      id: 'FF-24102', userId: 'u1', customer: 'Demo Customer', email: 'demo@fitfuel.lk',
      placedAt: '2026-08-02T09:20:00.000Z', stage: 5, status: 'Delivered',
      items: [{ id: 'eq12', name: 'Adjustable FID Weight Bench', qty: 1, price: 46500, art: 'bench' }],
      subtotal: 46500, discount: 0, delivery: 0, total: 46500,
      address: { line1: '14 Galle Road', city: 'Colombo', zip: '00300' },
      payment: 'Card', eta: '2026-08-06'
    },
    {
      id: 'FF-23644', userId: 'u1', customer: 'Demo Customer', email: 'demo@fitfuel.lk',
      placedAt: '2026-07-11T14:05:00.000Z', stage: 5, status: 'Delivered',
      items: [{ id: 'eq01', name: 'Rubber Hex Dumbbell 20kg Pair', qty: 2, price: 18900, art: 'dumbbell' }],
      subtotal: 37800, discount: 3780, delivery: 0, total: 34020,
      address: { line1: '14 Galle Road', city: 'Colombo', zip: '00300' },
      payment: 'Cash on delivery', eta: '2026-07-15'
    },
    {
      id: 'FF-24817', userId: 'u1', customer: 'Demo Customer', email: 'demo@fitfuel.lk',
      placedAt: '2026-08-24T11:40:00.000Z', stage: 4, status: 'Out for Delivery',
      items: [
        { id: 'sp01', name: 'Avvatar Isorich Whey Protein 2kg', qty: 1, price: 3999, art: 'tub' },
        { id: 'sp07', name: 'Micronised Creatine Monohydrate 500g', qty: 2, price: 2499, art: 'creatine' }
      ],
      subtotal: 8997, discount: 900, delivery: 990, total: 9087,
      address: { line1: '14 Galle Road', city: 'Colombo', zip: '00300' },
      payment: 'Card', eta: '2026-08-28'
    }
  ];
  storage.set(ORDERS, initial);
  return initial;
};

export const orderService = {
  getOrders: (userId) => {
    const all = seed();
    return ok(userId ? all.filter((o) => o.userId === userId) : all);
  },
  getOrderById: (id) => {
    const found = seed().find((o) => o.id === id);
    return found ? ok(found) : fail('Order not found');
  },
  createOrder(order) {
    const all = seed();
    const record = {
      ...order,
      id: orderRef(),
      placedAt: new Date().toISOString(),
      stage: 0,
      status: ORDER_STAGES[0],
      eta: new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10)
    };
    all.unshift(record);
    storage.set(ORDERS, all);
    return ok(record);
  },
  updateOrderStatus(id, stage) {
    const all = seed();
    const i = all.findIndex((o) => o.id === id);
    if (i < 0) return fail('Order not found');
    all[i].stage = stage;
    all[i].status = ORDER_STAGES[stage];
    storage.set(ORDERS, all);
    return ok(all[i]);
  }
};
