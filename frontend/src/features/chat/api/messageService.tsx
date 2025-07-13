import api from "../../../shared/api/axios";

const URL = "/message";

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
export const getMessages = async ({ queryKey, pageParam = 1 }) => {
  const [, chatId] = queryKey;
  const limit = 10;
  try {
    const response = await api.get(`/message/${chatId}`, {
      params: { page: pageParam, limit },
    });
    return response.data;
  } catch (error) {
    console.error("error getting messages", error);
    throw error;
  }
};
