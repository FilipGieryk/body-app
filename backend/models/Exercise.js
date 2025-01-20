const mongoose = require("mongoose");
const multer = require("multer");

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bodyPart: {
    type: [
      {
        part: { type: String, required: true },
        scale: { type: Number, min: 0, max: 100, required: true },
      },
    ],
    set: function (parts) {
      const totalScale = parts.reduce((sum, item) => sum + item.scale, 0);
      if (totalScale > 100) {
        return parts.map((item) => ({
          ...item,
          scale: (item.scale / totalScale) * 100,
        }));
      }
      return parts;
    },
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  media: {
    type: String,
    default: "uploads/exercise.png",
  },
  videoLink: {
    type: String,
    required: false,
  },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
