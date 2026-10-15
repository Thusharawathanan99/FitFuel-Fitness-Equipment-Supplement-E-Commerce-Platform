import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_fitfuel_demo';
export const stripe = new Stripe(stripeKey);

export const isStripeConfigured = () => {
  return process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder');
};
