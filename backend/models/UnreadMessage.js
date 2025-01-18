const mongoose = require("mongoose");

const UnreadMessageSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message", // Reference to the Message model
    required: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat", // Reference to the Chat model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // The user for whom the message is unread
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp when the unread message was created
  },
});
const UnreadMessage = mongoose.model("UnreadMessage", UnreadMessageSchema);

module.exports = UnreadMessage;
