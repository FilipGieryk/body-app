import "./MessageComponent.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../../hooks/webSocketContext";
import { useUser } from "../../hooks/UserContext";

const MessageComponent = ({ onSendMessage }) => {
  const chatHistoryRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const { chatId } = useParams("id");
  const socket = useWebSocket();
  const token = localStorage.getItem("token");
  const { loggedUserInfo, chats } = useUser();

  const currentChat = chats.find((chat) => chat?.chatId === chatId);
  useEffect(() => {
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

    // const markMessagesAsRead = async (chatId) => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     await axios.post(
    //       `/api/chat/mark-read`,
    //       { chatId },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`, // Include the authorization token if needed
    //         },
    //       }
    //     );
    //     console.log("Messages marked as read");
    //   } catch (error) {
    //     console.error("Error marking messages as read:", error);
    //   }
    // };
    fetchChatMessages();
    // markMessagesAsRead();
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

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-information">
        <img src={currentChat?.profilePhoto} className="friend-photo"></img>
        <h1>{currentChat?.chatName}</h1>
      </div>
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
