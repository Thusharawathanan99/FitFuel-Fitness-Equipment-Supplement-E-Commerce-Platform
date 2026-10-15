import express from 'express';
import {
  register,
  login,
  getMe,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  getAllUsers
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, adminOnly, getAllUsers);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
