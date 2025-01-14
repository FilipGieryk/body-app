const mongoose = require("mongoose");

const WorkoutSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
  },
  modifiedExercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
        required: true,
      },
      sets: { type: Number },
      repetitions: { type: Number },
      weight: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const WorkoutSession = mongoose.model("WorkoutSession", WorkoutSessionSchema);
module.exports = WorkoutSession;
