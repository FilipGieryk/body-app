const Message = require("../models/Message");
const UnreadMessage = require("../models/UnreadMessage");
const Chat = require("../models/Chat");

const getMessagesByChatId = async (chatId) => {
  return await Message.find({ chatId }).sort({ timestamp: 1 });
};

const createMessage = async (chatId, senderId, content) => {
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
};

const deleteMessageById = async (messageId) => {
  await Message.findByIdAndDelete(messageId);
};

const getUnreadMessagesForUser = async (userId) => {
  return await UnreadMessage.find({ userId }).populate("messageId");
};

const markMessagesAsRead = async (userId, chatId) => {
  await UnreadMessage.deleteMany({ userId, chatId });
};

module.exports = {
  getMessagesByChatId,
  createMessage,
  deleteMessageById,
  getUnreadMessagesForUser,
  markMessagesAsRead,
};
