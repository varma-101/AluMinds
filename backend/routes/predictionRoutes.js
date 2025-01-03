const express = require("express");
const { makePrediction } = require("../controllers/predictionController");

const router = express.Router();

// Predict outputs based on user input
router.post("/predict", makePrediction);

module.exports = router;
