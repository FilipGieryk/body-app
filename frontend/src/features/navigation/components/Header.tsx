import { useState, useEffect } from "react";
import Login from "../../auth/components/Login.tsx";

import { useLocation, useNavigate } from "react-router-dom";

import { NavLink } from "react-router-dom";
import { useWorkout } from "../../../context/WorkoutContext.tsx";
import { ExerciseBasket } from "./ExerciseBasket.tsx";
import {
  getBaseLinks,
  getLoggedOutLinks,
  getLoggedInLinks,
} from "../data/navLinks.tsx";

import { useUser } from "../../../context/UserContext.tsx";

export const Header = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const { exercises, setInitialExercises, handleDeleteExercise } = useWorkout();
  const [isBasketVisible, setIsBasketVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(isMenuOpen);
  const navigate = useNavigate();
  const location = useLocation();
  // const { data: chats } = useGetChats();
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
  //add unread chats
  const loggedInLinks = loggedUserInfo
    ? getLoggedInLinks(navigate, loggedUserInfo, logout)
    : [];

  const links = [
    ...baseLinks,
    ...(exercises?.length > 0
      ? [
          {
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="w-6 h-6"
              >
                <path d="M96 64c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 160 0 64 0 160c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-64-32 0c-17.7 0-32-14.3-32-32l0-64c-17.7 0-32-14.3-32-32s14.3-32 32-32l0-64c0-17.7 14.3-32 32-32l32 0 0-64zm448 0l0 64 32 0c17.7 0 32 14.3 32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 64c0 17.7-14.3 32-32 32l-32 0 0 64c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-160 0-64 0-160c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32zM416 224l0 64-192 0 0-64 192 0z" />
              </svg>
            ),
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
    <>
      <header className="flex justify-end h-screen top-0 absolute right-0 z-200 w-0">
        <div
          className="relative z-10 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <svg
            className="z-20"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 50 50"
          >
            <path d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z"></path>
          </svg>

          {isMenuOpen && (
            <div className="bg-amber-200 absolute right-0 top-0 w-100 z-1 h-full">
              {links.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={`flex items-center justify-center rounded-2xl bg-white h-15 w-15 relative text-xl hover:shadow-inner first:mt-8 first:mb-auto last:mb-5 nth-4:mb-auto ${
                    location.pathname === link.path ? "shadow-inner" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    link.action();
                  }}
                >
                  {link.icon}
                  {link.text}
                  {link?.notification && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <nav className="hidden md:flex flex-col justify-center pr-7">
          {links.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={`flex items-center justify-center rounded-2xl bg-white h-15 w-15 relative text-xl hover:shadow-inner first:mt-8 first:mb-auto last:mb-5 nth-4:mb-auto ${
                location.pathname === link.path ? "shadow-inner" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                link.action();
              }}
            >
              {link.icon}
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
      </header>
      {isLoginVisible && !isLoggedIn && (
        <Login
          isVisible={true}
          loginStatus={visibleModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};
