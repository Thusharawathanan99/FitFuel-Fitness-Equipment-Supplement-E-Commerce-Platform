import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import emailService from '../services/emailService.js';

let memOrders = [
  {
    id: 'FF-24102',
    userId: 'u1',
    customer: 'Demo Customer',
    email: 'demo@fitfuel.lk',
    placedAt: new Date('2026-08-02T09:20:00.000Z'),
    stage: 5,
    status: 'Delivered',
    items: [{ id: 'eq12', name: 'Adjustable FID Weight Bench', qty: 1, price: 46500, art: 'bench' }],
    subtotal: 46500,
    discount: 0,
    delivery: 0,
    total: 46500,
    points: 465,
    address: { line1: '14 Galle Road', city: 'Colombo', zip: '00300' },
    payment: 'Card',
    paymentStatus: 'Completed',
    eta: '2026-08-06'
  },
  {
    id: 'FF-24817',
    userId: 'u1',
    customer: 'Demo Customer',
    email: 'demo@fitfuel.lk',
    placedAt: new Date('2026-08-24T11:40:00.000Z'),
    stage: 4,
    status: 'Out for Delivery',
    items: [
      { id: 'sp01', name: 'Avvatar Isorich Whey Protein 2kg', qty: 1, price: 3999, art: 'tub' },
      { id: 'sp07', name: 'Micronised Creatine Monohydrate 500g', qty: 2, price: 2499, art: 'creatine' }
    ],
    subtotal: 8997,
    discount: 900,
    delivery: 990,
    total: 9087,
    points: 90,
    address: { line1: '14 Galle Road', city: 'Colombo', zip: '00300' },
    payment: 'Card',
    paymentStatus: 'Completed',
    eta: '2026-08-28'
  }
];

const ORDER_STAGES = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = `FF-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      ...orderData,
      id: orderId,
      placedAt: new Date(),
      stage: 0,
      status: ORDER_STAGES[0],
      paymentStatus: orderData.payment === 'Card' ? 'Completed' : 'Pending'
    };

    let savedOrder;
    try {
      savedOrder = await Order.create(newOrder);
      // Award loyalty points to user
      if (orderData.userId && orderData.points && mongoose.isValidObjectId(orderData.userId)) {
        await User.findByIdAndUpdate(orderData.userId, { $inc: { points: orderData.points } });
      }
    } catch {
      memOrders.unshift(newOrder);
      savedOrder = newOrder;
    }

    // Trigger Nodemailer email notification in background
    emailService.sendOrderConfirmation(savedOrder).catch(err => {
      console.warn('[Email Notification Background Error]', err.message);
    });

    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : (req.query.userId || req.params.userId);

    try {
      const orders = await Order.find({ userId }).sort({ placedAt: -1 });
      if (orders.length) return res.json({ success: true, data: orders });
    } catch {
      // Fallback
    }

    const filtered = memOrders.filter(o => o.userId === userId || o.userId === 'u1');
    res.json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    try {
      const orders = await Order.find().sort({ placedAt: -1 });
      if (orders.length) return res.json({ success: true, data: orders });
    } catch {
      // Fallback
    }
    res.json({ success: true, data: memOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const order = await Order.findOne({ id });
      if (order) return res.json({ success: true, data: order });
    } catch {
      // Fallback
    }

    const memOrder = memOrders.find(o => o.id === id);
    if (memOrder) return res.json({ success: true, data: memOrder });

    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, status } = req.body;

    const nextStage = stage !== undefined ? stage : 0;
    const nextStatus = status || ORDER_STAGES[nextStage] || 'Updated';

    try {
      const updated = await Order.findOneAndUpdate(
        { id },
        { stage: nextStage, status: nextStatus },
        { new: true }
      );
      if (updated) return res.json({ success: true, data: updated });
    } catch {
      // Fallback
    }

    const idx = memOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      memOrders[idx].stage = nextStage;
      memOrders[idx].status = nextStatus;
      return res.json({ success: true, data: memOrders[idx] });
    }

    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
