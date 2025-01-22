const express = require("express");
const workoutController = require("../controllers/workoutController");

const router = express.Router();

router.post("/:userId/create", workoutController.createWorkout);
router.get("/:workoutId", workoutController.getWorkoutById);
router.get("/", workoutController.getAllWorkouts);
router.delete("/:id", workoutController.deleteWorkout);

module.exports = router;
