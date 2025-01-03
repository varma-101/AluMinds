const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passportConfig");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg"); // Import the PostgreSQL Pool module

const authRoutes = require("./routes/authRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const displayRoute = require("./routes/displayRoute");
const getDataRoute = require("./routes/getData");

const Prediction = require("./models/Prediction");

dotenv.config(); // Load environment variables
const app = express();

// Configure CORS for frontend access
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", // Replace with frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// PostgreSQL database connection
const pool = new Pool({
  connectionString: "postgresql://postgres.mfwvmagrbjjvhmwpegwu:Gopi@198123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
});

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err.message);
    process.exit(1); // Exit if database connection fails
  }
  console.log("Connected to PostgreSQL database");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/api/predictions", predictionRoutes); // Prediction routes
app.use("/display", displayRoute);
app.use("/getdata", getDataRoute);

app.post("/re-predict", async (req, res) => {
  try {
    const { uts, elongation, conductivity } = req.body;

    // Send data to Flask server for prediction
    const response = await axios.post("http://localhost:5000/reverse_predict", {
      uts,
      elongation,
      conductivity,
    });

    // Prepare the input and output objects for saving to the database
    const input = {
      uts,
      elongation,
      conductivity,
    };

    const output = {
      predictionResult: response.data.JSON, // Adjust based on your response structure
    };
  console.log(response);
    // Save the prediction record to the database
    const newPrediction = new Prediction({
      type: 'optimization', // Or 'optimization', depending on the context
      input:input,
      output:response.data,
      
    });
    await newPrediction.save();

    // Send prediction result back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error during prediction:", error.message);
    res.status(500).json({ message: "Prediction request failed" });
  }
});

app.post("/save", async (req, res) => {
  try {
    const { type, input, output } = req.body;

    // Validate input
    if (!type || !input || !output) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Create a new document
    const newEntry = new Prediction({ type, input, output });
    await newEntry.save();

    res.status(200).json(`{ message: ${type} data saved successfully! }`);
  }catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Failed to save data" });
  }
});

// Real-time data endpoint (SSE)
app.get("/realtime", (req, res) => {

  const interval = parseInt(req.query.interval);
  // Default to 1000ms if no interval is provided
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
        
  // Send a comment to keep the connection alive
  res.write(": keep-alive\n\n");

  let currentIndex = 0; // Start from the first row
  const query = "SELECT * FROM dbcsv"; // Query to fetch all rows

  // Fetch all data once
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error querying database:", err.message);
      res.write(`data: ${JSON.stringify({ error: "Database query error" })}\n\n`);
      return;
    } 

    if (!results || results.rows.length === 0) {
      console.log("No data available in the table");
      res.write(`data: ${JSON.stringify({ error: "No data available" })}\n\n`);
      return;
    }

    const intervalId = setInterval(() => {
      if (currentIndex < results.rows.length) {
        const realTimeData = results.rows[currentIndex];

        // Send the current row to the client
        res.write(`data: ${JSON.stringify(realTimeData)}\n\n`);
        
        currentIndex++; // Move to the next row
      } else {
        currentIndex = 0; // Reset to the first row to loop through the data
      }
    }, interval); // Use the dynamic interval

    // Cleanup when the client closes the connection
    req.on("close", () => {
      clearInterval(intervalId);
      console.log("Realtime connection closed");
    });
  });
});
