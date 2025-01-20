const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Create a new chat
router.post(
  "/create-or-get",
  authenticateToken,
  chatController.createOrGetChat
);

// Get all chats for the user
router.get("/", authenticateToken, chatController.getChats);

// Get a chat by ID
router.get("/:chatId", chatController.getChat);

// Update the last message in a chat
router.patch("/:chatId/last-message", chatController.updateLastMessage);

// Delete a chat
router.delete("/:chatId", chatController.deleteChat);

// Get all chats with unread message status
router.get("/unread", chatController.getChatsWithUnreadStatus);

router.post("/mark-read", authenticateToken, chatController.markMessagesAsRead);

module.exports = router;
