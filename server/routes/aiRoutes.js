import express from 'express';
import { getAiRecommendations } from '../controllers/aiController.js';

const router = express.Router();

router.post('/recommendations', getAiRecommendations);

export default router;
