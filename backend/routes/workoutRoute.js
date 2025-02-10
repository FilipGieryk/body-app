const express = require("express");
const workoutController = require("../controllers/workoutController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, workoutController.createWorkout);
router.get("/get-workouts", workoutController.getWorkoutsByIds);
router.get("/", workoutController.getAllWorkouts);
router.get("/:workoutId", workoutController.getWorkoutById);
router.delete("/:id", workoutController.deleteWorkout);

module.exports = router;
