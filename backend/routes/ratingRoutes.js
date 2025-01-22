const express = require("express");
const ratingController = require("../controllers/ratingController");

const router = express.Router();

router.post("/:contentId", ratingController.addOrUpdateRating);

module.exports = router;
