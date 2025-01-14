const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  profilePhoto: {
    type: String,
    default: "/uploads/blank-profile.webp",
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photos: {
    type: [String],
    default: [],
  },
  workouts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
    },
  ],
  workoutSessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutSession",
    },
  ],
  isAdmin: { type: Boolean, default: false },
  cretedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
