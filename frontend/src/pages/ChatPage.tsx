import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import ChatComponent from "../components/chats/ChatComponent";
import MessageComponent from "../components/chats/MessageComponent";
import { useUser } from "../hooks/UserContext";
import { useNavigate } from "react-router-dom";
import { useGetChatMessages } from "../hooks/messages/useGetChatMessages";

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const { setChats } = useUser();

  const { data, isLoading, isError, error } = useGetChatMessages();

  if (isLoading) <p>Loading...</p>;
  if (isError) <p>Error: {error.message}</p>;

  // const markMessagesAsRead = async (chatId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.post(
  //       `/api/chat/mark-read`,
  //       { chatId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Include the authorization token if needed
  //         },
  //       }
  //     );
  //     setChats((prevChats) =>
  //       prevChats.map((chat) =>
  //         chat.chatId === chatId
  //           ? {
  //               ...chat,
  //               hasUnread: false,
  //             }
  //           : chat
  //       )
  //     );
  //     console.log("Messages marked as read");
  //   } catch (error) {
  //     console.error("Error marking messages as read:", error);
  //   }
  // };

  return (
    <div className="grid gap-y-4 w-[95%] gap-8 h-full rounded-xl grid-cols-[0.3fr 1fr] aboslute transition-all overflow-hidden">
      <ChatComponent userId={undefined} />
      <Routes>
        <Route
          path=":chatId"
          element={
            <MessageComponent
              messages={messages}
              setMessages={setMessages}
              fetchChatMessages={data}
              onSendMessage={undefined}
            />
          }
        />
      </Routes>
    </div>
  );
};
export default ChatPage;
