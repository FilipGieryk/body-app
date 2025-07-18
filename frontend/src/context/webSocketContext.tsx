import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateMessagesAndChats } from "../features/chat/utils/chatCacheUtils";
import { useUser } from "./UserContext";
import { updateFriendRequests } from "../features/chat/utils/FriendRequestCacheUtils";

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { isLoggedIn } = useUser();
  console.log(socket);
  // const token = localStorage.getItem("token");
  const token = Object.fromEntries(
    document.cookie.split("; ").map((c) => c.split("="))
  ).token;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      console.warn("No token found. Skipping WebSocket connection.");
      return;
    }
    let decodedToken: { id: string };
    try {
      decodedToken = JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Invalid token:", error);
      return;
    }
    const userId = decodedToken.id;

    const webSocket = new WebSocket(
      `ws://localhost:3000?userId=${encodeURIComponent(userId)}`
    );

    webSocket.onopen = () => {
      console.log("Connected to WebSocket server:", userId);
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type == "friend-request") {
        updateFriendRequests(queryClient, message);
      }
      // setHasNewMessage((prev) => {
      //   const next = new Set(prev);
      //   console.log("ewn");
      //   next.add(message.senderId);
      //   return next;
      // });

      updateMessagesAndChats(queryClient, message.chatId, message);

      console.log("Received WebSocket message:", message);
    };

    webSocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(webSocket);

    // Cleanup on unmount
    return () => {
      webSocket.close();
    };
  }, [isLoggedIn]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
