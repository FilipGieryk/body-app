import { useState, useEffect } from "react";
import Login from "./Login.tsx";
import {
  faHome,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faDumbbell,
  faComment,
  faQuestion,
  faBasketballBall,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "../../hooks/UserContext";
import { useWebSocket } from "../../hooks/webSocketContext";
import { NavLink } from "react-router-dom";
import { useWorkout } from "../../context/WorkoutContext.tsx";
import { ExerciseBasket } from "./ExerciseBasket.tsx";

export const Header = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { exercises, setInitialExercises, handleDeleteExercise } = useWorkout();
  const [isBasketVisible, setIsBasketVisible] = useState(false);

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
        // line.style.animation = "none";
        void line.offsetHeight;
        // line.style.animation = "moveLine 0.3s ease forwards";
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

  // kick this out
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

  const baseLinks = [
    {
      icon: faHome,
      text: "Home",
      id: "home",
      path: "/",
      action: () => navigate("/"),
    },
    {
      icon: faQuestion,
      text: "Help",
      id: "help",
      path: "/help",
      action: () => navigate("/help"),
    },
    {
      icon: faDumbbell,
      text: "Exercises",
      id: "exercises",
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
  ];

  const loggedInLinks = [
    {
      icon: faHome,
      text: "Profile",
      id: "profile",
      path: `/profile/${loggedUserInfo?._id}`,
      action: () => navigate(`/profile/${loggedUserInfo._id}`),
    },
    {
      icon: faComment,
      text: "Chat",
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
  ];

  const loggedOutLinks = [
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
      path: "/register",
      action: () => {
        setVisibleModal("register");
        toggleLogin();
      },
    },
  ];

  const links = [
    ...baseLinks,
    ...(exercises?.length > 0
      ? [
          {
            icon: faDumbbell,
            text: "Basket",
            id: "basket",
            action: () => {
              setIsBasketVisible((prev) => !prev);
            },
          },
        ]
      : []),
    ...(isLoggedIn ? loggedInLinks : loggedOutLinks),
  ];

  return (
    <header className="flex justify-end h-screen top-0 absolute right-0 z-200 w-0">
      <nav className="flex flex-col justify-center pr-7">
        {links.map((link) => (
          <NavLink
            key={link.id}
            to={link.path}
            className={`flex items-center justify-center rounded-2xl bg-white h-15 w-15 text-xl hover:shadow-inner first:mt-8 first:mb-auto last:mb-5 nth-4:mb-auto ${
              location.pathname === link.path ? "shadow-inner" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              const rect = e.target.getBoundingClientRect();
              setPrevPos(currPos);
              setCurrPos({
                y: rect.top + rect.height / 2,
              });
              link.action();
            }}
          >
            <FontAwesomeIcon icon={link.icon} />
          </NavLink>
        ))}
      </nav>
      {isBasketVisible && isLoggedIn && <ExerciseBasket />}
      <div
        id="line"
        className="absolute l-55 h-2 bg-black"
        style={{
          transition: "all 0.3s ease",
        }}
      />

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
