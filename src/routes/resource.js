const express = require("express");
const multer = require("multer");
const { bucket } = require("../firebaseConfig");
const Pod = require("../models/pods");
const { extractFileContent } = require("../utils/extractContent"); // Import the extraction function
const { contentWithLLM } = require("../utils/llmService"); // Import the LLM service

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  console.log("hit");
  const { podId, resource_name, uploaded_by } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Extract file content
    const fileContent = await extractFileContent(req.file);
    console.log("Extracted Content:", fileContent);

    // Analyze the content to determine the appropriate folder
    const folderName = await contentWithLLM(fileContent);
    console.log("Determined Folder:", folderName);

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
          expires: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 365
          ).toISOString(), // 1 year from now
        });

        // Find the pod and update it with the new resource
        const pod = await Pod.findByIdAndUpdate(
          podId,
          {
            $push: {
              resources: {
                resource_name,
                resource_url: signedUrl,
                uploaded_by,
                uploaded_at: new Date(),
                folder_name: folderName,
                content: fileContent, // Store the folder name
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
  } catch (error) {
    console.error("Error during file upload:", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
});

module.exports = router;
