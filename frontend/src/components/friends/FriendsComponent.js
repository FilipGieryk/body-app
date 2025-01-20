import "./FriendsComponent.css";
import axios from "axios";
import FriendsSearch from "./FriendsSearch";
import MessageComponent from "./MessageComponent";
import { useEffect, useState, useRef } from "react";

const FriendsComponent = ({
  className,
  userInfo,
  userId,
  friendRequests,
  setFriendRequests,
  handleDeclineRequest,
  handleAcceptRequest,
}) => {
  const [chats, setChats] = useState([]);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [chatInfo, setChatInfo] = useState("null");
  const [chatId, setChatId] = useState(null);
  const chatIdRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [showedInfo, setShowedInfo] = useState("chats");
  console.log(chats);

  const initWebSocket = () => {
    const webSocket = new WebSocket("ws://localhost:3000");
    webSocket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { chatId: incomingChatId, content, senderId } = message;
      // console.log(incomingChatId);

      // Update messages for the specific chat
      setMessagesByChat((prevMessages) => ({
        ...prevMessages,
        [incomingChatId]: [...(prevMessages[incomingChatId] || []), message],
      }));
      if (incomingChatId !== chatIdRef.current) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === incomingChatId ? { ...chat, hasUnread: true } : chat
          )
        );
      }
    };
    webSocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setSocket(webSocket);
  };

  useEffect(() => {
    initWebSocket();
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

  const handleSendMessage = async (message) => {
    if (!chatId) {
      console.warn("No chat selected to send message.");
      return;
    }
    const newMessage = { senderId: userId, content: message };
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(newMessage));
      await sendMessageToServer(chatId, message);
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

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
    await fetchChatMessages(chatId);
    // }
    await markMessagesAsRead(chatId);
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
      await handleFetchChat(response.data._id);
    } catch (error) {
      console.error("error creating chat", error);
    }
  };

  const sendMessageToServer = async (chatId, message) => {
    try {
      const response = await axios.post(`/api/message/${chatId}/send`, {
        senderId: userId,
        content: message,
      });
      return response.data;
    } catch (error) {
      console.error("failed to send message:", error);
      throw error;
    }
  };

  return (
    <div className={`friends-container ${className}`}>
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
            friends={userInfo.friends}
            userId={userId}
            createOrGetMessage={createOrGetMessage}
          />
        </div>
        <div className="friend-list-friends">
          {showedInfo === "chats" ? (
            <>
              {chats.map((chat) => (
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
                    <p className="friend-last-message">last message</p>
                  </div>
                  {chat.hasUnread && <div className="notification-dot"></div>}
                </div>
              ))}
            </>
          ) : (
            <>
              {friendRequests.map((req) => (
                <div className="friend-container">
                  <img
                    className="friend-photo"
                    src={req.user.profilePhoto}
                  ></img>
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
      <MessageComponent
        chatInfo={chatInfo}
        userId={userId}
        messages={messagesByChat[chatId] || []}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
export default FriendsComponent;
