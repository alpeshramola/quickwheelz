const express = require('express');
const Bike = require('../models/bike.model');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get all available cities
router.get('/cities', async (req, res) => {
    try {
        const cities = await Bike.distinct('city');
        res.status(200).json({
            status: 'success',
            data: {
                cities
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get all bikes (with optional city filter)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.city) {
            filter.city = req.query.city;
        }
        
        let bikes = await Bike.find(filter).populate({
            path: 'owner',
            select: 'name email city'
        });

        // Ensure city and address are always strings in the response
        bikes = bikes.map(bike => {
            const bikeObj = bike.toObject();
            bikeObj.city = Array.isArray(bikeObj.city) ? bikeObj.city.join(', ') : bikeObj.city;
            bikeObj.address = typeof bikeObj.address === 'string' ? bikeObj.address : JSON.stringify(bikeObj.address);
            return bikeObj;
        });

        res.status(200).json({
            status: 'success',
            results: bikes.length,
            data: {
                bikes
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Get single bike
router.get('/:id', async (req, res) => {
    try {
        let bike = await Bike.findById(req.params.id).populate({
            path: 'owner',
            select: 'name email upiId'
        });

        if (!bike) {
            return res.status(404).json({
                status: 'fail',
                message: 'No bike found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                bike
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Get all bikes by owner
router.get('/owner/:ownerId', async (req, res) => {
    try {
        const bikes = await Bike.find({ owner: req.params.ownerId });
        res.status(200).json({
            status: 'success',
            results: bikes.length,
            data: { bikes }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Create bike with image upload
router.post('/', protect, restrictTo('owner'), upload.single('image'), async (req, res) => {
    try {
        // Handle city array properly
        let cityArray = [];
        if (req.body.city) {
            // If city is sent as a single string
            if (typeof req.body.city === 'string') {
                cityArray = [req.body.city];
            } else if (Array.isArray(req.body.city)) {
                cityArray = req.body.city;
            }
        }
        
        // Handle city[] format from form data
        if (req.body['city[]']) {
            if (Array.isArray(req.body['city[]'])) {
                cityArray = req.body['city[]'];
            } else {
                cityArray = [req.body['city[]']];
            }
        }

        const bikeData = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            city: cityArray,
            address: req.body.address,
            pincode: req.body.pincode,
            owner: req.user._id,
            specifications: JSON.parse(req.body.specifications),
        };

        if (req.file) {
            bikeData.image = `/uploads/${req.file.filename}`;
        }

        const bike = new Bike(bikeData);
        await bike.save();
        
        // Populate owner details before sending response
        await bike.populate({
            path: 'owner',
            select: 'name email city'
        });
        
        res.status(201).json({ success: true, data: { bike } });
    } catch (error) {
        console.error('Error creating bike:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update bike (protected & restricted to owner)
router.put('/:id', protect, restrictTo('owner'), upload.single('image'), async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);
        
        if (!bike) {
            return res.status(404).json({
                status: 'fail',
                message: 'No bike found with that ID'
            });
        }

        // Check if the current user is the owner of the bike
        if (bike.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'fail',
                message: 'You can only update your own bikes'
            });
        }

        // Prepare update data
        let updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        // Parse specifications if sent as JSON string
        if (typeof updateData.specifications === 'string') {
            updateData.specifications = JSON.parse(updateData.specifications);
        }

        const updatedBike = await Bike.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                bike: updatedBike
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Delete bike (protected & restricted to owner)
router.delete('/:id', protect, restrictTo('owner'), async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);
        
        if (!bike) {
            return res.status(404).json({
                status: 'fail',
                message: 'No bike found with that ID'
            });
        }

        // Check if the current user is the owner of the bike
        if (bike.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'fail',
                message: 'You can only delete your own bikes'
            });
        }

        await Bike.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

module.exports = router; 