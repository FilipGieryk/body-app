import { useState } from "react";
import { FriendRequest } from "./FriendRequest";
import FriendsSearch from "./FriendsSearch";
import ManageChatComponent from "./ManageChatComponent";
import { useFriendRequests } from "../../../context/FriendRequestsContext";
import { ChatComponent } from "./ChatComponent";
import { getSortedChats } from "../utils/chatUtils";
import { Chat } from "../types";

// type ChatSidebarProps = {
//   loggedUserId: string;
//   chats: Chat[];
// };

export const ChatSidebar = ({
  loggedUserId,
  chats,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const [activeTab, setActiveTab] = useState<string>("chats");

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
      {activeTab === "chats" && (
        <ChatComponent
          chats={sortedChats}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
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
