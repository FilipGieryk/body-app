import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../../hooks/webSocketContext";
import { useUser } from "../../hooks/UserContext";
import FriendsSearch from "./FriendsSearch";
import { useNavigate } from "react-router-dom";
import { useSendMessageToServer } from "../../hooks/messages/useSendMessageToServer";

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

  const { data, isError, isSuccess, Error } = useSendMessageToServer();

  // send message to server was here
  const addToGroup = (friend) => {
    setGroupUsers((prev) => [...prev, friend]);
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="grid grid-rows-[0.1fr 1fr 0.2fr] h-full max-h-[100vh] rounded-4xl">
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
        <div className="flex items-center gap-8 w-80">
          <img
            src={currentChat?.profilePhoto}
            className="h-28 rounded-4xl"
          ></img>
          <h1>{currentChat?.chatName}</h1>
        </div>
      )}
      <div
        className="w-full h-full flex flex-col overflow-y-auto"
        ref={chatHistoryRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`text-4xl w-max px-2 py-8 rounded-4xl ${
              message.senderId === loggedUserInfo._id
                ? "self-end"
                : "self-start"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="h-400 flex-row items-center justify-center rounded-[0 0 0 2rem]">
        <input
          className="w-[80%] h-[40%] rounded-4xl"
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
