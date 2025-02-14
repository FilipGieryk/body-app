import React from "react";
import { Routes, Route } from "react-router-dom";
import ManageChatComponent from "../components/chats/ManageChatComponent";
import MessageComponent from "../components/chats/MessageComponent";

const ChatPage = () => {
  return (
    <div className="grid w-[95%] h-full gap-x-8 rounded-xl grid-cols-[30%_70%] ">
      <ManageChatComponent />
      <Routes>
        <Route path=":chatId" element={<MessageComponent />} />
      </Routes>
    </div>
  );
};
export default ChatPage;
