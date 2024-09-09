// models/submission.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String, required: true },
  contentType: { type: String, required: true },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
