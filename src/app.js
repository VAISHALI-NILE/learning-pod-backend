require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const setupSocket = require("./socket");
const protectedRoute = require("./routes/protected");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const DB_connection = require("./config/mongoConn");
const createPodRoute = require("./routes/pods");
const joinPodRoute = require("./routes/join");
const tasksRoute = require("./routes/tasks");
const messagesRoute = require("./routes/messages");
const fileUploadRoutes = require("./routes/fileUpload");
const resourceShareRoutes = require("./routes/resource");
const notificationRoute = require("./routes/notification");

const resource = require("./routes/resource");
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/files", express.static("files"));

// Import routes
app.use("/", protectedRoute);
app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use("/create", createPodRoute);
app.use("/join", joinPodRoute);
app.use("/tasks", tasksRoute);
app.use("/messages", messagesRoute);
app.use("/files", fileUploadRoutes);
app.use("/resource-share", resourceShareRoutes);
app.use("/notification", notificationRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
