const express = require("express");
const router = express.Router();
const Pod = require("../models/pods");
const mongoose = require("mongoose");

//create pod
router.post("/", async (req, res) => {
  try {
    const {
      pod_name,
      pod_description,
      is_public,
      created_by,
      members,
      resources,
    } = req.body;

    const pod = new Pod({
      pod_name,
      pod_description,
      is_public,
      created_by,
      unique_code: Math.random().toString(36).substr(2, 8),
      members,
      resources,
    });

    const savedPod = await pod.save();
    res.status(201).json(savedPod);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating pod", error: error.message });
  }
});

//get all pods
router.get("/get-pods", async (req, res) => {
  try {
    const isPublic = req.query.is_public === "true";
    const pods = await Pod.find(isPublic ? { is_public: true } : {});
    res.status(200).json(pods);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pods", error: error.message });
  }
});

// Get a pod by ID
router.get("/:id", async (req, res) => {
  try {
    const podId = req.params.id;
    const pod = await Pod.findById(podId);

    if (!pod) {
      return res.status(404).json({ message: "Pod not found" });
    }

    res.status(200).json(pod);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pod", error: error.message });
  }
});

router.get("/userPods/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find pods where the user is a member
    const pods = await Pod.find({
      "members.user_id": new mongoose.Types.ObjectId(userId),
    });

    if (pods.length > 0) {
      return res.status(200).json(pods); // Send pods the user has joined
    } else {
      return res.status(404).json({ message: "No pods found for this user." });
    }
  } catch (error) {
    console.error("Error fetching pods:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
