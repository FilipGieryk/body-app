import { useState, useEffect, useRef } from "react";
import "./Header.css";
import Login from "./Login";
import {
  faHome,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faDumbbell,
  faComment,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "../../hooks/UserContext";
import { useWebSocket } from "../../hooks/webSocketContext";

const Header = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [prevPos, setPrevPos] = useState();
  const [currPos, setCurrPos] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const {
    setFriendRequests,
    refreshUserInfo,
    setLoggedUserInfo,
    loggedUserInfo,
    setChats,
  } = useUser();

  const socket = useWebSocket();

  useEffect(() => {
    if (prevPos?.y !== undefined && currPos?.y !== undefined) {
      document.documentElement.style.setProperty(
        "--prev-top",
        `${prevPos.y}px`
      );
      document.documentElement.style.setProperty(
        "--curr-top",
        `${currPos.y}px`
      );

      const line = document.getElementById("line");
      if (line) {
        line.style.animation = "none";
        void line.offsetHeight;
        line.style.animation = "moveLine 0.3s ease forwards";
      }
    }
  }, [currPos]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshUserInfo();
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
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
      <nav className="navigation-container">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.path}
            className={`navigation-button ${
              location.pathname === link.path ? "shadow" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              const rect = e.target.getBoundingClientRect();
              setPrevPos(currPos);
              setCurrPos({
                y: rect.top + rect.height / 2,
              });
              console.log(currPos);
              link.action();
            }}
          >
            <FontAwesomeIcon icon={link.icon} />
          </a>
        ))}
        <div
          // ref={lineRef}
          id="line"
          style={{
            transition: "all 0.3s ease",
          }}
        />
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
