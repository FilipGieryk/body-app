const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");

router.post("/", async (req, res) => {
  const { members, isGroup, groupName } = req.body;

  try {
    const newChat = new Chat({
      members,
      isGroup,
      groupName: isGroup ? groupName : null,
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating chat", error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ members: userId }).sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching chats", error: err.message });
  }
});

router.get("/details/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching chat", error: err.message });
  }
});

router.delete("/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting chat", error: err.message });
  }
});

module.exports = router;

// router.get("/", async (req, res) => {
//   try {
//     const messages = await Message.find();
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "error fetching messages" });
//   }
//   res.json(messages);
// });

// router.post("/", async (req, res) => {
//   const { userId, content } = req.body;

//   const newMessage = new Message({
//     userId,
//     content,
//   });

//   try {
//     const savedMessage = await newMessage.save(); // Save the message to the database

//     // Notify WebSocket clients
//     broadcast(savedMessage);

//     res.status(201).json({ message: "Message sent", message: savedMessage });
//   } catch (err) {
//     res.status(500).json({ message: "Error sending message" });
//   }
// });

// module.exports = router;
// add
