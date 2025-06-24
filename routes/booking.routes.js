const express = require('express');
const Booking = require('../models/booking.model');
const Bike = require('../models/bike.model');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const router = express.Router();
const transporter = require('../config/email');
const User = require('../models/user.model');

// Create booking (protected & restricted to customers)
router.post('/', protect, restrictTo('customer'), async (req, res) => {
    try {
        // Check if bike exists and is available
        const bike = await Bike.findById(req.body.bike);
        if (!bike || !bike.available) {
            return res.status(400).json({
                status: 'fail',
                message: 'Bike not found or not available'
            });
        }

        // Calculate total price
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
        const totalPrice = bike.price * days;

        // Create booking with consumer details
        const newBooking = await Booking.create({
            bike: req.body.bike,
            user: req.user._id,
            startDate,
            endDate,
            totalPrice
        });

        // Update bike availability
        await Bike.findByIdAndUpdate(req.body.bike, { available: false });

        /*
        // Send email notification to owner
        const owner = await User.findById(bike.owner);
        if (owner && owner.email) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: owner.email,
                subject: `New Booking for Your Bike: ${bike.title}`,
                text: `Hello ${owner.name},\n\nYour bike '${bike.title}' has been booked.\n\nShop Address: ${bike.address}\n\nBooking Details:\nStart Date: ${startDate.toLocaleDateString()}\nEnd Date: ${endDate.toLocaleDateString()}\nTotal Price: ₹${totalPrice}\n\nConsumer Details:\nName: ${newBooking.consumerName}\nID: ${newBooking.consumerId}\nUPI ID: ${newBooking.upiId}\n\nPlease check your dashboard for more info.\n\n- QuickWheelz`
            });
        }
        */

        res.status(201).json({
            status: 'success',
            data: {
                booking: newBooking
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id });

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Get single booking by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                status: 'fail',
                message: 'Booking not found'
            });
        }

        // Check if the user is authorized to view this booking
        if (booking.user.toString() !== req.user.id) {
            // Check if user is the bike owner
            const bike = await Bike.findById(booking.bike);
            if (!bike || bike.owner.toString() !== req.user.id) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'You are not authorized to view this booking'
                });
            }
        }

        res.status(200).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Get owner's bike bookings
router.get('/my-bike-bookings', protect, restrictTo('owner'), async (req, res) => {
    try {
        // First get all bikes owned by the user
        const bikes = await Bike.find({ owner: req.user.id });
        const bikeIds = bikes.map(bike => bike._id);

        // Then get all bookings for these bikes
        const bookings = await Booking.find({
            bike: { $in: bikeIds }
        });

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Update booking status (protected & restricted to owner of the bike)
router.patch('/:id/status', protect, restrictTo('owner'), async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                status: 'fail',
                message: 'Booking not found'
            });
        }

        // Check if the bike belongs to the owner
        const bike = await Bike.findById(booking.bike);
        if (bike.owner.toString() !== req.user.id) {
            return res.status(403).json({
                status: 'fail',
                message: 'You can only update bookings for your own bikes'
            });
        }

        booking.status = req.body.status;
        if (req.body.status === 'completed' || req.body.status === 'cancelled') {
            bike.available = true;
            await bike.save();
        }

        await booking.save();

        res.status(200).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

module.exports = router; 