import "./FriendsComponent.css";

const FriendsComponent = ({ className, userInfo }) => {
  console.log(userInfo);
  return (
    <div className={`friends-container ${className}`}>
      <div className="friend-list-container">
        <div className="friend-list-header">
          <h1>Chats</h1>
        </div>
        <div className="friend-list-friends">
          {userInfo.friends.map((friend) => (
            <div className="friend-container">
              <img
                className="friend-photo"
                src={friend.profilePhoto}
                alt="friend-profile-picture"
              ></img>
              <div className="friend-chat-info">
                <h2>{friend.username}</h2>
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
