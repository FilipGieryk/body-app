import api from "../api/axios";

const URL = "/message";
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const sendMessageToServer = async ({
  content,
  chatId,
}: {
  content: string;
  chatId: string;
}) => {
  try {
    const response = await api.post(`${URL}/${chatId}/send`, { content });
    return response.data;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};
export const getMessages = async (chatId: any) => {
  try {
    const response = await api.get(`/message/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("error getting messages", error);
    throw error;
  }
};
