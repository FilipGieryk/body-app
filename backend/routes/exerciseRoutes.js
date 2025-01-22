const express = require("express");
const exerciseController = require("../controllers/exerciseController");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/", upload.single("media"), exerciseController.createExercise);
router.get("/", exerciseController.getAllExercises);
router.get("/:id", exerciseController.getExerciseById);
router.put("/:id", exerciseController.updateExercise);
router.delete("/:id", exerciseController.deleteExercise);

module.exports = router;
