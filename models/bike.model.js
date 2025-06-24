const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide bike title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide bike description']
    },
    image: {
        type: String,
        required: [true, 'Please provide bike image']
    },
    price: {
        type: Number,
        required: [true, 'Please provide rental price per day']
    },
    city: [{
        type: String,
        required: [true, 'Please provide the city']
    }],
    available: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Bike must belong to an owner']
    },
    specifications: {
        brand: String,
        model: String,
        year: Number,
        engineCC: Number,
        mileage: Number
    },
    address: {
        type: String,
        required: [true, 'Please provide the shop address']
    },
    pincode: {
        type: String,
        required: [true, 'Please provide the shop pincode']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
bikeSchema.index({ city: 1, available: 1 });

const Bike = mongoose.model('Bike', bikeSchema);
module.exports = Bike; 