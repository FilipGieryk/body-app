const User = require("../models/User");

class UserService {
  async updateUser(userId, updateData, photoPath) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Add photo if provided
    if (photoPath) {
      user.photos.push(photoPath);
    }

    // Update user properties
    if (updateData.username) {
      user.username = updateData.username;
    }
    if (updateData.description) {
      user.description = updateData.description; // Fixed property name
    }

    return await user.save();
  }

  async addUserPhoto(userId, files) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    files.forEach((file) => {
      user.photos.push(file.filename);
    });

    await user.save();
    return user.photos;
  }

  async deleteUserPhoto(userId, photoPath) {
    console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    if (!user.photos.includes(photoPath)) {
      throw new Error("Photo not found in user");
    }
    user.photos = user.photos.filter((photo) => photo !== photoPath);
    return await user.save();
  }

  async getUserById(userId) {
    const user = await User.findById(userId)
      .populate("workouts", "name")
      .populate("workoutSessions", "createdAt user")
      .populate("friends", "username profilePhoto");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

module.exports = new UserService();
