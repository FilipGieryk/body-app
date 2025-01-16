const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { broadcast } = require("../websocket");

// Get all messages for a specific chat
router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: err.message });
  }
});

// Add a new message to a chat
router.post("/", async (req, res) => {
  const { chatId, senderId, content } = req.body;

  try {
    const newMessage = new Message({
      chatId,
      senderId,
      content,
    });

    const savedMessage = await newMessage.save();

    // Update the chat's lastMessage and timestamp
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    broadcast({
      type: "new_message",
      chatId,
      message: savedMessage,
    });

    res.status(201).json({ message: "Message sent", data: savedMessage });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending message", error: err.message });
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
