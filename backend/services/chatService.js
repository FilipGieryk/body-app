const Chat = require("../models/Chat");
const UnreadMessage = require("../models/UnreadMessage");
const Message = require("../models/Message");
const User = require("../models/User");

const createChat = async (participants, isGroup, groupName) => {
  const chat = new Chat({
    participants,
    isGroup,
    groupName,
  });
  return await chat.save();
};

const getChatDetails = async (chat, userId) => {
  const lastMessage = await Message.findOne({ chatId: chat._id })
    .sort({ timestamp: -1 })
    .lean();

  const unreadMessages = await UnreadMessage.find({ userId });
  const unreadChatIds = new Set(
    unreadMessages.map((um) => um.chatId.toString())
  );

  let chatName;
  let profilePhoto;

  if (chat.isGroup) {
    chatName = chat.groupName;
    profilePhoto = chat.groupProfilePhoto;
  } else {
    const otherParticipantId = chat.participants.find(
      (participantId) => participantId.toString() !== userId.toString()
    );
    const otherUser = await User.findById(otherParticipantId).lean();
    chatName = otherUser.username;
    profilePhoto = otherUser.profilePhoto;
  }

  return {
    chatId: chat._id,
    chatName,
    profilePhoto,
    hasUnread: unreadChatIds.has(chat._id.toString()),
    lastMessage: lastMessage || null, // Include lastMessage or null if no messages
  };
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
  getChatDetails,
  getChatsForUser,
  getChatById,
  updateLastMessage,
  deleteChat,
  findPrivateChat,
};
