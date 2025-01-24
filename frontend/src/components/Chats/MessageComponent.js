import "./MessageComponent.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../../hooks/webSocketContext";
import { useUser } from "../../hooks/UserContext";
import FriendsSearch from "./FriendsSearch";
import { useNavigate } from "react-router-dom";

const MessageComponent = ({
  onSendMessage,
  messages,
  setMessages,
  fetchChatMessages,
}) => {
  const chatHistoryRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const { chatId } = useParams("id");
  const socket = useWebSocket();
  const [groupUsers, setGroupUsers] = useState([]);

  const token = localStorage.getItem("token");
  const { loggedUserInfo, chats } = useUser();

  const currentChat = chats.find((chat) => chat?.chatId === chatId);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatMessages(chatId);
  }, [chatId]);

  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat-message") {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };
    socket.addEventListener("message", handleWebSocketMessage);

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
    };
  }, [socket]);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      if (chatId === "new") {
        try {
          const newChatId = await createGroupChat();

          if (newChatId) {
            await sendMessageToServer(inputValue.trim(), newChatId);
            navigate(`/chat/${newChatId}`);
          }
        } catch (error) {
          console.error("Error creating group chat or sending message:", error);
        }
        setInputValue("");
        return;
      }

      sendMessageToServer(inputValue.trim());
      setInputValue("");
    }
  };
  const createGroupChat = async () => {
    if (groupUsers.length === 0) {
      console.error("No users selected for the group.");
      return null;
    }
    try {
      const response = await axios.post(
        `/api/chat/new-group-chat`,
        {
          recipientsId: groupUsers.map((user) => user._id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newChatId = response.data.chatId;
      return newChatId;
    } catch (error) {
      console.error("error creating group", error);
    }
  };
  const sendMessageToServer = async (message, targetChatId = chatId) => {
    try {
      const response = await axios.post(
        `/api/message/${targetChatId}/send`,
        {
          content: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("failed to send message:", error);
      throw error;
    }
  };
  const addToGroup = (friend) => {
    setGroupUsers((prev) => [...prev, friend]);
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      {currentChat === undefined ? (
        <div>
          <FriendsSearch addToGroup={addToGroup} chatType="group" />
          <div>
            {groupUsers.map((el) => (
              <div>{el.username}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-information">
          <img src={currentChat?.profilePhoto} className="friend-photo"></img>
          <h1>{currentChat?.chatName}</h1>
        </div>
      )}
      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-messages ${
              message.senderId === loggedUserInfo._id ? "sent" : "received"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="chat-message">
        <input
          className="chat-message-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        ></input>
      </div>
    </div>
  );
};

export default MessageComponent;
