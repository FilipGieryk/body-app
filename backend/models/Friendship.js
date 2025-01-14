const mongoose = require("mongoose");

const friendshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  friend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
friendshipSchema.index({ user: 1, friend: 1 }, { unique: true });
const Friendship = mongoose.model("Friendship", friendshipSchema);
module.exports = Friendship;
