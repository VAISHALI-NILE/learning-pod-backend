const express = require("express");
const router = express.Router();
const Pod = require("../models/pods");

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

module.exports = router;
