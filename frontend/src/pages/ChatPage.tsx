import React, { useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import ManageChatComponent from "../components/chats/ManageChatComponent";
import MessageComponent from "../components/chats/MessageComponent";

import { useGetChats } from "../hooks/fetch/chats/useGetChats";
import { ChatComponent } from "../components/chats/ChatComponent";
import { useGetUser } from "../hooks/fetch/useGetUser";
import { useGetChatMessages } from "../hooks/fetch/messages/useGetChatMessages";
import UserInformation from "../components/userProfile/UserInformation";

const ChatPage = () => {
  const { chatId } = useParams();

  const { data: chats, isLoading: chatsLoading } = useGetChats();
  const { data: userData } = useGetUser(chatId, { enabled: !!chatId });
  const { data: messages } = useGetChatMessages(chatId, { enabled: !!chatId });

  return (
    <div className="grid w-[95%] h-full gap-x-8 rounded-xl grid-cols-[30%_70%] ">
      <div>
        <ManageChatComponent />
        <ChatComponent chats={chats} chatsLoading={chatsLoading} />
      </div>
      <div>
        {userData && <UserInformation userInfo={userData} />}
        {messages && <MessageComponent messages={messages} />}
      </div>
    </div>
  );
};
export default ChatPage;
