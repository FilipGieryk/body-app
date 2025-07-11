import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetChats } from "./hooks/useGetChats";

import { useUser } from "../../context/UserContext";

import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMainPanel } from "./components/ChatMainPanel";

const ChatPage = () => {
  const { chatId } = useParams();

  const { data: chats, isLoading: chatsLoading } = useGetChats();
  const { user, loading } = useUser();

  if (loading || chatsLoading) return <p>Loading...</p>;
  return (
    <div className="grid w-[95%] h-full gap-x-8 rounded-xl grid-cols-[30%_70%] grid-rows-[10%_90%] ">
      <ChatSidebar loggedUserId={user._id} chats={chats} />
      <ChatMainPanel chatId={chatId} loggedUserId={user._id} chats={chats} />
    </div>
  );
};
export default ChatPage;
