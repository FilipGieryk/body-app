const Message = require("../models/Message");
const UnreadMessage = require("../models/UnreadMessage");
const Chat = require("../models/Chat");

class MessageService {
  async getMessagesByChatId(chatId, userId, limit, page) {
    const chat = await Chat.findOne({ _id: chatId });

    if (!chat) {
      throw new Error("Chat not found");
    }

    const isMember = chat.participants.includes(userId);
    if (!isMember) {
      throw new Error("User is not a member of this chat");
    }
    const skip = (page - 1) * limit;
    const messages = await Message.find({ chatId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    return {
      messages,
      nextPage: messages.length < limit ? null : page + 1,
    };
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
