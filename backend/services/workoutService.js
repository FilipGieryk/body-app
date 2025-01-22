const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");
const User = require("../models/User");

class WorkoutService {
  async createWorkout(userId, workoutData) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const workoutExercises = await Promise.all(
      workoutData.exercises.map(async (ex) => {
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
      name: workoutData.name,
      exercises: workoutExercises,
      user: user._id,
    });

    const savedWorkout = await workout.save();
    user.workouts.push(savedWorkout._id);
    await user.save();

    return savedWorkout;
  }

  async getWorkoutById(workoutId) {
    const workout = await Workout.findById(workoutId)
      .populate({
        path: "exercises.exercise",
        model: "Exercise",
      })
      .populate({
        path: "user",
        model: "User",
      });

    if (!workout) throw new Error("Workout not found");
    return workout;
  }

  async getAllWorkouts() {
    return await Workout.find()
      .populate("user", "username")
      .populate("exercises.exercise", "bodyPart");
  }

  async deleteWorkout(workoutId) {
    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
    if (!deletedWorkout) throw new Error("Workout not found");
    return deletedWorkout;
  }
}

module.exports = new WorkoutService();
