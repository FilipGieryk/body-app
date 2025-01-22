const Message = require("../models/Message");
const UnreadMessage = require("../models/UnreadMessage");
const Chat = require("../models/Chat");

class MessageService {
  async getMessagesByChatId(chatId) {
    return await Message.find({ chatId }).sort({ timestamp: 1 });
  }

  async createMessage(chatId, senderId, content) {
    const message = new Message({
      chatId,
      senderId,
      content,
    });
    await message.save();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    const recipients = chat.participants.filter(
      (userId) => !userId.equals(senderId)
    );

    const unreadMessages = recipients.map((userId) => ({
      messageId: message._id,
      chatId,
      userId,
    }));

    await UnreadMessage.insertMany(unreadMessages);
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    return message;
  }

  async deleteMessageById(messageId) {
    await Message.findByIdAndDelete(messageId);
  }

  async getUnreadMessagesForUser(userId) {
    return await UnreadMessage.find({ userId }).populate("messageId");
  }

  async markMessagesAsRead(userId, chatId) {
    await UnreadMessage.deleteMany({ userId, chatId });
  }
}

module.exports = new MessageService();
