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
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();
  // const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
            path: `/profile/${userId}`,
            action: () => navigate(`/profile/${userId}`),
          },
          {
            icon: faSignOutAlt,
            text: "Logout",
            id: "logout",
            action: () => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
              navigate("/");
            },
          },
        ]
      : [
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
