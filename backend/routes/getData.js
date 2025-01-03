const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction'); // Adjust path to match your project structure

// Define the /getdata endpoint
router.get('/', async (req, res) => {
    try {
        // Fetch the top 10 predictions from the database, sorted by timestamp
        const predictions = await Prediction.find().sort({ timestamp: -1 }).limit(10);

        res.status(200).json(predictions);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

module.exports = router;
