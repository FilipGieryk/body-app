import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatComponent from "../../components/Chats/ChatComponent";
import MessageComponent from "../../components/Chats/MessageComponent";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const { setChats } = useUser();

  const fetchChatMessages = async (chatId) => {
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

  const markMessagesAsRead = async (chatId) => {
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

  return (
    <div className="grid gap-y-4 w-[95%] gap-8 h-full rounded-xl grid-cols-[0.3fr 1fr] aboslute transition-all overflow-hidden">
      <ChatComponent />
      <Routes>
        <Route
          path=":chatId"
          element={
            <MessageComponent
              messages={messages}
              setMessages={setMessages}
              fetchChatMessages={fetchChatMessages}
            />
          }
        />
      </Routes>
    </div>
  );
};
export default ChatPage;
