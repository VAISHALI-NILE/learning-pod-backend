const express = require("express");
const router = express.Router();
const Notification = require("../models/notificationSchema");
const Pod = require("../models/pods");
const User = require("../models/users");
const mongoose = require("mongoose");

router.post("/create", async (req, res) => {
  try {
    const { userId, podId, podAdminId, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    if (!mongoose.Types.ObjectId.isValid(podId)) {
      return res.status(400).json({ message: "Invalid pod ID format" });
    }

    const notification = new Notification({
      userId,
      podId,
      podAdminId,
      message,
      isAccepted: false, // Default to false
    });

    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating notification", error: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Find notifications for the user
    const notifications = await Notification.find({ userId });

    if (notifications.length > 0) {
      res.status(200).json(notifications);
    } else {
      res
        .status(404)
        .json({ message: "No notifications found for this user." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
});

// Get notifications for a specific pod admin
router.get("/admin/:podAdminId", async (req, res) => {
  try {
    const { podAdminId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(podAdminId)) {
      return res.status(400).json({ message: "Invalid pod admin ID format" });
    }

    const notifications = await Notification.find({ podAdminId });

    if (notifications.length > 0) {
      res.status(200).json(notifications);
    } else {
      res
        .status(404)
        .json({ message: "No notifications found for this pod admin." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
});

// Route to accept a user's request to join a pod (POST request)
router.post("/accept-join", async (req, res) => {
  const { notificationId } = req.body; // Expect notificationId in the body

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res
        .status(400)
        .json({ message: "Invalid notification ID format" });
    }

    // Find the notification by its ID
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.isAccepted) {
      return res
        .status(400)
        .json({ message: "Request has already been accepted" });
    }

    // Find the pod and the user who requested to join
    const pod = await Pod.findById(notification.podId);
    const user = await User.findById(notification.userId);

    if (!pod || !user) {
      return res.status(404).json({ message: "Pod or User not found" });
    }

    // Add the user to the pod's members list
    if (!pod.members.includes(user._id)) {
      // Avoid adding the same user multiple times
      pod.members.push(user._id);
      await pod.save();
    }

    // Update the notification status to accepted
    notification.isAccepted = true;
    await notification.save();

    res.status(200).json({ message: "User has been added to the pod" });
  } catch (error) {
    console.error("Error accepting pod join request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
