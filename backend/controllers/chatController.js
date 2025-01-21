const chatService = require("../services/chatService");
const UnreadMessage = require("../models/UnreadMessage");
const MessageService = require("../services/messageService");
const User = require("../models/User");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

const createOrGetChat = async (req, res) => {
  const { recipientId, isGroup, groupName } = req.body;
  const userId = req.user._id;
  const participants = [recipientId, userId];
  try {
    let chat;
    if (!isGroup) {
      chat = await chatService.findPrivateChat(participants);
      if (chat) {
        return res
          .status(200)
          .json(await chatService.getChatDetails(chat, userId));
      }
    }
    chat = await chatService.createChat(participants, isGroup, groupName);
    return res.status(201).json(await chatService.getChatDetails(chat, userId));
  } catch (err) {
    console.error("Error creating chat", err);
    res.status(500).json({ message: "Error creating chat" });
  }
};

const getChats = async (req, res) => {
  const userId = req.user._id;
  try {
    const chats = await Chat.aggregate([
      { $match: { participants: new mongoose.Types.ObjectId(userId) } },

      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
            { $sort: { timestamp: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },

      { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          chatId: "$_id",
          isGroup: 1,
          groupName: 1,
          groupProfilePhoto: 1,
          participants: 1,
          lastMessage: 1,
        },
      },
    ]);

    const chatsWithDetails = await Promise.all(
      chats.map(async (chat) => chatService.getChatDetails(chat, userId))
    );

    res.status(200).json(chatsWithDetails);
  } catch (err) {
    console.error("Error fetching chats", err);
    res.status(500).json({ message: "Error fetching chats" });
  }
};

// Get chat by ID
const getChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await chatService.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat", err);
    res.status(500).json({ message: "Error fetching chat" });
  }
};

const updateLastMessage = async (req, res) => {
  const { chatId } = req.params;
  const { lastMessage } = req.body;

  try {
    const updatedChat = await chatService.updateLastMessage(
      chatId,
      lastMessage
    );
    res.status(200).json(updatedChat);
  } catch (err) {
    console.error("Error updating last message", err);
    res.status(500).json({ message: "Error updating last message" });
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    await chatService.deleteChat(chatId);
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat", err);
    res.status(500).json({ message: "Error deleting chat" });
  }
};

const getChatsWithUnreadStatus = async (req, res) => {
  const userId = req.user._id; // Assuming user is attached to the request after authentication

  try {
    const chats = await chatService.getChatsForUser(userId);
    const unreadMessages = await UnreadMessage.find({ userId });

    const unreadChatIds = new Set(
      unreadMessages.map((um) => um.chatId.toString())
    );

    const chatsWithUnreadStatus = chats.map((chat) => ({
      chatId: chat._id,
      chatName:
        chat.groupName || chat.participants.map((p) => p.username).join(", "),
      hasUnread: unreadChatIds.has(chat._id.toString()),
    }));

    res.status(200).json(chatsWithUnreadStatus);
  } catch (err) {
    console.error("Error fetching chats with unread status", err);
    res
      .status(500)
      .json({ message: "Error fetching chats with unread status" });
  }
};

const markMessagesAsRead = async (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.body;
  try {
    await MessageService.markMessagesAsRead(userId, chatId);
    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    console.error("Error marking messages as read", err);
    res.status(500).json({ message: "Error marking messages as read" });
  }
};

module.exports = {
  createOrGetChat,
  getChats,
  getChat,
  updateLastMessage,
  deleteChat,
  getChatsWithUnreadStatus,
  markMessagesAsRead,
};
