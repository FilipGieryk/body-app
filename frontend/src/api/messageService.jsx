import axios from "axios";

const sendMessageToServer = async (message, targetChatId = chatId) => {
  try {
    const response = await axios.post(
      `/api/message/${targetChatId}/send`,
      {
        content: message,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("failed to send message:", error);
    throw error;
  }
};

export const getMessages = async (chatId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`/api/message/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(response.data);
    markMessagesAsRead(chatId);
  } catch (error) {
    if (
      error.response?.status === 302 ||
      error.response?.data?.error === "User is not a member of this chat"
    ) {
      console.log("hguj");
      navigate("/chat");
    }
    console.error(error);
  }
};
