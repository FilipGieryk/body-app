const Workout = require("../models/Workout");
const WorkoutSession = require("../models/WorkoutSession");
const User = require("../models/User");

class WorkoutSessionService {
  async addWorkoutSession(userId, workoutId, modifiedExercises) {
    const workout = await Workout.findById(workoutId).populate(
      "exercises.exercise"
    );

    if (!workout) {
      throw new Error("Workout not found");
    }

    const areArraysIdentical = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;

      const extractAndSort = (arr) =>
        arr
          .map((item) => item.exercise)
          .sort((a, b) => String(a._id).localeCompare(b._id));

      const sorted1 = extractAndSort(arr1);
      const sorted2 = extractAndSort(arr2);

      return sorted1.every((exercise, index) => {
        const otherExercise = sorted2[index];
        return JSON.stringify(exercise) === JSON.stringify(otherExercise);
      });
    };

    const isStructureChanged = !areArraysIdentical(
      workout.exercises,
      modifiedExercises
    );
    let newWorkoutId = workoutId;

    if (isStructureChanged) {
      const newWorkout = new Workout({
        name: `${workout.name} (Modified)`,
        exercises: modifiedExercises.map((mod) => ({
          exercise: mod._id,
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
        ? modifiedExercises.filter((mod) => mod.sets !== undefined)
        : [],
    });

    await workoutSession.save();

    const user = await User.findById(userId);
    user.workoutSessions.push(workoutSession._id);
    await user.save();

    return workoutSession;
  }
}

module.exports = new WorkoutSessionService();
