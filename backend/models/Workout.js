const mongoose = require("mongoose");

const WorkoutExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  sets: { type: Number, required: true },
  repetitions: { type: Number, required: true },
  weight: { type: Number, default: 0 },
});

const WorkoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  exercises: {
    type: [WorkoutExerciseSchema],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: false },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  media: {
    type: String,
    default: "uploads/workout.jpg",
  },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  bodyPart: {
    type: [
      {
        part: { type: String, required: true },
        scale: { type: Number, min: 0, max: 100, required: true },
      },
    ],
  },
  originalWorkout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
    required: false,
  },
});

WorkoutSchema.pre("save", async function (next) {
  try {
    const bodyPartMap = {};

    const exercises = await mongoose
      .model("Exercise")
      .find({ _id: { $in: this.exercises.map((e) => e.exercise) } });

    exercises.forEach((exercise) => {
      exercise.bodyPart.forEach(({ part, scale }) => {
        if (bodyPartMap[part]) {
          bodyPartMap[part] += scale;
        } else {
          bodyPartMap[part] = scale;
        }
      });
    });

    this.bodyPart = Object.entries(bodyPartMap).map(([part, scale]) => ({
      part,
      scale,
    }));

    next();
  } catch (error) {
    next(error);
  }
});

const Workout = mongoose.model("Workout", WorkoutSchema);
module.exports = Workout;
