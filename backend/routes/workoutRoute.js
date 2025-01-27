const express = require("express");
const workoutController = require("../controllers/workoutController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authenticateToken, workoutController.createWorkout);
router.get("/:workoutId", workoutController.getWorkoutById);
router.get("/", workoutController.getAllWorkouts);
router.delete("/:id", workoutController.deleteWorkout);

module.exports = router;
