const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../middlewares/multer");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.put(
  "/photos",
  authenticateToken,
  upload.array("photos", 5),
  userController.addUserPhoto
);

router.put(
  "/:id",
  authenticateToken,
  upload.single("photo"),
  userController.updateUser
);
router.delete("/:id/photos", authenticateToken, userController.deleteUserPhoto);

router.get("/:id", userController.getUserById);

module.exports = router;
