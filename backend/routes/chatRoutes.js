const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");

router.post("/create-or-get", async (req, res) => {
  const { senderId, recipientId, isGroup = false } = req.body;

  try {
    // Check if the chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
      isGroup: !!isGroup,
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        participants: isGroup
          ? [senderId, ...recipientId]
          : [senderId, recipientId],
        isGroup: !!isGroup,
      });
      await chat.save();
    }

    // Return the chat information
    res.status(200).json({ chatId: chat._id });
  } catch (err) {
    console.error("Error creating or getting chat", err);
    res.status(500).json({ message: "Error creating or getting chat" });
  }
});
// get chat for certain user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("test");
  try {
    const chats = await Chat.find({
      participants: userId,
    });
    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching chats", err);
    res.status(500).json({ message: "Error fetching chats" });
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
