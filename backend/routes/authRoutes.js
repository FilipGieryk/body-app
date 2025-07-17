const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY; // Replace with a secure key
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  try {
    // Weryfikacja tokena Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      return res.status(401).json({ message: "Email not verified by Google" });
    }

    // Szukaj użytkownika po emailu
    let user = await User.findOne({ email: payload.email });

    // Jeśli nie ma, utwórz nowego użytkownika
    if (!user) {
      user = new User({
        username: payload.email, // lub payload.name
        email: payload.email,
        password: crypto.randomBytes(32).toString("hex"),
        // // jeśli model wymaga, ustaw na null lub specjalny string
        isAdmin: false,
      });
      await user.save();
    }

    // Generuj JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Ustaw JWT jako httpOnly cookie (opcjonalnie)
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 1000, // 1h
      })
      .status(200)
      .json({
        message: "Google login successful",
        token, // możesz usunąć jeśli nie chcesz wysyłać tokena do JS
        isAdmin: user.isAdmin,
      });
  } catch (error) {
    console.error("Google login error:", error);
    res
      .status(401)
      .json({ message: "Invalid Google token", error: error.message });
  }
});

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
