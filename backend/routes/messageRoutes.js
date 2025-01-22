const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/:chatId", authenticateToken, messageController.getMessages);
router.post("/:chatId/send", authenticateToken, messageController.sendMessage);
router.delete("/:messageId", messageController.deleteMessage);
router.get("/unread", authenticateToken, messageController.getUnreadMessages);
router.post(
  "/unread/mark",
  authenticateToken,
  messageController.markMessagesAsRead
);

module.exports = router;
