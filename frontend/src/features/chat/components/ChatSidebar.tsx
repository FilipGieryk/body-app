import { useState } from "react";
import { FriendRequest } from "./FriendRequest";
import FriendsSearch from "./FriendsSearch";
import ManageChatComponent from "./ManageChatComponent";
import { useFriendRequests } from "../../../context/FriendRequestsContext";
import { ChatComponent } from "./ChatComponent";
import { getSortedChats } from "../utils/chatUtils";

export const ChatSidebar = ({ loggedUserId, chats }) => {
  console.log(chats);
  const [activeTab, setActiveTab] = useState("chats");

  const { friendRequests, acceptRequest, declineRequest } = useFriendRequests();
  const sortedChats = getSortedChats(chats);

  const filteredRequests = friendRequests?.filter(
    (el) => el.friend?._id === loggedUserId
  );

  return (
    <div>
      <ManageChatComponent
        friendRequests={filteredRequests}
        setActiveTab={setActiveTab}
        loggedUserId={loggedUserId}
      />
      <FriendsSearch />
      {activeTab === "chats" && <ChatComponent chats={sortedChats} />}
      {activeTab === "requests" && (
        <FriendRequest
          friendRequests={filteredRequests}
          acceptRequest={acceptRequest}
          declineRequest={declineRequest}
        />
      )}
    </div>
  );
};
