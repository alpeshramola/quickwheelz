const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const bikeRoutes = require('./routes/bike.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Middleware
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// Serve React app for all other routes (except API and uploads)
app.get('*', (req, res) => {
    // If the request starts with /api or /uploads, skip to next middleware
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return res.status(404).json({
            success: false,
            error: 'Route not found'
        });
    }
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    // Start server only after successful DB connection
    const PORT = process.env.PORT || 5003;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
}); 