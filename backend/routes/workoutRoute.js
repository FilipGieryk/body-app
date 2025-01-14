const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");
const User = require("../models/User");
const mongoose = require("mongoose");

router.post("/:userId/create", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, exercises } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });
    const workoutExercises = await Promise.all(
      exercises.map(async (ex) => {
        const exercise = await Exercise.findById(ex.exercise);
        if (!exercise)
          throw new Error(`Exercise with ID ${ex.exercise} not found`);
        return {
          exercise: exercise._id,
          sets: ex.sets,
          repetitions: ex.repetitions,
          weight: ex.weight,
        };
      })
    );

    const workout = new Workout({
      name,
      exercises: workoutExercises,
      user: user._id,
    });
    const savedWorkout = await workout.save();
    user.workouts.push(savedWorkout._id);
    await user.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.get("/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: "Invalid User ID format" });
//     }

//     const user = await User.findById(userId).populate("workouts");
//     if (!user) return res.status(404).json({ message: "user not found" });
//     res.json(user.workouts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get("/:workoutId", async (req, res) => {
  try {
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId)
      .populate({
        path: "exercises.exercise",
        model: "Exercise",
      })
      .populate({
        path: "user",
        model: "User",
      });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const workout = await Workout.find()
      .populate("user", "username")
      .populate("exercises.exercise", "bodyPart");
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);
    if (!deletedWorkout)
      return res.status(404).json({ message: "workout not found" });
    res.json({ message: "workout deleted", deletedWorkout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
