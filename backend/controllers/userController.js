const userService = require("../services/userService");

class UserController {
  async updateUser(req, res) {
    const { id } = req.params;
    const { username, description } = req.body;
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const updatedUser = await userService.updateUser(
        id,
        { username, description },
        photoPath
      );
      res
        .status(200)
        .json({ message: "Added photo successfully", user: updatedUser });
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Error while updating user" });
    }
  }

  async addUserPhoto(req, res) {
    try {
      const userId = req.user._id;
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploadade" });
      }

      const addedPhotos = await userService.addUserPhoto(userId, files);
      res
        .status(200)
        .json({ message: "Photo added successfully", photo: addedPhotos });
    } catch (err) {
      console.error("Failed to add photo:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteUserPhoto(req, res) {
    const id = req.user._id;
    const { photos } = req.body;
    try {
      const user = await userService.deleteUserPhoto(id, photos);
      res.json({
        message: "Photo deleted",
        photos: user.photos,
      });
    } catch (err) {
      if (
        err.message === "User not found" ||
        err.message === "Photo not found in user"
      ) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }

  async getCurrentUser(req, res) {
    const userId = req.user._id;
    try {
      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
