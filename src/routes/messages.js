const express = require("express");
const router = express.Router();

// In-memory storage for messages
const messages = {
  1: [
    { sender: 100, text: "Hello there!" },
    { sender: 101, text: "Hi! How are you?" },
    { sender: 100, text: "fine and you" },
    { sender: 100, text: "I'm also fine." },
  ],
};

// Route to send a message
router.post("/send", (req, res) => {
  const { podId, senderId, text } = req.body;

  if (!messages[podId]) {
    messages[podId] = [];
  }

  const newMessage = { sender: senderId, text };
  messages[podId].push(newMessage);

  res.status(201).json({ message: "Message sent successfully", newMessage });
});

// Route to get messages for a specific pod
router.get("/chats/:podId", (req, res) => {
  const { podId } = req.params;

  if (!messages[podId]) {
    return res.status(404).json([]);
  }

  res.status(200).json(messages[podId]);
});

module.exports = router;
