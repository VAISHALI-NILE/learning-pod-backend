const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Route to handle user registration
router.post("/", async (req, res) => {
  try {
    // Extract data from request body
    const { first_name, last_name, email, password, role } = req.body;

    // Validate data
    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create and save new user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
