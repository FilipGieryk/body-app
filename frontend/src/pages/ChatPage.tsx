import React, { useEffect, useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import ManageChatComponent from "../components/chats/ManageChatComponent";
import MessageComponent from "../components/chats/MessageComponent";

import { useGetChats } from "../hooks/fetch/chats/useGetChats";
import { ChatComponent } from "../components/chats/ChatComponent";
import { useGetUser } from "../hooks/fetch/useGetUser";
import { useGetChatMessages } from "../hooks/fetch/messages/useGetChatMessages";
import UserInformation from "../components/userProfile/UserInformation";
import { useUser } from "../context/UserContext";
import { getOtherParticipants } from "../utils/chatUtils";

const ChatPage = () => {
  const { chatId } = useParams();
  const { data: chats, isLoading: chatsLoading } = useGetChats();
  const { user } = useUser();
  const { data: messages, isLoading: messagesLoading } = useGetChatMessages(
    chatId,
    { enabled: !!chatId }
  );

  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    if (chatId && chats) {
      const foundChat = chats?.find((chat) => chat.chatId === chatId);
      setCurrentChat(foundChat || null);
    }
  }, [chatId, chats]);

  const participants = React.useMemo(() => {
    if (!currentChat || !user?._id) return null;
    return getOtherParticipants(currentChat.participants, user._id);
  }, [currentChat, user]);

  return (
    <div className="grid w-[95%] h-full gap-x-8 rounded-xl grid-cols-[30%_70%] grid-rows-[10%_90%] ">
      <div>
        <ManageChatComponent />
        <ChatComponent chats={chats} chatsLoading={chatsLoading} />
      </div>
      <div>
        {currentChat && (
          <UserInformation
            username={currentChat.chatName}
            profilePhoto={currentChat.profilePhoto}
          />
        )}
        {messages && (
          <MessageComponent
            otherParticipants={participants}
            messages={messages}
            messagesLoading={messagesLoading}
          />
        )}
      </div>
    </div>
  );
};
export default ChatPage;
