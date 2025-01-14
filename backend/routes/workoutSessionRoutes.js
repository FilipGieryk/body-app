const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const WorkoutSession = require("../models/WorkoutSession");
const User = require("../models/User");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/add", authenticateToken, async (req, res) => {
  const { workoutId, modifiedExercises } = req.body;
  const userId = req.user._id;

  try {
    const workout = await Workout.findById(workoutId).populate(
      "exercises.exercise"
    );
    console.log(workoutId);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    const areArraysIdentical = (arr1, arr2) => {
      // Check if lengths differ
      if (arr1.length !== arr2.length) return false;

      const extractAndSort = (arr) =>
        arr
          .map((item) => item.exercise) // Extract the `exercise` object
          .sort((a, b) => String(a._id).localeCompare(b._id)); // Sort by `_id`

      const sorted1 = extractAndSort(arr1);
      const sorted2 = extractAndSort(arr2);

      // Compare each corresponding item in the sorted arrays
      return sorted1.every((exercise, index) => {
        const otherExercise = sorted2[index];

        // Compare exercises deeply
        return JSON.stringify(exercise) === JSON.stringify(otherExercise);
      });
    };
    const isStructureChanged = !areArraysIdentical(
      workout.exercises,
      modifiedExercises
    );
    let newWorkoutId = workoutId;

    if (isStructureChanged) {
      // Create a new workout

      const newWorkout = new Workout({
        name: `${workout.name} (Modified)`,
        exercises: modifiedExercises.map((mod) => ({
          exercise: mod.exercise,
          sets: mod.sets || 0,
          repetitions: mod.repetitions || 0,
          weight: mod.weight || 0,
        })),
        user: userId,
        description: workout.description,
        originalWorkout: workoutId,
      });
      await newWorkout.save();
      newWorkoutId = newWorkout._id;
    }

    const workoutSession = new WorkoutSession({
      user: userId,
      workout: newWorkoutId,
      modifiedExercises: !isStructureChanged
        ? modifiedExercises.filter((mod) => mod.sets !== undefined) // Save only changed sets/reps/weight
        : [],
    });

    await workoutSession.save();

    const user = await User.findById(userId);
    user.workoutSessions.push(workoutSession._id);
    await user.save();

    res.status(201).json(workoutSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
