// src/routes/tasks.js
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();

// Import the Submission model
const Submission = require("../models/submission");

router.get("/get-files", async (req, res) => {
  console.log("Request to /get-files received");
  try {
    const files = await Submission.find();
    res.status(200).json({ status: "ok", data: files });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: "Error fetching files", error: err });
  }
});

module.exports = router;
