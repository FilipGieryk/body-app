import "./MessageComponent.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../Other/Header";
import { useWebSocket } from "../../hooks/webSocketContext";
import jwtDecode from "jwt-decode";

const MessageComponent = ({ onSendMessage }) => {
  const chatHistoryRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState([]);
  const { chatId } = useParams("id");
  const socket = useWebSocket();

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      userId = decodedToken?.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  useEffect(() => {
    const fetchChatById = async () => {
      try {
        const response = await axios.get(`/api/chat/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatInfo(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchChatMessages = async () => {
      try {
        const response = await axios.get(`/api/message/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChatById();
    fetchChatMessages();
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      sendMessageToServer(inputValue.trim());
      setInputValue("");
    }
  };
  const sendMessageToServer = async (message) => {
    try {
      const response = await axios.post(
        `/api/message/${chatId}/send`,
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

  // const fetchChatMessages = async (chatId) => {
  //   try {
  //     console.log(chatId);
  //     const response = await axios.get(`/api/message/${chatId}`);
  //     const messages = response.data;
  //     setMessagesByChat((prevMessages) => ({
  //       ...prevMessages,
  //       [chatId]:
  //         messages.length > 0
  //           ? messages
  //           : [{ content: "Be the first to message!" }],
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   }
  // };

  // const handleSendMessage = async (message) => {
  //   if (!chatId) {
  //     console.warn("No chat selected to send message.");
  //     return;
  //   }
  //   const newMessage = { senderId: userId, content: message };
  //   if (socket && socket.readyState === WebSocket.OPEN) {
  //     socket.send(JSON.stringify(newMessage));
  //     await sendMessageToServer(chatId, message);
  //   } else {
  //     console.error("WebSocket is not open. Cannot send message.");
  //   }
  // };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="chat-container">
      <div className="chat-information">
        <img src={chatInfo.profilePhoto} className="friend-photo"></img>
        <h1>{chatInfo.chatName}</h1>
      </div>
      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-messages ${
              message.senderId === userId ? "sent" : "received"
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
