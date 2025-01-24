import { useState, useEffect } from "react";
import "./Header.css";
import Login from "./Login";
import {
  faHome,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faDumbbell,
  faComment,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "../../hooks/UserContext";
import { useWebSocket } from "../../hooks/webSocketContext";

const Header = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const {
    setFriendRequests,
    refreshUserInfo,
    setLoggedUserInfo,
    loggedUserInfo,
    setChats,
    fetchPendingRequests,
  } = useUser();

  const socket = useWebSocket();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshUserInfo();
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, [isLoggedIn]);

  const toggleLogin = () => {
    setIsLoginVisible((prev) => !prev);
  };

  const handleLoginSuccess = (userId) => {
    // Set isLoggedIn to true and userId when login is successful
    setIsLoggedIn(true);
    setIsLoginVisible(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    setLoggedUserInfo(null); // Clear user info on logout
    setFriendRequests([]);
    navigate("/");
  };

  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "friend-request") {
        setFriendRequests((prev) => [
          ...prev,
          {
            friend: { _id: message.friendId },
            user: {
              _id: message.userId,
              username: message.username,
              profilePhoto: message.profilePhoto,
            },
          },
        ]);
      } else if (message.type === "chat-message") {
        let chatExists = false;

        setChats((prevChats) => {
          chatExists = prevChats.some((chat) => chat.chatId === message.chatId);

          if (chatExists) {
            return prevChats.map((chat) =>
              chat.chatId === message.chatId
                ? {
                    ...chat,
                    hasUnread: true,
                    lastMessage: {
                      ...message,
                      timestamp: new Date().toISOString(),
                    },
                  }
                : chat
            );
          } else {
            return [
              ...prevChats,
              {
                chatId: message.chatId,
                hasUnread: true,
                lastMessage: {
                  ...message,
                  timestamp: new Date().toISOString(),
                },
                placeholder: true,
              },
            ];
          }
        });

        // Fetch the full chat only if it doesn't exist
        if (!chatExists) {
          fetchChatById(message.chatId);
        }
      }
    };

    socket.addEventListener("message", handleWebSocketMessage);

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
    };
  }, [socket]);

  const fetchChatById = async (chatId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authorization token if needed
        },
      }); // Adjust the endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch chat");
      }

      const fullChat = await response.json();

      // Update the chat with the fetched data
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.chatId === chatId
            ? { ...fullChat } // Replace the placeholder or existing chat with full data
            : chat
        )
      );
    } catch (error) {
      console.error(`Error fetching chat ${chatId}:`, error);
    }
  };

  const links = [
    {
      icon: faHome,
      text: "Home",
      id: "home",
      path: "/",
      action: () => navigate("/"),
    },
    ...(isLoggedIn
      ? [
          {
            icon: faQuestion,
            text: "Help",
            id: "help",
            path: "/help",
            action: () => navigate("/help"),
          },
          {
            icon: faDumbbell,
            text: "Excercises",
            id: "excercises",
            path: "/exercises",
            action: () => navigate("/exercises"),
          },
          {
            icon: faDumbbell,
            text: "Workouts",
            id: "workouts",
            path: "/workouts",
            action: () => navigate("/workouts"),
          },
          {
            icon: faHome,
            text: "Profile",
            id: "profile",
            path: `/profile/${loggedUserInfo?._id}`,
            action: () => navigate(`/profile/${loggedUserInfo._id}`),
          },
          {
            icon: faComment,
            test: "Chat",
            id: "chat",
            path: `/chat`,
            action: () => navigate(`/chat`),
          },
          {
            icon: faSignOutAlt,
            text: "Logout",
            id: "logout",
            action: handleLogout,
          },
        ]
      : [
          {
            icon: faQuestion,
            text: "Help",
            id: "help",
            path: "help",
            action: () => navigate("/help"),
          },
          {
            icon: faDumbbell,
            text: "Exercises",
            id: "exercises",
            path: "exercises",
            action: () => navigate("/exercises"),
          },
          {
            icon: faDumbbell,
            text: "Workouts",
            id: "workouts",
            path: "workouts",
            action: () => navigate("/workouts"),
          },
          {
            icon: faSignInAlt,
            text: "Login",
            id: "login",
            action: () => {
              setVisibleModal("login");
              toggleLogin();
            },
          },
          {
            icon: faUserPlus,
            text: "Register",
            id: "register",
            path: "register",
            action: () => {
              setVisibleModal("register");
              toggleLogin();
            },
          },
        ]),
  ];

  return (
    <header className="header-container">
      <nav
        className="navigation-container"
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => {
          setIsNavHovered(false);
          setHoveredLink(null);
        }}
      >
        {links.map((link) => (
          <a
            className={`navigation-button ${
              location.pathname === link.path ? "shadow" : ""
            }`}
            onClick={link.action}
          >
            <FontAwesomeIcon icon={link.icon} />
          </a>
        ))}
      </nav>

      {isLoginVisible && !isLoggedIn && (
        <Login
          isVisible={true}
          loginStatus={visibleModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </header>
  );
};

export default Header;
