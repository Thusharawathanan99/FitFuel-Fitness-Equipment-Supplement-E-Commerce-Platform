import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
