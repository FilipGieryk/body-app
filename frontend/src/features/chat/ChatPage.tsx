import { useParams } from "react-router-dom";

import { useGetChats } from "./hooks/useGetChats";

import { useUser } from "../../context/UserContext";

import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMainPanel } from "./components/ChatMainPanel";
import React, { useEffect } from "react";
import { useMarkMessagesAsRead } from "./hooks/useMarkMessagesAsRead";

const ChatPage = () => {
  const { chatId } = useParams();
  const { user, loading } = useUser();

  const {
    data,
    isLoading: chatsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetChats();

  const chats = data?.pages.flatMap((page) => page.chats) ?? [];
  const currentChat = React.useMemo(() => {
    return chats?.find((chat) => chat.chatId === chatId) ?? null;
  }, [chatId, chats]);

  if (loading || chatsLoading) return <p>Loading...</p>;
  return (
    <div className="grid w-[95%] h-full gap-x-8 rounded-xl grid-cols-[30%_70%] grid-rows-[10%_90%] ">
      <ChatSidebar
        loggedUserId={user._id}
        chats={chats}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
      <ChatMainPanel
        chatId={chatId}
        loggedUserId={user._id}
        currentChat={currentChat}
      />
    </div>
  );
};
export default ChatPage;
