import { useState, useEffect } from "react";
import Login from "./Login.tsx";

import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useWorkout } from "../../../context/WorkoutContext.tsx";
import { ExerciseBasket } from "../../../components/header/ExerciseBasket.tsx";
import {
  getBaseLinks,
  getLoggedOutLinks,
  getLoggedInLinks,
} from "../data/navLinks.ts";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { isAnyUnread } from "../helpers/HeaderHelper.ts";
import { useGetChats } from "../../hooks/fetch/chats/useGetChats.ts";
import { useUser } from "../../../context/UserContext.tsx";

export const Header = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const { exercises, setInitialExercises, handleDeleteExercise } = useWorkout();
  const [isBasketVisible, setIsBasketVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { data: chats } = useGetChats();
  const { user: loggedUserInfo, logout, isLoggedIn, login } = useUser();

  const toggleLogin = () => {
    setIsLoginVisible((prev) => !prev);
  };

  const handleLoginSuccess = async () => {
    login();
    setIsLoginVisible(false);
  };

  const baseLinks = getBaseLinks(navigate);
  const loggedOutLinks = getLoggedOutLinks(setVisibleModal, toggleLogin);
  const loggedInLinks = loggedUserInfo
    ? getLoggedInLinks(navigate, loggedUserInfo, logout, isAnyUnread(chats))
    : [];

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
            className={`flex items-center justify-center rounded-2xl bg-white h-15 w-15 relative text-xl hover:shadow-inner first:mt-8 first:mb-auto last:mb-5 nth-4:mb-auto ${
              location.pathname === link.path ? "shadow-inner" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              const rect = e.target.getBoundingClientRect();
              link.action();
            }}
          >
            <FontAwesomeIcon icon={link.icon} />
            {link?.notification && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
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
