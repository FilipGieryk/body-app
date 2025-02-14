import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../hooks/UserContext";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useFriendSearch } from "../../hooks/chats/useFriendSearch";

const FriendsSearch = () => {
  const { loggedUserInfo } = useUser();

  if (!loggedUserInfo) {
    return <div>Loading...</div>;
  }
  const {
    searchTerm,
    filteredFriends,
    handleInputChange,
    handleInputClick,
    setFilteredFriends,
  } = useFriendSearch(loggedUserInfo.friends);

  const containerRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(containerRef, () => {
    setFilteredFriends([]);
  });

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder="Search for a friend..."
        className="friend-search-input"
      />
      <ul className="h-max w-full absolute z-10 p-0">
        {filteredFriends.map((friend: any) => (
          <li
            key={friend.id}
            className="h-36 p-4 text-4xl items-center flex gap-8"
            // onClick={() => handleFriendClick(friend)}
          >
            <img
              src={friend.profilePhoto}
              alt={friend.username}
              className="h-28 rounded-4xl"
            />
            <span>{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FriendsSearch;
