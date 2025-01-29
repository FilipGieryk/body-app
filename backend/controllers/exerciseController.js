const exerciseService = require("../services/exerciseService");

class ExerciseController {
  async createExercise(req, res) {
    try {
      const parsedBodyPart = JSON.parse(req.body.bodyPart);
      const { name, videoLink } = req.body;
      const exerciseData = {
        name,
        bodyPart: parsedBodyPart,
        media: req.file?.path,
        videoLink,
      };

      const savedExercise = await exerciseService.createExercise(exerciseData);
      res.status(201).json(savedExercise);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllExercises(req, res) {
    try {
      const exercises = await exerciseService.getAllExercises();
      res.json(exercises);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getExercisesByBodyPart(req, res) {
    const { bodyPart, limit } = req.query;

    if (!bodyPart) {
      return res.status(400).json({ error: "bodyPart is required" });
    }
    try {
      const exercises = await exerciseService.getExerciseByBodyPart(
        bodyPart,
        limit
      );
      res.json(exercises);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getExerciseById(req, res) {
    try {
      const exercise = await exerciseService.getExerciseById(req.params.id);
      if (!exercise)
        return res.status(404).json({ message: "Exercise not found" });
      res.json(exercise);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateExercise(req, res) {
    try {
      const updatedExercise = await exerciseService.updateExercise(
        req.params.id,
        req.body
      );
      if (!updatedExercise)
        return res.status(404).json({ message: "Exercise not found" });
      res.json(updatedExercise);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteExercise(req, res) {
    try {
      const deletedExercise = await exerciseService.deleteExercise(
        req.params.id
      );
      if (!deletedExercise)
        return res.status(404).json({ message: "Exercise not found" });
      res.json(deletedExercise);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ExerciseController();
