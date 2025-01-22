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

  async deleteUserPhoto(req, res) {
    const { id } = req.params;
    const { photoPath } = req.body;

    try {
      const user = await userService.deleteUserPhoto(id, photoPath);
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
}

module.exports = new UserController();
