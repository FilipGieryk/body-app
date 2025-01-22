import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const isLoggedIn = Boolean(localStorage.getItem("token")); // Example check for login status

  useEffect(() => {
    if (!isLoggedIn) return;

    const webSocket = new WebSocket("ws://localhost:3000");

    webSocket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received WebSocket message:", message);
      // Handle messages globally if needed, or delegate handling to other components
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
