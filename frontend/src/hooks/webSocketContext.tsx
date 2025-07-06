import React, { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const token = localStorage.getItem("token");
  const { setHasNewMessage } = useNotification();

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
      setHasNewMessage(true);
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
  }, [token]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
