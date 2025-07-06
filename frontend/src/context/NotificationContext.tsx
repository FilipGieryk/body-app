import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [hasNewFriendRequest, setHasNewFriendRequest] = useState(false);

  return (
    <NotificationContext.Provider
      value={{
        hasNewMessage,
        hasNewFriendRequest,
        setHasNewMessage,
        setHasNewFriendRequest,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
