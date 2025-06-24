const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bike: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bike',
        required: [true, 'Booking must belong to a Bike']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User']
    },
    startDate: {
        type: Date,
        required: [true, 'Please specify start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please specify end date']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Booking must have a total price']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Populate bike and user details when querying bookings
bookingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'bike',
        select: 'title image price city address'
    }).populate({
        path: 'user',
        select: 'name email'
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking; 