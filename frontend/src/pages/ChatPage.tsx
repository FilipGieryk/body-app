import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ManageChatComponent from "../components/chats/ManageChatComponent";
import MessageComponent from "../components/chats/MessageComponent";

import { useGetChats } from "../hooks/fetch/chats/useGetChats";
import { ChatComponent } from "../components/chats/ChatComponent";

import UserInformation from "../components/userProfile/UserInformation";
import { useUser } from "../context/UserContext";
import { getOtherParticipants, getSortedChats } from "../utils/chatUtils";
import { FriendRequest } from "../components/chats/FriendRequest";
import FriendsSearch from "../components/chats/FriendsSearch";
import { useMarkMessagesAsRead } from "../hooks/fetch/useMarkMessagesAsRead";
import { useFriendRequests } from "../context/FriendRequestsContext";

const ChatPage = () => {
  const { chatId } = useParams();
  const { data: chats, isLoading: chatsLoading } = useGetChats();
  const { user, loading } = useUser();
  const { friendRequests, acceptRequest, declineRequest } = useFriendRequests();
  const markAsRead = useMarkMessagesAsRead();
  const [activeTab, setActiveTab] = useState("chats");

  const currentChat = React.useMemo(() => {
    return chats?.find((chat) => chat.chatId === chatId || null);
  }, [chatId, chats]);

  useEffect(() => {
    if (currentChat?.hasUnread) {
      markAsRead.mutate(currentChat.chatId);
    }
  }, [currentChat, markAsRead]);

  const participants = React.useMemo(() => {
    if (!currentChat || !user?._id) return null;
    return getOtherParticipants(currentChat.participants, user._id);
  }, [currentChat, user]);

  const sortedChats = getSortedChats(chats);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid w-[95%] h-full gap-x-8 rounded-xl grid-cols-[30%_70%] grid-rows-[10%_90%] ">
      <div>
        <ManageChatComponent
          friendRequests={friendRequests}
          setActiveTab={setActiveTab}
          loggedUserId={user._id}
        />
        <FriendsSearch />
        {activeTab === "chats" ? (
          <ChatComponent chats={sortedChats} />
        ) : (
          <FriendRequest
            friendRequests={friendRequests}
            acceptRequest={acceptRequest}
            declineRequest={declineRequest}
          />
        )}
      </div>
      <div className="row-start-1 row-end-2 col-start-2">
        {currentChat && (
          <UserInformation
            username={currentChat.chatName ?? "unknown"}
            // add default avaqter
            profilePhoto={currentChat.profilePhoto ?? "defautl"}
            orientation="row"
          />
        )}
        {chatId && (
          <MessageComponent chatId={chatId} otherParticipants={participants} />
        )}
      </div>
    </div>
  );
};
export default ChatPage;
