 require('dotenv').config();

const config = {
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickwheelz',
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-quickwheelz',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    razorpay: {
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
    }
};

module.exports = config;
