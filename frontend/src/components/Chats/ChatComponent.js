import "./ChatComponent.css";
import axios from "axios";
import FriendsSearch from "./FriendsSearch";
import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../../hooks/webSocketContext";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
const ChatComponent = ({ userId }) => {
  const {
    friendRequests,
    setFriendRequests,
    handleAcceptRequest,
    handleDeclineRequest,
    loggedUserInfo,
    chats,
  } = useUser();
  const socket = useWebSocket();
  const [showedInfo, setShowedInfo] = useState("chats");
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "friend-request") {
        setFriendRequests((prev) => [
          ...prev,
          { friend: { _id: message.friendId }, user: { _id: message.userId } },
        ]);
      }
    };
    socket.addEventListener("message", handleWebSocketMessage);

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
    };
  }, [socket]);
  // put to messages mby bmy not
  const markMessagesAsRead = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/chat/mark-read`,
        { chatId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization token if needed
          },
        }
      );
      console.log("Messages marked as read");
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const createOrGetMessage = async (friend) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/chat/create-or-get",
        {
          recipientId: friend._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/chat/${response.data.chatId}`);
    } catch (error) {
      console.error("error creating chat", error);
    }
  };

  return (
    <div className="friend-list-container">
      <div className="friend-list-navigation">
        <div className="friend-list-header">
          <h1 onClick={() => setShowedInfo("chats")}>Chats</h1>
          {/* if pending requests show if not dont show */}

          {friendRequests?.some(
            (el) => el.friend?._id === loggedUserInfo?._id
          ) && (
            <h1 onClick={() => setShowedInfo("friendRequest")}>
              Friend Requests
            </h1>
          )}
        </div>
        <FriendsSearch
          userId={userId}
          createOrGetMessage={createOrGetMessage}
        />
      </div>
      <div className="friend-list-friends">
        {showedInfo === "chats" ? (
          <>
            {chats
              .filter((el) => el?.lastMessage)
              .sort(
                (a, b) =>
                  new Date(b.lastMessage.timestamp) -
                  new Date(a.lastMessage.timestamp)
              )
              .map((chat) => (
                <Link className="link" to={`/chat/${chat.chatId}`}>
                  <div className="friend-container">
                    <img
                      className="friend-photo"
                      src={chat.profilePhoto}
                      alt="friend-profile-picture"
                    ></img>
                    <div className="friend-chat-info">
                      <h2>{chat.chatName}</h2>
                      <p className="friend-last-message">
                        {chat.lastMessage?.content}
                      </p>
                    </div>
                    {chat.hasUnread && <div className="notification-dot"></div>}
                  </div>
                </Link>
              ))}
          </>
        ) : (
          <>
            {friendRequests.map((req) => (
              <div className="friend-container">
                {/* <img className="friend-photo" src={req.user.profilePhoto}></img> */}
                <div className="friend-chat-info">
                  <h2>{req.user.username}</h2>
                </div>
                <button onClick={() => handleAcceptRequest(req.user._id)}>
                  +
                </button>
                <button onClick={() => handleDeclineRequest(req.user._id)}>
                  -
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
export default ChatComponent;
