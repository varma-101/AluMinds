const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Attendance=require("../models/Attendance")
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Registration failed.", error: error.message });
  }
};


// Middleware to ensure authentication
exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Signup logic
exports.signupUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      password: hashedPassword,
    });

    await user.save();

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Signup successful, but login failed", err });
      }
      res.status(201).json({ message: "Signup successful", user });
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
};

// Login logic
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return res.status(500).json({ message: "Authentication error", err });
    if (!user) return res.status(400).json({ message: info.message });

    req.login(user, async (loginErr) => {
      if (loginErr) return res.status(500).json({ message: "Login failed", loginErr });

      try {
        // Create a new Attendance record for this login
        const attendance = new Attendance({
          user: user._id,
          email: user.email,
          loginTime: new Date(),
        });
        await attendance.save();

        res.status(200).json({ message: "Login successful", attendance });
      } catch (error) {
        res.status(500).json({ message: "Failed to log attendance", error });
      }
    });
  })(req, res, next);
};



//logout
exports.logoutUser = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const { _id } = req.user;

    // Find the latest attendance entry without a logoutTime
    const attendance = await Attendance.findOne({
      user: _id,
      logoutTime: null,
    }).sort({ loginTime: -1 });

    if (!attendance) {
      return res.status(400).json({ message: "No active login session found." });
    }

    // Update the logoutTime
    attendance.logoutTime = new Date();
    await attendance.save();

    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed", err });
      res.status(200).json({ message: "Logout successful", attendance });
    });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};

