const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");
const Rating = require("../models/Rating");

router.post("/:contentId", async (req, res) => {
  const { userId, rating, contentType } = req.body;
  const { contentId } = req.params;
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating must be between 1 and 5" });
  }
  if (!["Workout", "Exercise"].includes(contentType)) {
    return res.status(400).json({ message: "Invalid content type" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRating = await Rating.findOne({
      content: contentId,
      user: userId,
    });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      const newRating = new Rating({
        content: contentId,
        contentType,
        user: userId,
        rating,
      });
      await newRating.save();
    }

    const ratings = await Rating.find({ content: contentId });
    const ratingCount = ratings.length;
    const averageRating =
      ratings.map((el) => el.rating).reduce((sum, r) => sum + r, 0) /
      ratingCount;
    const Model = contentType === "Workout" ? Workout : Exercise;
    await Model.findByIdAndUpdate(contentId, { averageRating, ratingCount });

    res.status(200).json({ message: "rating updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
