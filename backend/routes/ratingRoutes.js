const express = require("express");
const ratingController = require("../controllers/ratingController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/:contentId",
  authenticateToken,
  ratingController.addOrUpdateRating
);

module.exports = router;
