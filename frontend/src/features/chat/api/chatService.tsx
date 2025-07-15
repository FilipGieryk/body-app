import { AxiosResponse } from "axios";
import api from "../../../shared/api/axios";
import { Chat } from "../types";

export const createOrGetChat = async (friend: {
  _id: string;
}): Promise<Chat | undefined> => {
  try {
    const response: AxiosResponse<Chat> = await api.post(
      "/chat/create-or-get",
      {
        recipientId: friend._id,
      }
    );
    return response.data;
  } catch (error) {
    console.error("error creating chat", error);
    return undefined;
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

export const markMessagesAsRead = async (chatId: string) => {
  try {
    await api.post(`/message/unread/mark`, { chatId });
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

export const fetchChats = async ({ pageParam = 1 }) => {
  const limit = 10;
  try {
    const res = await api.get(`/chat`, {
      params: { page: pageParam, limit },
    });
    return {
      chats: res.data,
      nextPage: res.data.length < limit ? null : pageParam + 1,
    };
  } catch (error) {
    console.error("error fetching chats");
  }
};
