import express from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/:productId', getReviews);
router.post('/:productId', createReview);

export default router;
