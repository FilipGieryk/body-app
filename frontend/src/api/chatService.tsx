import axios from "axios";

const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
};

export const createOrGetChat = async (friend: { _id: any }) => {
  try {
    const response = await axios.post(
      "/api/chat/create-or-get",
      {
        recipientId: friend._id,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error creating chat", error);
  }
};

// export const createChat = async () => {
//   try {
//     const response = await axios.post(
//       `/api/chat/new-group-chat`,
//       {
//         recipientsId: groupUsers.map((user) => user._id),
//       },
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       }
//     );
//     const newChatId = response.data.chatId;
//     return newChatId;
//   } catch (error) {
//     console.error("error creating group", error);
//   }
// };

export const markMessagesAsRead = async (chatId: any) => {
  try {
    console.log(chatId);
    await axios.post(
      `/api/message/unread/mark`,
      { chatId },
      {
        headers,
      }
    );
    // setChats((prevChats) =>
    //   prevChats.map((chat) =>
    //     chat.chatId === chatId
    //       ? {
    //           ...chat,
    //           hasUnread: false,
    //         }
    //       : chat
    //   )
    // );
    console.log("Messages marked as read");
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

export const fetchChats = async () => {
  try {
    const response = await axios.get(`/api/chat`, { headers });
    return response.data;
  } catch (error) {
    console.error("error fetching chats");
  }
};
