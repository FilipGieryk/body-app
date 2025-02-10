import axios from "axios";

export const sendMessageToServer = async (
  content: string,
  targetChatId: string
) => {
  try {
    const response = await axios.post(
      `/api/message/${targetChatId}/send`,
      content,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("failed to send message:", error);
    throw error;
  }
};

export const getMessages = async (chatId: any) => {
  try {
    const response = await axios.get(`/api/message/${chatId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("error getting messages", error);
    throw error;
  }
};
