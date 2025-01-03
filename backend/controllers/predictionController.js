const Prediction = require("../models/Prediction");
const axios = require("axios");

exports.makePrediction = async (req, res) => {
  const { parameters, chemicalComposition } = req.body;

  try {
  
    
    const response = await axios.post("http://localhost:3000/predict", {  parameters,
      chemicalComposition });
    const outputs = response.data;

    const prediction = new Prediction({ parameters, outputs });
    await prediction.save();

    res.status(200).json({ message: "Prediction successful", outputs });
  } catch (error) {
    res.status(500).json({ message: "Prediction failed", error });
  }
};
