const chatService = require("../services/chatService");
const UnreadMessage = require("../models/UnreadMessage");
const MessageService = require("../services/messageService");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

class ChatController {
  async createOrGetChat(req, res) {
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
      return res
        .status(201)
        .json(await chatService.getChatDetails(chat, userId));
    } catch (err) {
      console.error("Error creating chat", err);
      res.status(500).json({ message: "Error creating chat" });
    }
  }
  async createGroupChat(req, res) {
    try {
      const { recipientId, groupName } = req.body;
      const userId = req.user._id;
      const participants = [recipientId, userId];

      chat = await chatService.createChat(
        participants,
        (isGroup = true),
        groupName
      );
      return res
        .status(201)
        .json(await chatService.getChatDetails(chat, userId));
    } catch (err) {
      console.error("Error creating chat", err);
      res.status(500).json({ message: "Error creating chat" });
    }
  }

  async getChats(req, res) {
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
  }

  async getChat(req, res) {
    const { chatId } = req.params;
    const userId = req.user._id;

    try {
      const chat = await Chat.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(chatId) } },
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

      if (!chat || chat.length === 0) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const chatWithDetails = await chatService.getChatDetails(chat[0], userId);

      res.status(200).json(chatWithDetails);
    } catch (err) {
      console.error("Error fetching chat", err);
      res.status(500).json({ message: "Error fetching chat" });
    }
  }
  async updateLastMessage(req, res) {
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
  }

  async deleteChat(req, res) {
    const { chatId } = req.params;

    try {
      await chatService.deleteChat(chatId);
      res.status(200).json({ message: "Chat deleted successfully" });
    } catch (err) {
      console.error("Error deleting chat", err);
      res.status(500).json({ message: "Error deleting chat" });
    }
  }

  async getChatsWithUnreadStatus(req, res) {
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
  }

  async markMessagesAsRead(req, res) {
    const userId = req.user._id;
    const { chatId } = req.body;

    try {
      await MessageService.markMessagesAsRead(userId, chatId);
      res.status(200).json({ message: "Messages marked as read" });
    } catch (err) {
      console.error("Error marking messages as read", err);
      res.status(500).json({ message: "Error marking messages as read" });
    }
  }
}

// Export an instance of the ChatController class
module.exports = new ChatController();
