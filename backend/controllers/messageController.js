const MessageService = require("../services/messageService");
const { broadcast } = require("../websocket");

// Controller to handle sending a message
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await MessageService.getMessagesByChatId(chatId);
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { senderId, content } = req.body;

  try {
    const message = await MessageService.createMessage(
      chatId,
      senderId,
      content
    );

    // Optionally notify WebSocket clients
    broadcast({
      chatId,
      senderId,
      content,
    });

    res.status(201).json({ message: "Message sent", message });
  } catch (err) {
    console.error("Error sending message", err);
    res.status(500).json({ message: "Error sending message" });
  }
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    await MessageService.deleteMessageById(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message", err);
    res
      .status(500)
      .json({ message: "Error deleting message", error: err.message });
  }
};

const getUnreadMessages = async (req, res) => {
  const userId = req.user._id; // Assuming user is attached to the request after authentication

  try {
    const unreadMessages = await MessageService.getUnreadMessagesForUser(
      userId
    );
    res.status(200).json(unreadMessages);
  } catch (err) {
    console.error("Error fetching unread messages", err);
    res.status(500).json({ message: "Error fetching unread messages" });
  }
};

const markMessagesAsRead = async (req, res) => {
  const userId = req.user._id; // Assuming user is attached to the request after authentication
  const { chatId } = req.body;

  try {
    await MessageService.markMessagesAsRead(userId, chatId);
    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    console.error("Error marking messages as read", err);
    res.status(500).json({ message: "Error marking messages as read" });
  }
};

// Export controller functions
module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
  getUnreadMessages,
  markMessagesAsRead,
};
