import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedUserInfo, setLoggedUserInfo] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [chats, setChats] = useState([]);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const response = await axios.get(`/api/users/${decodedToken.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/chat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error("crap");
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/friendships/pending-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const requests = response.data;
      setFriendRequests(requests);
    } catch (error) {
      console.error("Error fetching pending friend requests:", error);
    }
  };

  const refreshUserInfo = async () => {
    await fetchUserInfo();
    await fetchPendingRequests();
    await fetchChats();
  };

  //     if (userInfo.friends?.includes(userInfo._id)) {
  //       setRequestStatus("friends");
  //     } else if (
  //       requests.some(
  //         (req) => req.friend._id === userInfo._id && req.user._id === userId
  //       )
  //     ) {
  //       setRequestStatus("sent");
  //     } else if (
  //       requests.some(
  //         (req) => req.user._id === userInfo._id && req.friend._id === userId
  //       )
  //     ) {
  //       setRequestStatus("received");
  //     } else {
  //       setRequestStatus("none");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching pending requests:", err);
  //   }
  // };

  const handleAcceptRequest = async (friend) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/friendships/accept-request",
        { friendId: friend._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriendRequests((prev) =>
        prev.filter((req) => req.user._id !== friend._id)
      );
      setLoggedUserInfo((prev) => ({
        ...prev,
        friends: [...prev.friends, friend],
      }));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineRequest = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/friendships/decline-request",
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriendRequests((prev) =>
        prev.filter((req) => req.user._id !== friendId)
      );
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        loggedUserInfo,
        friendRequests,
        handleAcceptRequest,
        handleDeclineRequest,
        refreshUserInfo,
        setLoggedUserInfo,
        setFriendRequests,
        setChats,
        chats,
        fetchPendingRequests,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
