import "./FriendsComponent.css";
import axios from "axios";
import { useEffect, useState } from "react";

const FriendsComponent = ({ className, userInfo, userId }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  const fetchChatMessages = async () => {
    try {
      const response = await axios.get("/api/message/:chatId");
      setMessages(response.data);
    } catch (error) {}
  };
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`/api/chat/${userId}`);
        setChats(response.data);
      } catch (error) {}
    };
    fetchChats();
  }, []);

  // add search for friends so you can add chats
  // mby if no chats show 10 or some friends instead

  return (
    <div className={`friends-container ${className}`}>
      <div className="friend-list-container">
        <div className="friend-list-header">
          <h1>Chats</h1>
        </div>
        <div className="friend-list-friends">
          {chats.map((chats) => (
            <div className="friend-container">
              <img
                className="friend-photo"
                src={chats}
                alt="friend-profile-picture"
              ></img>
              <div className="friend-chat-info">
                <h2>{chats}</h2>
                <p className="friend-last-message">last message</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-history"></div>
        <div className="chat-message">
          <input className="chat-message-input"></input>
        </div>
      </div>
    </div>
  );
};
export default FriendsComponent;
