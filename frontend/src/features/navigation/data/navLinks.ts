import {
  faHome,
  faQuestion,
  faDumbbell,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

export const getBaseLinks = (navigate) => [
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

export const getLoggedInLinks = (navigate, loggedUserInfo, handleLogout) => [
  {
    icon: faHome,
    text: "Profile",
    id: "profile",
    path: `/profile/${loggedUserInfo?._id}`,
    action: () => {
      navigate(`/profile/${loggedUserInfo._id}`);
    },
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

export const getLoggedOutLinks = (setVisibleModal, toggleLogin) => [
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
