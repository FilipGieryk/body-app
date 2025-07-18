import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLoggedUserInfo } from "../shared/hooks/useLoggedUserInfo";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const UserContext = createContext(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { data, refetch, isLoading, isError } = useLoggedUserInfo(false);

  const refetchUser = async () => {
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
      setIsLoggedIn(false);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    await refetchUser();
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    refetchUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      refetchUser,
      logout,
      login,
      isLoggedIn,
    }),
    [user, setUser, loading, refetchUser, logout, login, isLoggedIn]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
