import "./ChatComponent.css";
import axios from "axios";
import FriendsSearch from "./FriendsSearch";
import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../../hooks/webSocketContext";
import { Link } from "react-router-dom";
const ChatComponent = ({
  className,
  userInfo,
  userId,
  friendRequests,
  setFriendRequests,
  handleDeclineRequest,
  handleAcceptRequest,
}) => {
  const [chatInfo, setChatInfo] = useState("null");
  const [chatId, setChatId] = useState(null);
  const [showedInfo, setShowedInfo] = useState("chats");
  const [chats, setChats] = useState([]);
  const [messagesByChat, setMessagesByChat] = useState([]);
  const chatIdRef = useRef();
  const socket = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "friend-request") {
        // Handle friend request
      } else if (message.type === "chat-message") {
        console.log("sdsd");
        // Handle chat message
      }
    };
    socket.addEventListener("message", handleWebSocketMessage);

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
    };
  }, [socket]);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/chat`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setChats(response.data);
      } catch (error) {
        console.error("crap");
      }
    };
    fetchChats();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const handleFetchChat = async (chat) => {
    setChatId(chat.chatId);
    setChatInfo({ username: chat.chatName, profilePhoto: chat.profilePhoto });
    chatIdRef.current = chat.chatId;
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId ? { ...chat, hasUnread: false } : chat
      )
    );
    // if (!messagesByChat[chatId] || messagesByChat[chatId].length === 0) {
    await fetchChatMessages(chatIdRef.current);
    // }
    await markMessagesAsRead(chatIdRef.current);
  };
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

  const fetchChatMessages = async (chatId) => {
    try {
      console.log(chatId);
      const response = await axios.get(`/api/message/${chatId}`);
      const messages = response.data;
      setMessagesByChat((prevMessages) => ({
        ...prevMessages,
        [chatId]:
          messages.length > 0
            ? messages
            : [{ content: "Be the first to message!" }],
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
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
      console.log(response.data);
      await handleFetchChat(response.data);
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

          {friendRequests?.some((el) => el.friend._id === userId) && (
            <h1 onClick={() => setShowedInfo("friendRequest")}>
              Friend Requests
            </h1>
          )}
        </div>
        <FriendsSearch
          // friends={.friends}
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
                <Link to={`/chat/${chat.chatId}`}>
                  <div
                    onClick={() => handleFetchChat(chat)}
                    className="friend-container"
                  >
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
