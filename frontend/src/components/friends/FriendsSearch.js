import React, { useState } from "react";
import "./FriendsSearch.css";
import axios from "axios";
const FriendsSearch = ({ friends, userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };

  const handleInputClick = () => {
    setFilteredFriends(friends);
  };
  const createOrGetMessage = async (friend) => {
    try {
      console.log(friend);
      const response = await axios.post("/api/chat/create-or-get", {
        senderId: userId,
        recipientId: friend._id,
      });
    } catch (error) {
      console.error("error creating chat", error);
    }
  };

  const handleFriendClick = (friend) => {
    createOrGetMessage(friend);
    console.log("Clicked friend:", friend); // Replace with your logic, e.g., navigate to chat
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder="Search for a friend..."
        className="friend-search-input"
      />
      <ul className="friend-list">
        {filteredFriends.map((friend) => (
          <li
            key={friend.id}
            className="friend-item"
            onClick={() => handleFriendClick(friend)}
          >
            <img
              src={friend.profilePhoto}
              alt={friend.username}
              className="friend-photo"
            />
            <span>{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FriendsSearch;
