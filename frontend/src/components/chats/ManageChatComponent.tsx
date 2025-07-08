import FriendsSearch from "./FriendsSearch";

import React, { useState } from "react";
import { FriendRequest } from "./FriendRequest";

import { ChatComponent } from "./ChatComponent";
import { useLoggedUserInfo } from "../../hooks/fetch/useLoggedUserInfo";
import { useFriendRequests } from "../../context/FriendRequestsContext";
const ManageChatComponent = () => {
  const [activeTab, setActiveTab] = useState("chats");
  // change useuser to userequests
  const { friendRequests } = useFriendRequests();
  const { data: loggedUserInfo } = useLoggedUserInfo();

  return (
    <div className="rounded-xl">
      <div className="h-[10%]">
        <div className="flex text-xl h-[80%] p-0 rounded-[2rem 2rem 0 0]">
          <h1
            className="m-0 text-center p-2 text-2xl"
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </h1>
          {friendRequests?.some(
            (el: { friend: { _id: any } }) =>
              el.friend?._id === loggedUserInfo?._id
          ) && (
            <h1 onClick={() => setActiveTab("friendRequest")}>
              Friend Requests
            </h1>
          )}
        </div>
        <FriendsSearch />
      </div>

      <div className="relative w-full">
        {activeTab === "chats" ? <ChatComponent /> : <FriendRequest />}
      </div>
    </div>
  );
};
export default ManageChatComponent;
