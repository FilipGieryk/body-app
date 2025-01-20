const express = require("express");
const Exercise = require("../models/Exercise");
const router = express.Router();
const upload = require("../middlewares/multer");

router.post("/", upload.single("media"), async (req, res) => {
  try {
    const parsedBodyPart = JSON.parse(req.body.bodyPart);
    const { name, bodyPart, videoLink } = req.body;
    const exercise = new Exercise({
      name,
      bodyPart: parsedBodyPart,
      media: req.file?.path,
      videoLink,
    });
    const savedExercise = await exercise.save();
    res.status(201).json(savedExercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const exercises = await Exercise.findById(req.params.id);
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedExercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    res.json(deletedExercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
