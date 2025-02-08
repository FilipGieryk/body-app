import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../hooks/UserContext";

const FriendsSearch = ({
  createOrGetMessage,
  chatType = "private",
  addToGroup,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const componentRef = useRef(null);
  const { loggedUserInfo } = useUser();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredFriends(loggedUserInfo.friends);
    } else {
      const filtered = loggedUserInfo.friends.filter((friend) =>
        friend.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };

  const handleInputClick = () => {
    setFilteredFriends(loggedUserInfo.friends);
  };

  const handleFriendClick = (friend) => {
    if (chatType == "private") {
      createOrGetMessage(friend);
    }
    if (chatType == "group") {
      addToGroup(friend);
    }
    setFilteredFriends([]);
  };

  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setFilteredFriends([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={componentRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder="Search for a friend..."
        className="friend-search-input"
      />
      <ul className="h-max w-full absolute z-10 p-0">
        {filteredFriends.map((friend) => (
          <li
            key={friend.id}
            className="h-36 p-4 text-4xl items-center flex gap-8"
            onClick={() => handleFriendClick(friend)}
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
