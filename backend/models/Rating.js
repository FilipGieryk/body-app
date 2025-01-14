const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "contentType",
    required: true,
  },
  contentType: {
    type: String,
    required: true,
    enum: ["Workout", "Exercise"],
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
