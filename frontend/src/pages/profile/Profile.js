import { useEffect, useState, useRef } from "react";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router";
import Photos from "../../components/Main/Photos/UserPhotos";
import WokroutsList from "../../components/Main/Workouts/WorkoutsList";
import WorkoutsActivity from "../../components/Activity/WorkoutsActivity";
import UserInformation from "../../components/Main/Information/UserInformation";
import FriendsComponent from "../../components/Chats/ChatComponent";
import useFriendRequests from "../../hooks/useFriendRequests";
const Profile = () => {
  let { id } = useParams();
  const [userId, setUserId] = useState();
  const [socket, setSocket] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [chats, setChats] = useState([]);
  const chatIdRef = useRef(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [userInfo, setUserInfo] = useState({
    username: "",
    profilePhoto: "",
    photos: [],
    workouts: [],
  });
  const [loading, setLoading] = useState(true);

  const {
    friendRequests,
    requestStatus,
    handleAcceptRequest,
    handleDeclineRequest,
  } = useFriendRequests(userId, userInfo);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:3000");

    webSocket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    webSocket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "friend-request") {
        await friendRequests();
      }
      if (message.type === "chat-message") {
        const { chatId: incomingChatId, content, senderId } = message;

        setMessagesByChat((prevMessages) => ({
          ...prevMessages,
          [incomingChatId]: [...(prevMessages[incomingChatId] || []), message],
        }));

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === incomingChatId
              ? {
                  ...chat,
                  hasUnread: true,
                  lastMessage: {
                    ...chat.lastMessage,
                    content: message.content,
                    timestamp: message.timestamp || new Date().toISOString(),
                  },
                }
              : chat
          )
        );
      }
    };

    webSocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setSocket(webSocket);

    // Cleanup WebSocket on unmount
    return () => {
      webSocket.close();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id);
    }
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUserInfo(response.data);
      } catch (err) {
        console.error("error fetching user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleNavigation = (targetSection) => {
    setActiveSection(targetSection);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="profile-layout">
        <div className="test">
          <div
            className={`profile-grid-layout ${
              activeSection === "profile"
                ? "default-position"
                : activeSection === "workout"
                ? "move-up-one"
                : activeSection === "friends"
                ? "move-up-two"
                : ""
            }`}
          >
            <UserInformation
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              userId={userId}
              requestStatus={requestStatus}
              handleAcceptRequest={handleAcceptRequest}
              handleDeclineRequest={handleDeclineRequest}
              socket={socket}
              friendRequests={friendRequests}
            />
            <div className="profile-grid-item photos">
              {userInfo && <Photos userInfo={userInfo} userId={id} />}
            </div>
            <div className="profile-grid-item workouts">
              <WokroutsList userInfo={userInfo} />
            </div>
          </div>
          <WorkoutsActivity
            className={`${
              activeSection === "profile"
                ? "default-position"
                : activeSection === "workout"
                ? "move-up-one"
                : activeSection === "friends"
                ? "move-up-two"
                : ""
            }`}
            userInfo={userInfo}
          />
        </div>
        {/* <div className="profile-sections">
 
            Friends
            {(chats.some((el) => el.hasUnread) ||
              friendRequests?.some((el) => el.friend._id === userId)) && (
              <div className="notification-dot"></div>
            )}
          </button>
        </div> */}
      </div>
    </>
  );
};

export default Profile;
