const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");
const Submission = require("../models/submission");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "learning-pod-9a1c8.appspot.com",
});

const bucket = admin.storage().bucket();
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/upload", upload.single("file"), (req, res) => {
  const { title, description, userId, podId, assignedBy } = req.body;

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

      const newSubmission = new Submission({
        title,
        description,
        file: signedUrl,
        contentType: req.file.mimetype,
        userId,
        podId,
        assignedBy,
      });

      await newSubmission.save();

      res.status(200).send({
        message: "File uploaded and submission saved successfully!",
        fileUrl: signedUrl,
        submission: newSubmission,
      });
    } catch (error) {
      console.error("Database Save Error:", error.message);
      res
        .status(500)
        .send({ message: "Failed to save submission to database." });
    }
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
