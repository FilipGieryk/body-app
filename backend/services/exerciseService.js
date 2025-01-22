const Exercise = require("../models/Exercise");

class ExerciseService {
  async createExercise(exerciseData) {
    const exercise = new Exercise(exerciseData);
    return await exercise.save();
  }

  async getAllExercises() {
    return await Exercise.find();
  }

  async getExerciseById(id) {
    return await Exercise.findById(id);
  }

  async updateExercise(id, updateData) {
    return await Exercise.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteExercise(id) {
    return await Exercise.findByIdAndDelete(id);
  }
}

module.exports = new ExerciseService();
