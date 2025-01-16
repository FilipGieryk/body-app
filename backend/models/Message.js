const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  ],
  chatType: {
    type: String,
    enum: ["private", "group"], // Define types of chats
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
