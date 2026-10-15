import express from 'express';
import { createPaymentIntent, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-intent', createPaymentIntent);
router.post('/verify', verifyPayment);

export default router;
