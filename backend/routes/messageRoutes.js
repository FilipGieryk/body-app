const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Get all messages for a specific chat
router.get("/:chatId", messageController.getMessages);

// Add a new message to a chat
router.post("/:chatId/send", messageController.sendMessage);

// Delete a specific message
router.delete("/:messageId", messageController.deleteMessage);

// Get unread messages for a user
router.get("/unread", authenticateToken, messageController.getUnreadMessages);

// Mark messages as read
router.post(
  "/unread/mark",
  authenticateToken,
  messageController.markMessagesAsRead
);

module.exports = router;
