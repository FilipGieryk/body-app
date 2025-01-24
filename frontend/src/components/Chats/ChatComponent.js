import "./ChatComponent.css";
import axios from "axios";
import FriendsSearch from "./FriendsSearch";
import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../../hooks/webSocketContext";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
const ChatComponent = ({ userId }) => {
  const {
    friendRequests,
    handleAcceptRequest,
    handleDeclineRequest,
    loggedUserInfo,
    chats,
  } = useUser();
  const navigate = useNavigate();
  const [showedInfo, setShowedInfo] = useState("chats");
  const createGroup = () => {
    navigate("/chat/new");
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
          <button onClick={createGroup}>c</button>
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
                <img className="friend-photo" src={req.user.profilePhoto}></img>
                <div className="friend-chat-info">
                  <h2>{req.user.username}</h2>
                </div>
                <button onClick={() => handleAcceptRequest(req.user)}>+</button>
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
