const Chat = require("../models/Chat");
const UnreadMessage = require("../models/UnreadMessage");

const createChat = async (participants, isGroup, groupName) => {
  const chat = new Chat({
    participants,
    isGroup,
    groupName,
  });
  return await chat.save();
};

const findPrivateChat = async (participants) => {
  const sortedParticipants = participants.sort();

  return await Chat.findOne({
    isGroup: false,
    participants: {
      $all: sortedParticipants,
      $size: sortedParticipants.length,
    },
  });
};

const getChatsForUser = async (userId) => {
  return await Chat.find({ participants: userId }).sort({ updatedAt: -1 }); // Sort by last updated
};

const getChatById = async (chatId) => {
  return await Chat.findById(chatId);
};

const updateLastMessage = async (chatId, lastMessage) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    { lastMessage, updatedAt: Date.now() },
    { new: true }
  );
};

const deleteChat = async (chatId) => {
  return await Chat.findByIdAndDelete(chatId);
};

module.exports = {
  createChat,
  getChatsForUser,
  getChatById,
  updateLastMessage,
  deleteChat,
  findPrivateChat,
};
