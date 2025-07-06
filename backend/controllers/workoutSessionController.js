const workoutSessionService = require("../services/workoutSessionService");

class WorkoutSessionController {
  async addWorkoutSession(req, res) {
    const { workoutId, exercises } = req.body;
    const userId = req.user._id;
    const modifiedExercises = exercises;

    try {
      const workoutSession = await workoutSessionService.addWorkoutSession(
        userId,
        workoutId,
        modifiedExercises
      );
      res.status(201).json(workoutSession);
    } catch (error) {
      if (error.message === "Workout not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new WorkoutSessionController();
