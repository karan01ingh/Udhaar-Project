import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create payment intent for premium subscription
router.post('/create-intent', verifyToken, async (req, res) => {
  try {
    const { planType } = req.body;
    
    // Define plan prices (in paise/cents)
    const planPrices = {
      monthly: 19900, // ₹199
      yearly: 199900  // ₹1999
    };
    
    const amount = planPrices[planType];
    if (!amount) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: {
        userId: req.user.uid,
        planType
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Confirm payment and upgrade user
router.post('/confirm',verifyToken, async (req, res) => {
  try {
    const { paymentIntentId, planType } = req.body;
    
    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }
    
    // Update user premium status
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const expiryDate = new Date();
    if (planType === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }
    
    user.isPremium = true;
    user.premiumExpiresAt = expiryDate;
    await user.save();
    
    res.json({ 
      message: 'Premium upgrade successful',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get payment history
router.get('/history',verifyToken, async (req, res) => {
  try {
    // This would typically fetch from a payments collection
    // For now, return empty array as placeholder
    res.json([]);
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;