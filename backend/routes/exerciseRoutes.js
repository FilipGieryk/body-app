const express = require("express");
const exerciseController = require("../controllers/exerciseController");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/", upload.single("media"), exerciseController.createExercise);
router.get("/", exerciseController.getAllExercises);
router.get("/detail/:id", exerciseController.getExerciseById);
router.get("/body-part", exerciseController.getExercisesByBodyPart);
router.put("/:id", exerciseController.updateExercise);
router.delete("/:id", exerciseController.deleteExercise);

module.exports = router;
