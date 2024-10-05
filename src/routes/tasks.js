// src/routes/tasks.js
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();
const Task = require("../models/taskSchema");

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

// Route to create a new task
router.post("/create", async (req, res) => {
  const { taskName, taskDescription, createdBy } = req.body;

  try {
    if (!taskName || !taskDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTask = new Task({
      taskName,
      taskDescription,
      createdBy,
    });

    await newTask.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const tasks = await Task.find({ createdBy: userId });
    console.log(tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
