import React from "react";
import { Routes, Route } from "react-router-dom";
import ChatComponent from "../../components/Chats/ChatComponent";
import MessageComponent from "../../components/Chats/MessageComponent";
const ChatPage = () => {
  return (
    <div className="friends-container">
      <ChatComponent />
      <Routes>
        <Route path=":chatId" element={<MessageComponent />} />
      </Routes>
    </div>
  );
};
export default ChatPage;
