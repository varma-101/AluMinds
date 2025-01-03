const mongoose = require('mongoose');

// Define the Prediction Schema
const predictionSchema = new mongoose.Schema({
    type: String, // "prediction" or "optimization"
    input: Object,
    output: Object,
    timestamp: { type: Date, default: Date.now }
});

// Export the Model
const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;
