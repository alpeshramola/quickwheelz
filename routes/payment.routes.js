const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth.middleware');
const Booking = require('../models/booking.model');
const config = require('../config/config');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: config.razorpay.key_id,
  key_secret: config.razorpay.key_secret
});

// Create payment order
router.post('/create-order', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.body.bookingId);
    
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    const options = {
      amount: booking.totalPrice * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: booking._id.toString(),
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        order,
        key: config.razorpay.keyId
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Verify payment
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      bookingId
    } = req.body;

    const shasum = crypto.createHmac('sha256', config.razorpay.keySecret);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature) {
      return res.status(400).json({
        status: 'fail',
        message: 'Transaction not legit!'
      });
    }

    // Update booking status
    const booking = await Booking.findById(bookingId);
    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

module.exports = router; 