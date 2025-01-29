const Exercise = require("../models/Exercise");

class ExerciseService {
  async createExercise(exerciseData) {
    const exercise = new Exercise(exerciseData);
    return await exercise.save();
  }

  async getAllExercises() {
    return await Exercise.find();
  }
  async getExerciseByBodyPart(bodyPart, limit) {
    return await Exercise.find({
      bodyPart: {
        $elemMatch: {
          part: bodyPart,
          scale: { $gt: 39 },
        },
      },
    })
      .sort({ averageRating: -1 })
      .limit(limit);
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
