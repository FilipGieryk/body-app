import "./FriendsComponent.css";
import axios from "axios";
import FriendsSearch from "./FriendsSearch";
import MessageComponent from "./MessageComponent";
import { useEffect, useState } from "react";

const FriendsComponent = ({ className, userInfo, userId }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [socket, setSocket] = useState(null);

  const initWebSocket = () => {
    const webSocket = new WebSocket("ws://localhost:3000");
    webSocket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]); // Append new message
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
      } catch (error) {}
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

  const handleFetchChat = async (chatId) => {
    setChatId(chatId);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId ? { ...chat, hasUnread: false } : chat
      )
    );
    await fetchChatMessages(chatId);
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
      if (messages.length === 0) {
        setMessages([{ content: "noMessages be the first one to type" }]);
      } else {
        setMessages(messages);
      }
    } catch (error) {
      console.error("error fetching messages:", error);
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
        <div className="friend-list-header">
          <h1>Chats</h1>
          <FriendsSearch friends={userInfo.friends} userId={userId} />
        </div>
        <div className="friend-list-friends">
          {chats.map((chat) => (
            <div
              onClick={() => handleFetchChat(chat.chatId)}
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
        </div>
      </div>
      <MessageComponent
        userId={userId}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
export default FriendsComponent;
