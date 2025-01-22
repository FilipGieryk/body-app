const workoutService = require("../services/workoutService");

class WorkoutController {
  async createWorkout(req, res) {
    const { userId } = req.params;
    const workoutData = req.body;

    try {
      const savedWorkout = await workoutService.createWorkout(
        userId,
        workoutData
      );
      res.status(201).json(savedWorkout);
    } catch (err) {
      if (err.message.includes("User not found")) {
        return res.status(404).json({ message: err.message });
      }
      if (err.message.includes("Exercise with ID")) {
        return res.status(404).json({ message: err.message });
      }
      res.status(400).json({ error: err.message });
    }
  }

  async getWorkoutById(req, res) {
    const { workoutId } = req.params;

    try {
      const workout = await workoutService.getWorkoutById(workoutId);
      res.json(workout);
    } catch (err) {
      if (err.message === "Workout not found") {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }

  async getAllWorkouts(req, res) {
    try {
      const workouts = await workoutService.getAllWorkouts();
      res.json(workouts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteWorkout(req, res) {
    const { id } = req.params;

    try {
      const deletedWorkout = await workoutService.deleteWorkout(id);
      res.json({ message: "Workout deleted", deletedWorkout });
    } catch (err) {
      if (err.message === "Workout not found") {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new WorkoutController();
