import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Upload product image route (Admin protected)
router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

export default router;
