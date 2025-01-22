const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post(
  "/create-or-get",
  authenticateToken,
  chatController.createOrGetChat
);
router.get("/", authenticateToken, chatController.getChats);
router.get("/:chatId", chatController.getChat);
router.patch("/:chatId/last-message", chatController.updateLastMessage);
router.delete("/:chatId", chatController.deleteChat);
router.get("/unread", chatController.getChatsWithUnreadStatus);
router.post("/mark-read", authenticateToken, chatController.markMessagesAsRead);

module.exports = router;
