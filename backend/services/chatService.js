const Chat = require("../models/Chat");
const UnreadMessage = require("../models/UnreadMessage");
const Message = require("../models/Message");
const User = require("../models/User");

class ChatService {
  async createChat(participants, isGroup, groupName) {
    const chat = new Chat({
      participants,
      isGroup,
      groupName,
    });
    return await chat.save();
  }

  async getChatDetails(chat, userId) {
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
      participants: chat.participants,
      lastMessage: lastMessage || null, // Include lastMessage or null if no messages
    };
  }

  async findPrivateChat(participants) {
    const sortedParticipants = participants.sort();

    return await Chat.findOne({
      isGroup: false,
      participants: {
        $all: sortedParticipants,
        $size: sortedParticipants.length,
      },
    });
  }

  async getChatsForUser(userId) {
    return await Chat.find({ participants: userId }).sort({ updatedAt: -1 }); // Sort by last updated
  }

  async getChatById(chatId) {
    return await Chat.findById(chatId);
  }

  async updateLastMessage(chatId, lastMessage) {
    return await Chat.findByIdAndUpdate(
      chatId,
      { lastMessage, updatedAt: Date.now() },
      { new: true }
    );
  }

  async deleteChat(chatId) {
    return await Chat.findByIdAndDelete(chatId);
  }
}

// Export an instance of the ChatService class
module.exports = new ChatService();
