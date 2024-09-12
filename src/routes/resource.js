const express = require("express");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: "uploads/" });
const app = express();

// Define your file upload route
app.post("/pods/:podId/upload", upload.array("file"), (req, res) => {
  res.send("Files uploaded successfully");
});
