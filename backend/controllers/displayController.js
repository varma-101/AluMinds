const Prediction = require('../models/Prediction'); // Import the Prediction model

// Controller to handle fetching data from the database
const displayController = async (req, res) => {
    try {
        // Fetch all predictions from the database
        const predictions = await Prediction.find(); // This retrieves all predictions

        // Send the fetched data as a response
        res.json(predictions);  // Send predictions as JSON to the client
    } catch (error) {
        console.error("Error fetching predictions data:", error);
        res.status(500).json({ message: "Failed to fetch predictions" });  // Handle errors
    }
};

module.exports = displayController;
