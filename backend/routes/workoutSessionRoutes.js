const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const workoutSessionController = require("../controllers/workoutSessionController");

const router = express.Router();

router.post(
  "/add",
  authenticateToken,
  workoutSessionController.addWorkoutSession
);

module.exports = router;
