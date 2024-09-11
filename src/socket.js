const { Server } = require("socket.io");

// Set up Socket.io
const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this to your client URL if needed
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Listen for incoming chat messages
    socket.on("chatMessage", (msg) => {
      // Broadcast the message to all connected clients
      io.emit("chatMessage", msg);
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

module.exports = setupSocket;
