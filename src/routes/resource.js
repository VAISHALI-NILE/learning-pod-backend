const express = require("express");
const multer = require("multer");
const { bucket } = require("../firebaseConfig");
const Pod = require("../models/pods"); // Import your Pod model

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  console.log("hit");
  // const { podId } = req.params;
  const { podId, resource_name } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (err) => {
    console.error("Blob Stream Error:", err.message);
    res
      .status(500)
      .send({ message: "Failed to upload file to Firebase Cloud Storage." });
  });

  blobStream.on("finish", async () => {
    try {
      const [signedUrl] = await blob.getSignedUrl({
        action: "read",
        expires: "03-01-2025",
      });

      // Find the pod and update it with the new resource
      const pod = await Pod.findByIdAndUpdate(
        podId,
        {
          $push: {
            resources: {
              resource_name,
              resource_url: signedUrl,
              uploaded_by: req.body.uploaded_by, // Ensure this field is provided
              uploaded_at: new Date(),
            },
          },
        },
        { new: true }
      );

      if (!pod) {
        return res.status(404).send({ message: "Pod not found." });
      }

      res.status(200).send({
        message: "Resource added successfully!",
        pod,
      });
    } catch (error) {
      console.error("Database Update Error:", error.message);
      res
        .status(500)
        .send({ message: "Failed to update pod with new resource." });
    }
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
