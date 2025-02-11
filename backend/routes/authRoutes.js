const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY; // Replace with a secure key
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
        username: savedUser.username,
        isAdmin: savedUser.isAdmin,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
