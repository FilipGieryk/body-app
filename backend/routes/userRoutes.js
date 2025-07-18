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
router.post(
  "/photos/delete",
  authenticateToken,
  userController.deleteUserPhoto
);

router.put(
  "/:id",
  authenticateToken,
  upload.single("photo"),
  userController.updateUser
);

router.get("/me", authenticateToken, userController.getCurrentUser);

router.get("/:id", userController.getUserById);

module.exports = router;
