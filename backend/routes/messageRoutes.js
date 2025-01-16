const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { broadcast } = require("../websocket");

// Get all messages for a specific chat
router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Add a new message to a chat
router.post("/:chatId/send", async (req, res) => {
  const { chatId } = req.params;
  const { senderId, content } = req.body;

  try {
    // Create the message
    const message = new Message({
      chatId,
      sender: senderId,
      content,
    });
    await message.save();

    // Notify WebSocket clients (optional)
    broadcast({
      chatId,
      senderId,
      content,
    });

    res.status(201).json({ message: "Message sent", message });
  } catch (err) {
    console.error("Error sending message", err);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Delete a specific message
router.delete("/:messageId", async (req, res) => {
  const { messageId } = req.params;

  try {
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting message", error: err.message });
  }
});

module.exports = router;
