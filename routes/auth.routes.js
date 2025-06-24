const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user.model');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

const signToken = (user) => {
    return jwt.sign(
        { _id: user._id, name: user.name, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
    );
};

const signup = async (req, res) => {
    try {
        // Convert 'customer' role to 'user' for database consistency
        const userData = { ...req.body };
        if (userData.role === 'customer') {
            userData.role = 'user';
        }
        
        const user = new User(userData);
        await user.save();
        const token = signToken(user);
        // Do not send password back, even hashed
        user.password = undefined;
        res.status(201).json({ status: 'success', token, data: { user } });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', error: 'Please provide email and password' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', error: 'Incorrect email or password' });
        }
        const token = signToken(user);
        
        // Do not send password back
        user.password = undefined;

        res.status(200).json({ status: 'success', token, data: { user } });
    } catch (error) {
        res.status(500).json({ status: 'fail', error: error.message });
    }
};

const logout = (req, res) => {
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};

const updateDetails = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/details', protect, updateDetails);

module.exports = router; 