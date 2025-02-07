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
  // in service
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
    <div className="rounded-xl">
      <div className="h-[10%]">
        <div className="flex text-xl h-[80%] p-0 rounded-[2rem 2rem 0 0]">
          <h1
            className="m-0 text-center p-2 text-2xl"
            onClick={() => setShowedInfo("chats")}
          >
            Chats
          </h1>
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
      <div className="relative w-full">
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
                <Link className="decoration-0" to={`/chat/${chat.chatId}`}>
                  <div className="flex items-center decoration-0 h-32 w-full gap-4">
                    <img
                      className="h-28 rounded-4xl"
                      src={chat.profilePhoto}
                      alt="friend-profile-picture"
                    ></img>
                    <div className="text-xl">
                      <h2>{chat.chatName}</h2>
                      <p className="m-0">{chat.lastMessage?.content}</p>
                    </div>
                    {chat.hasUnread && <div className="notification-dot"></div>}
                  </div>
                </Link>
              ))}
          </>
        ) : (
          <>
            {friendRequests.map((req) => (
              <div className="flex items-center decoration-0 h-32 w-full gap-4">
                <img
                  className="h-28 rounded-4xl"
                  src={req.user.profilePhoto}
                ></img>
                <div className="text-xl">
                  <h2 className="m-0">{req.user.username}</h2>
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
