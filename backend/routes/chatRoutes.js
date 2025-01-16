const express = require("express");
const router = express.Router();

let messages = [];

router.get("/", (req, res) => {
  res.json(messages);
});

router.post("/", (req, res) => {
  const { userId, content } = req.body;
  const message = { userId, content, timestamp: new Date() };
  messages.push(message);

  // Trigger webhook for new message
  triggerWebhook(message);

  res.status(201).json({ message: "Message sent", message });
});

const triggerWebhook = (message) => {
  const webhookUrl = "http://your-webhook-url.com";

  axios
    .post(webhookUrl, { message })
    .then(() => console.log("Webhook triggered"))
    .catch((err) => console.error("Error triggering webhook:", err));
};
