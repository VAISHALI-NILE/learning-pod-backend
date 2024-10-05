const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Task Schema
const taskSchema = new Schema({
  taskName: {
    type: String,
    required: true,
    trim: true,
  },
  taskDescription: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create and export the Task model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
