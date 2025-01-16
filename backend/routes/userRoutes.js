const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const upload = require("../middlewares/multer");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/:id",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (req.file) {
        const photoPatah = `/uploads/${req.file.filename}`;
        user.photos.push(photoPatah);
      }
      if (req.body.username) {
        user.username = req.body.username;
      }
      if (req.body.description) {
        user.username = req.body.description;
      }

      await user.save();
      res.status(200).json({ message: "added photo successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "error whilst updating user" });
    }
  }
);

router.delete("/:id/photos", authenticateToken, async (req, res) => {
  try {
    const { photoPath } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.photos.includes(photoPath)) {
      return res.status(404).json({ error: "photo not found in user" });
    }
    user.photos = user.photos.filter((photo) => photo != photoPath);
    await user.save();
    res.json({
      message: "photo deleted",
      photos: user.photos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("workouts")
      .populate("workoutSessions")
      .populate("friends");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
