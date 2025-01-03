const express = require("express");
const { 
  signupUser, 
  loginUser, 
  logoutUser, 
  ensureAuth 
} = require("../controllers/authController");
const { validateSignup } = require("../middlewares/validation");

const router = express.Router();

// Public Routes (No Authentication Required)
router.post("/signup", validateSignup, signupUser);
router.post("/login", loginUser);

// Protected Routes (Authentication Required)
router.post("/logout", ensureAuth, logoutUser);

// Example Protected Routes
router.get("/dashboard", ensureAuth, (req, res) => {
  res.status(200).json({ message: "Welcome to the Dashboard!" });
});

router.get("/profile", ensureAuth, (req, res) => {
  res.status(200).json({ message: "This is your profile page." });
});

module.exports = router;
