const express = require("express");
const router = express.Router();
const Pod = require("../models/pods");

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

module.exports = router;
