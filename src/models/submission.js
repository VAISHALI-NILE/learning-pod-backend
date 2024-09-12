// models/submission.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String, required: true },
  contentType: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  }, // Reference to User collection
  podId: { type: mongoose.Schema.Types.ObjectId, ref: "pods", required: true }, // Reference to Pod collection
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
