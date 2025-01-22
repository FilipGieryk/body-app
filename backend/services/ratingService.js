const User = require("../models/User");
const Rating = require("../models/Rating");
const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");

class RatingService {
  async addOrUpdateRating(userId, contentId, rating, contentType) {
    // Validate rating range
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Validate content type
    if (!["Workout", "Exercise"].includes(contentType)) {
      throw new Error("Invalid content type");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check for existing rating
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

    // Calculate new average rating
    const ratings = await Rating.find({ content: contentId });
    const ratingCount = ratings.length;
    const averageRating =
      ratings.map((el) => el.rating).reduce((sum, r) => sum + r, 0) /
      ratingCount;

    const Model = contentType === "Workout" ? Workout : Exercise;
    await Model.findByIdAndUpdate(contentId, { averageRating, ratingCount });

    return { message: "Rating updated successfully" };
  }
}

module.exports = new RatingService();
