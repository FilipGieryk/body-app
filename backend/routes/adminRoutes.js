const express = require("express");
const User = require("../models/User");
const Exercise = require("../models/Exercise");
const {
  authenticateToken,
  checkAdmin,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/users", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/users/:id", authenticateToken, checkAdmin, async (erq, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.json(deleteUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/exercises", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { name, bodyPart, media } = req.body;
    const newExercise = new Exercise({ name, bodyPart, media });
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/exercises", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
