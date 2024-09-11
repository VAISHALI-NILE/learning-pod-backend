// src/routes/tasks.js
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();

// Import the Submission model
const Submission = require("../models/submission");

// Setup multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route to handle file uploads
router.post("/upload-files", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ status: "error", message: "No file uploaded" });
  }

  const { filename, mimetype } = req.file;
  const { title, description } = req.body;

  try {
    const submission = new Submission({
      title: title,
      description: description,
      file: filename,
      contentType: mimetype,
    });

    await submission.save(); // Use save() method here
    res.json({ status: "ok", message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error saving submission:", error);
    res
      .status(500)
      .send({ status: "error", message: "File submission failed" });
  }
});

router.get("/get-files", async (req, res) => {
  console.log("Request to /get-files received"); // Added log
  try {
    const files = await Submission.find();
    res.status(200).json({ status: "ok", data: files });
  } catch (err) {
    console.error("Error fetching files:", err); // Log error for easier debugging
    res.status(500).json({ message: "Error fetching files", error: err });
  }
});

module.exports = router;
