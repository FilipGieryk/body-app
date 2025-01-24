const WebSocket = require("ws");

let wss;
const clients = new Map();

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection");
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      ws.close();
      return;
    }
    const userIdString = userId.toString();
    clients.set(userIdString, ws);

    console.log(`WebSocket connected for user ${userId}`);

    ws.on("message", (message) => {
      console.log("Received message:", message);
    });

    ws.on("close", () => {
      console.log(`WebSocket disconnected for user ${userId}`);
      clients.delete(userId);
    });
  });
};

const broadcast = (data) => {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const sendToUser = (userId, data) => {
  const userIdString = userId.toString();
  const client = clients.get(userIdString);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  } else {
    console.log(`User ${userId} is not connected`);
  }
};

const sendToUsers = (userIds, data) => {
  userIds.forEach((userId) => {
    sendToUser(userId, data);
  });
};

const getUserIdFromRequest = (req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return url.searchParams.get("userId");
};

module.exports = { initWebSocket, sendToUser, sendToUsers, broadcast };
