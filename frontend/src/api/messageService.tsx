import axios from "axios";

const URL = "/api/message";
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
    const response = await axios.post(
      `${URL}/${chatId}/send`,
      { content },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};
export const getMessages = async (chatId: any) => {
  try {
    const response = await axios.get(`/api/message/${chatId}`, { headers });
    return response.data;
  } catch (error) {
    console.error("error getting messages", error);
    throw error;
  }
};
