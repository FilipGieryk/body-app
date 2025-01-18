const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  isGroup: {
    type: Boolean,
    default: false,
  },
  groupName: String,
  lastMessage: {
    type: String, // Optional: Store a summary of the last message for quick access
  },
  lastRead: {
    type: Map,
    of: Date, // Maps user IDs to their last read timestamps
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", ChatSchema);
