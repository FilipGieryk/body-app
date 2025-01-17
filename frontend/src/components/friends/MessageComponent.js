import "./MessageComponent.css";
import { useState } from "react";

const MessageComponent = ({ messages, onSendMessage, userId }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };
  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((message) => (
          <div
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
