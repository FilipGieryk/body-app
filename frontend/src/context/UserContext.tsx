import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLoggedUserInfo } from "../hooks/fetch/useLoggedUserInfo";
import { Navigate, useNavigate } from "react-router-dom";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { data, refetch, isLoading, isError } = useLoggedUserInfo(false);

  const refetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setIsLoggedIn(false);
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const result = await refetch();
      setUser(result.data ?? null);
      if (result.data == null) {
        setIsLoggedIn(false);
        navigate("/");
      } else {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await refetchUser();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    refetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, refetchUser, logout, login, isLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
