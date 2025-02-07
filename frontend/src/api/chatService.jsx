import axios from "axios";

export const createOrGetChat = async (friend) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "/api/chat/create-or-get",
      {
        recipientId: friend._id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // navigate(`/chat/${response.data.chatId}`);
  } catch (error) {
    console.error("error creating chat", error);
  }
};

export const createChat = async () => {
  try {
    const response = await axios.post(
      `/api/chat/new-group-chat`,
      {
        recipientsId: groupUsers.map((user) => user._id),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const newChatId = response.data.chatId;
    return newChatId;
  } catch (error) {
    console.error("error creating group", error);
  }
};

export const markMessagesAsRead = async (chatId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `/api/chat/mark-read`,
      { chatId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authorization token if needed
        },
      }
    );
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              hasUnread: false,
            }
          : chat
      )
    );
    console.log("Messages marked as read");
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};
