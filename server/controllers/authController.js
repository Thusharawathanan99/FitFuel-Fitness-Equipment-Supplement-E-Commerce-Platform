import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import emailService from '../services/emailService.js';
import crypto from 'crypto';

// In-memory fallback users for development without local MongoDB
let memUsers = [
  {
    _id: 'u1',
    id: 'u1',
    name: 'Demo Customer',
    email: 'demo@fitfuel.lk',
    password: 'demo1234', // In production, hashed with bcrypt
    role: 'customer',
    points: 1450,
    joined: new Date('2024-03-11')
  },
  {
    _id: 'a1',
    id: 'a1',
    name: 'Store Admin',
    email: 'admin@fitfuel.lk',
    password: 'admin1234',
    role: 'admin',
    points: 0,
    joined: new Date('2023-11-02')
  }
];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'fitfuel_jwt_super_secret_key_2026_fitness_ecommerce',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check DB or memory
    try {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account already exists with that email' });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        role: 'customer',
        points: 0
      });

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
          joined: user.joined
        }
      });
    } catch (dbErr) {
      // Memory fallback
      if (memUsers.some(u => u.email === cleanEmail)) {
        return res.status(400).json({ success: false, message: 'An account already exists with that email' });
      }

      const newUser = {
        _id: `u${Date.now()}`,
        id: `u${Date.now()}`,
        name,
        email: cleanEmail,
        password,
        role: 'customer',
        points: 0,
        joined: new Date()
      };
      memUsers.push(newUser);

      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          points: newUser.points,
          joined: newUser.joined
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
          const token = generateToken(user);
          return res.json({
            success: true,
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              points: user.points,
              joined: user.joined
            }
          });
        }
      }
    } catch {
      // Proceed to check memUsers if db fails
    }

    const memUser = memUsers.find(u => u.email === cleanEmail && u.password === password);
    if (!memUser) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(memUser);
    return res.json({
      success: true,
      token,
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        points: memUser.points,
        joined: memUser.joined
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = String(email || '').toLowerCase().trim();

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    try {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetExpire;
        await user.save();
      }
    } catch {
      // Memory fallback
    }

    const memUser = memUsers.find(u => u.email === cleanEmail);
    if (memUser) {
      memUser.resetPasswordToken = resetToken;
      memUser.resetPasswordExpire = resetExpire;
    }

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(cleanEmail)}`;

    // Send email via Nodemailer
    await emailService.sendPasswordResetEmail(cleanEmail, resetToken, resetUrl);

    return res.json({
      success: true,
      message: 'Password reset instructions have been sent to your email.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;
    const cleanEmail = String(email || '').toLowerCase().trim();

    if (!token) {
      return res.status(400).json({ success: false, message: 'Password reset token is required' });
    }

    try {
      const user = await User.findOne({
        email: cleanEmail,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (user) {
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.json({ success: true, message: 'Password reset successful.' });
      }
    } catch {
      // Memory fallback
    }

    const user = memUsers.find(
      u => u.email === cleanEmail && u.resetPasswordToken === token && u.resetPasswordExpire > Date.now()
    );
    if (user) {
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      return res.json({ success: true, message: 'Password reset successful.' });
    }

    return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, email } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();

    try {
      if (mongoose.isValidObjectId(userId)) {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (user) {
          return res.json({
            success: true,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              points: user.points,
              joined: user.joined
            }
          });
        }
      }
    } catch {
      // Memory fallback
    }

    const memUser = memUsers.find(u => u.id === userId || u._id === userId);
    if (memUser) {
      if (updates.name) memUser.name = updates.name;
      if (updates.email) memUser.email = updates.email;
      return res.json({
        success: true,
        user: {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          points: memUser.points,
          joined: memUser.joined
        }
      });
    }

    res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    try {
      const users = await User.find({ role: 'customer' }).select('-password');
      if (users.length) {
        const mapped = users.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          points: u.points,
          joined: u.joined
        }));
        return res.json({ success: true, data: mapped });
      }
    } catch {
      // Memory fallback
    }

    const mapped = memUsers
      .filter(u => u.role === 'customer')
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        points: u.points,
        joined: u.joined
      }));

    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

