const mongoose = require("mongoose");

// Your MongoDB URI should include the cluster URL and optional database name
const mongoDB_URI =
  "mongodb+srv://influcoder:nile%40064@learning-pod.0jdk9.mongodb.net/learning_pod?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(mongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
